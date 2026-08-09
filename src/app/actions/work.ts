"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import {
  abhyasaLog,
  assignment,
  assignmentTarget,
  auditLog,
  enrollment,
  review,
  submission,
} from "@/db/schema";
import { getViewer } from "@/lib/auth/session";
import { assertValidDevanagari } from "@/lib/sanskrit";

/** Student: submit work for an assignment targeted at them. */
export async function submitWork(formData: FormData) {
  const viewer = await getViewer();
  if (!viewer || viewer.role !== "student") redirect("/login");

  const assignmentId = String(formData.get("assignmentId") ?? "");
  const bodyText = String(formData.get("bodyText") ?? "").trim();
  const bodyDevanagari = String(formData.get("bodyDevanagari") ?? "").trim();

  if (!bodyText && !bodyDevanagari) return;

  // Authorization: the assignment must actually target this student.
  const target = await db()
    .select({ id: assignmentTarget.id, dueAt: assignment.dueAt })
    .from(assignmentTarget)
    .innerJoin(assignment, eq(assignmentTarget.assignmentId, assignment.id))
    .where(
      and(
        eq(assignmentTarget.assignmentId, assignmentId),
        eq(assignmentTarget.studentId, viewer.id),
      ),
    )
    .limit(1);
  if (!target[0]) redirect("/portal");

  // Devanagari is validated at the boundary — corrupted text never lands.
  const devanagari = bodyDevanagari
    ? assertValidDevanagari(bodyDevanagari, "submission.body_devanagari")
    : null;

  const attempt = await db()
    .select({ n: sql<number>`coalesce(max(${submission.attemptNumber}), 0) + 1` })
    .from(submission)
    .where(
      and(
        eq(submission.assignmentId, assignmentId),
        eq(submission.studentId, viewer.id),
      ),
    );

  await db().insert(submission).values({
    assignmentId,
    studentId: viewer.id,
    attemptNumber: attempt[0]?.n ?? 1,
    bodyText: bodyText || null,
    bodyDevanagari: devanagari,
    isLate: target[0].dueAt ? new Date() > target[0].dueAt : false,
  });

  revalidatePath("/portal");
  redirect("/portal");
}

/** Student: log a day of Abhyāsa. Self-reported, never graded. */
export async function logAbhyasa(formData: FormData) {
  const viewer = await getViewer();
  if (!viewer || viewer.role !== "student") redirect("/login");

  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const minutes = Number(formData.get("minutes") ?? 0);
  const what = String(formData.get("what") ?? "").trim();
  const practisedOn = String(formData.get("practisedOn") ?? "");

  if (!what || !minutes || minutes < 1) return;

  const owned = await db()
    .select({ id: enrollment.id })
    .from(enrollment)
    .where(and(eq(enrollment.id, enrollmentId), eq(enrollment.studentId, viewer.id)))
    .limit(1);
  if (!owned[0]) redirect("/portal");

  await db()
    .insert(abhyasaLog)
    .values({
      enrollmentId,
      studentId: viewer.id,
      practisedOn: practisedOn || new Date().toISOString().slice(0, 10),
      minutes: Math.min(minutes, 600),
      what,
    })
    .onConflictDoUpdate({
      target: [abhyasaLog.enrollmentId, abhyasaLog.practisedOn],
      set: { minutes: Math.min(minutes, 600), what },
    });

  revalidatePath("/portal/abhyasa");
  redirect("/portal/abhyasa");
}

/** Acharya: review a submission — feedback, grade, resubmission request. */
export async function reviewSubmission(formData: FormData) {
  const viewer = await getViewer();
  if (!viewer || viewer.role !== "acharya") redirect("/login");

  const submissionId = String(formData.get("submissionId") ?? "");
  const gradeRaw = String(formData.get("grade") ?? "");
  const feedback = String(formData.get("feedback") ?? "").trim();
  const requiresResubmission = formData.get("requiresResubmission") === "on";

  if (!feedback) return;

  const grades = ["uttamam", "madhyamam", "sadharanam", "punarabhyasah"] as const;
  const grade = (grades as readonly string[]).includes(gradeRaw)
    ? (gradeRaw as (typeof grades)[number])
    : null;

  await db().insert(review).values({
    submissionId,
    reviewedBy: viewer.id,
    grade,
    feedback,
    requiresResubmission,
  });

  await db()
    .update(submission)
    .set({ status: requiresResubmission ? "resubmission_requested" : "reviewed" })
    .where(eq(submission.id, submissionId));

  // Grades are consequential acts: audited, append-only.
  await db().insert(auditLog).values({
    actorPersonId: viewer.id,
    action: "submission.reviewed",
    entityType: "submission",
    entityId: submissionId,
    detail: { grade, requiresResubmission },
  });

  revalidatePath("/acharya/review");
  redirect("/acharya/review");
}
