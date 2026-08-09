import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { issueCertificate, saveEnrollmentNotes } from "@/app/actions/students";
import { db } from "@/db";
import { abhyasaLog, enrollment, path, person, stage, submission } from "@/db/schema";
import { ACHARYA_TIMEZONE, formatInZone } from "@/lib/time";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const database = db();

  const rows = await database.select().from(person).where(eq(person.id, id)).limit(1);
  const student = rows[0];
  if (!student || student.role !== "student") notFound();

  const enrollments = await database
    .select({
      id: enrollment.id,
      status: enrollment.status,
      notes: enrollment.acharyaNotes,
      pathName: path.nameLatin,
      stageNumber: stage.stageNumber,
      stageLatin: stage.nameLatin,
    })
    .from(enrollment)
    .innerJoin(path, eq(enrollment.pathId, path.id))
    .leftJoin(stage, eq(enrollment.currentStageId, stage.id))
    .where(eq(enrollment.studentId, id));

  const recentAbhyasa = await database
    .select({ practisedOn: abhyasaLog.practisedOn, minutes: abhyasaLog.minutes, what: abhyasaLog.what })
    .from(abhyasaLog)
    .where(eq(abhyasaLog.studentId, id))
    .orderBy(desc(abhyasaLog.practisedOn))
    .limit(7);

  const recentWork = await database
    .select({ id: submission.id, status: submission.status, submittedAt: submission.submittedAt })
    .from(submission)
    .where(eq(submission.studentId, id))
    .orderBy(desc(submission.submittedAt))
    .limit(5);

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl">{student.nameLatin}</h1>
        <p className="text-muted mt-2 text-sm">
          {student.email} · {student.country ?? "country unknown"} · {student.timezone} ·{" "}
          {student.status}
        </p>
      </header>

      {enrollments.map((enr) => (
        <section key={enr.id} className="border-border bg-surface rounded-lg border p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="text-xl">
              {enr.pathName}
              <span className="text-muted ml-3 text-sm">
                {enr.stageNumber ? `Stage ${enr.stageNumber} — ${enr.stageLatin}` : "no stage set"}
              </span>
            </h2>
            <form action={issueCertificate}>
              <input type="hidden" name="studentId" value={student.id} />
              <input type="hidden" name="enrollmentId" value={enr.id} />
              <button className="pressable border-gold-600 text-gold-700 hover:bg-gold-200/40 rounded-md border px-4 py-2 text-sm transition-colors duration-150">
                Issue certificate for current stage
              </button>
            </form>
          </div>

          {/* Private notes — never rendered on any student or parent surface. */}
          <form action={saveEnrollmentNotes} className="mt-6">
            <input type="hidden" name="enrollmentId" value={enr.id} />
            <label className="block">
              <span className="text-muted text-xs tracking-[0.24em] uppercase">
                Private notes — only you ever see these
              </span>
              <textarea
                name="notes"
                rows={3}
                defaultValue={enr.notes ?? ""}
                className="border-border bg-background focus:border-primary mt-2 w-full rounded-md border px-3.5 py-2.5 text-sm outline-none"
              />
            </label>
            <button className="text-muted hover:text-heading mt-2 cursor-pointer text-sm underline underline-offset-4">
              Save notes
            </button>
          </form>
        </section>
      ))}

      <div className="grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="text-muted text-xs tracking-[0.24em] uppercase">Abhyāsa — last 7 entries</h2>
          {recentAbhyasa.length === 0 ? (
            <p className="text-muted mt-3 text-sm">No practice logged.</p>
          ) : (
            <ul className="mt-3 space-y-1.5 text-sm">
              {recentAbhyasa.map((a, i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span>{a.what}</span>
                  <span className="text-muted shrink-0 tabular-nums">
                    {a.practisedOn} · {a.minutes}m
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h2 className="text-muted text-xs tracking-[0.24em] uppercase">Recent submissions</h2>
          {recentWork.length === 0 ? (
            <p className="text-muted mt-3 text-sm">None.</p>
          ) : (
            <ul className="mt-3 space-y-1.5 text-sm">
              {recentWork.map((w) => (
                <li key={w.id} className="flex justify-between gap-4">
                  <span>{w.status.replace(/_/g, " ")}</span>
                  <span className="text-muted shrink-0">
                    {formatInZone(w.submittedAt, ACHARYA_TIMEZONE, { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
