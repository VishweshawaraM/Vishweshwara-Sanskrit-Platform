"use server";

import { and, asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import {
  application,
  assignment,
  assignmentTarget,
  auditLog,
  enrollment,
  person,
  session,
  sessionParticipant,
  stage,
} from "@/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { getViewer } from "@/lib/auth/session";

/** IST has no daylight saving, so a fixed offset is exact all year. */
const IST_OFFSET = "+05:30";

async function requireAcharya() {
  const viewer = await getViewer();
  if (!viewer || viewer.role !== "acharya") redirect("/login");
  return viewer;
}

/** First stage of a path — where a new enrollment begins. */
async function firstStageOf(pathId: string) {
  const [first] = await db()
    .select({ id: stage.id })
    .from(stage)
    .where(eq(stage.pathId, pathId))
    .orderBy(asc(stage.stageNumber))
    .limit(1);
  return first?.id ?? null;
}

type NewStudent = {
  name: string;
  nameDevanagari: string | null;
  email: string;
  password: string;
  country: string | null;
  timezone: string;
  pathId: string;
};

async function createStudentAndEnrol(input: NewStudent, acharyaId: string) {
  const [student] = await db()
    .insert(person)
    .values({
      role: "student",
      email: input.email,
      nameLatin: input.name,
      nameDevanagari: input.nameDevanagari,
      country: input.country,
      timezone: input.timezone,
      passwordHash: hashPassword(input.password),
    })
    .returning();

  if (!student) return null;

  await db().insert(enrollment).values({
    studentId: student.id,
    pathId: input.pathId,
    currentStageId: await firstStageOf(input.pathId),
    startedOn: new Date().toISOString().slice(0, 10),
  });

  await db().insert(auditLog).values({
    actorPersonId: acharyaId,
    action: "student.enrolled",
    entityType: "person",
    entityId: student.id,
    detail: { email: input.email, pathId: input.pathId },
  });

  return student;
}

/** Add a student directly — for those the Acharya already teaches. */
export async function addStudent(_prev: { error: string }, formData: FormData) {
  const viewer = await requireAcharya();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const pathId = String(formData.get("pathId") ?? "");

  if (!name || !email || !pathId) return { error: "Name, email and path are required." };
  if (password.length < 8) return { error: "Give the student a temporary password of at least 8 characters." };

  const existing = await db()
    .select({ id: person.id })
    .from(person)
    .where(eq(person.email, email))
    .limit(1);
  if (existing[0]) return { error: "Someone with that email already exists." };

  const student = await createStudentAndEnrol(
    {
      name,
      nameDevanagari: String(formData.get("nameDevanagari") ?? "").trim() || null,
      email,
      password,
      country: String(formData.get("country") ?? "").trim() || null,
      timezone: String(formData.get("timezone") ?? "Asia/Kolkata"),
      pathId,
    },
    viewer.id,
  );

  if (!student) return { error: "Could not create the student." };
  redirect(`/acharya/students/${student.id}`);
}

/** Admit an applicant: creates their account and enrols them in one act. */
export async function admitApplicant(_prev: { error: string }, formData: FormData) {
  const viewer = await requireAcharya();

  const applicationId = String(formData.get("applicationId") ?? "");
  const pathId = String(formData.get("pathId") ?? "");
  const password = String(formData.get("password") ?? "");
  const timezone = String(formData.get("timezone") ?? "Asia/Kolkata");

  if (!pathId) return { error: "Choose a path for this student." };
  if (password.length < 8) return { error: "Give a temporary password of at least 8 characters." };

  const [app] = await db()
    .select()
    .from(application)
    .where(eq(application.id, applicationId))
    .limit(1);
  if (!app) return { error: "That request no longer exists." };
  if (app.status === "enrolled") return { error: "Already enrolled." };

  const existing = await db()
    .select({ id: person.id })
    .from(person)
    .where(eq(person.email, app.email))
    .limit(1);
  if (existing[0]) return { error: "Someone with that email already exists." };

  const student = await createStudentAndEnrol(
    {
      name: app.name,
      nameDevanagari: null,
      email: app.email,
      password,
      country: app.location,
      timezone,
      pathId,
    },
    viewer.id,
  );
  if (!student) return { error: "Could not create the student." };

  await db()
    .update(application)
    .set({
      status: "enrolled",
      decidedBy: viewer.id,
      decidedAt: new Date(),
      createdPersonId: student.id,
    })
    .where(eq(application.id, applicationId));

  redirect(`/acharya/students/${student.id}`);
}

/** Record the Acharya's decision on an application without enrolling. */
export async function decideApplication(formData: FormData) {
  const viewer = await requireAcharya();
  const applicationId = String(formData.get("applicationId") ?? "");
  const decision = String(formData.get("decision") ?? "");

  if (decision !== "waitlisted" && decision !== "declined") return;

  await db()
    .update(application)
    .set({ status: decision, decidedBy: viewer.id, decidedAt: new Date() })
    .where(eq(application.id, applicationId));

  revalidatePath("/acharya/applications");
}

/** Set work for one student. */
export async function setAssignment(formData: FormData) {
  const viewer = await requireAcharya();

  const studentId = String(formData.get("studentId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const brief = String(formData.get("brief") ?? "").trim();
  const dueLocal = String(formData.get("dueAt") ?? "");

  if (!studentId || !title || !brief) return;

  const [enr] = await db()
    .select({ pathId: enrollment.pathId, stageId: enrollment.currentStageId })
    .from(enrollment)
    .where(and(eq(enrollment.studentId, studentId), eq(enrollment.status, "active")))
    .limit(1);

  const [work] = await db()
    .insert(assignment)
    .values({
      pathId: enr?.pathId ?? null,
      stageId: enr?.stageId ?? null,
      title,
      brief,
      dueAt: dueLocal ? new Date(`${dueLocal}:00${IST_OFFSET}`) : null,
      createdBy: viewer.id,
    })
    .returning();

  if (work) {
    await db().insert(assignmentTarget).values({ assignmentId: work.id, studentId });
  }

  revalidatePath(`/acharya/students/${studentId}`);
}

/** Schedule one class. Times are entered in IST — the Acharya's calendar. */
export async function scheduleSession(formData: FormData) {
  const viewer = await requireAcharya();

  const studentId = String(formData.get("studentId") ?? "");
  const startLocal = String(formData.get("startAt") ?? "");
  const minutes = Number(formData.get("minutes") ?? 60);
  const joinUrl = String(formData.get("joinUrl") ?? "").trim() || null;

  if (!studentId || !startLocal) return;

  const start = new Date(`${startLocal}:00${IST_OFFSET}`);
  const end = new Date(start.getTime() + Math.min(Math.max(minutes, 15), 240) * 60_000);

  const [enr] = await db()
    .select({ pathId: enrollment.pathId })
    .from(enrollment)
    .where(and(eq(enrollment.studentId, studentId), eq(enrollment.status, "active")))
    .limit(1);

  const [created] = await db()
    .insert(session)
    .values({
      pathId: enr?.pathId ?? null,
      scheduledStartUtc: start,
      scheduledEndUtc: end,
      zoomJoinUrl: joinUrl,
      taughtBy: viewer.id,
    })
    .returning();

  if (created) {
    await db().insert(sessionParticipant).values({ sessionId: created.id, studentId });
  }

  revalidatePath(`/acharya/students/${studentId}`);
}

/** Mark a syllabus item mastered — always an explicit act (PRD §1). */
export async function markItem(formData: FormData) {
  const viewer = await requireAcharya();
  const { itemProgress } = await import("@/db/schema");

  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  const status = String(formData.get("status") ?? "");
  const allowed = ["not_started", "in_progress", "completed", "mastered"] as const;
  if (!(allowed as readonly string[]).includes(status)) return;

  await db()
    .insert(itemProgress)
    .values({
      enrollmentId,
      syllabusItemId: itemId,
      status: status as (typeof allowed)[number],
      markedBy: viewer.id,
      markedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [itemProgress.enrollmentId, itemProgress.syllabusItemId],
      set: {
        status: status as (typeof allowed)[number],
        markedBy: viewer.id,
        markedAt: new Date(),
      },
    });

  await db().insert(auditLog).values({
    actorPersonId: viewer.id,
    action: "progress.marked",
    entityType: "item_progress",
    entityId: itemId,
    detail: { enrollmentId, status },
  });

  revalidatePath("/acharya/students");
}
