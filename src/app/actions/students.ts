"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { auditLog, certificate, enrollment, path, person, stage } from "@/db/schema";
import { getViewer } from "@/lib/auth/session";
import { newCertificateId } from "@/lib/ids";

/** Acharya: save private notes on an enrollment. Never visible to students. */
export async function saveEnrollmentNotes(formData: FormData) {
  const viewer = await getViewer();
  if (!viewer || viewer.role !== "acharya") redirect("/login");

  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const notes = String(formData.get("notes") ?? "");

  await db()
    .update(enrollment)
    .set({ acharyaNotes: notes })
    .where(eq(enrollment.id, enrollmentId));

  revalidatePath(`/acharya/students`);
}

/**
 * Acharya: issue a certificate. Always an explicit act; every displayed value
 * snapshotted at issue (docs/07 §7).
 */
export async function issueCertificate(formData: FormData) {
  const viewer = await getViewer();
  if (!viewer || viewer.role !== "acharya") redirect("/login");

  const studentId = String(formData.get("studentId") ?? "");
  const enrollmentId = String(formData.get("enrollmentId") ?? "");

  const rows = await db()
    .select({
      studentName: person.nameLatin,
      studentDeva: person.nameDevanagari,
      pathId: path.id,
      pathLatin: path.nameLatin,
      pathDeva: path.nameDevanagari,
      stageId: stage.id,
      stageLatin: stage.nameLatin,
    })
    .from(enrollment)
    .innerJoin(person, eq(enrollment.studentId, person.id))
    .innerJoin(path, eq(enrollment.pathId, path.id))
    .leftJoin(stage, eq(enrollment.currentStageId, stage.id))
    .where(and(eq(enrollment.id, enrollmentId), eq(enrollment.studentId, studentId)))
    .limit(1);

  const source = rows[0];
  if (!source) redirect("/acharya/students");

  const publicId = newCertificateId();

  await db().insert(certificate).values({
    publicId,
    studentId,
    pathId: source.pathId,
    stageId: source.stageId,
    kind: source.stageId ? "stage_completion" : "participation",
    holderNameLatin: source.studentName,
    holderNameDevanagari: source.studentDeva,
    pathNameLatin: source.pathLatin,
    pathNameDevanagari: source.pathDeva,
    stageNameLatin: source.stageLatin,
    acharyaName: "Vishweshwara M",
    institutionName: "Vishweshwara Sanskrit",
    issuedOnGregorian: new Date().toISOString().slice(0, 10),
    issuedBy: viewer.id,
  });

  await db().insert(auditLog).values({
    actorPersonId: viewer.id,
    action: "certificate.issued",
    entityType: "certificate",
    entityId: publicId,
    detail: { studentId, enrollmentId },
  });

  redirect(`/verify/${publicId}`);
}
