import { and, desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { submitWork } from "@/app/actions/work";
import { db } from "@/db";
import { assignment, assignmentTarget, review, submission } from "@/db/schema";
import { getViewer } from "@/lib/auth/session";
import { formatInZone } from "@/lib/time";

export default async function WorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const viewer = (await getViewer())!;
  const database = db();

  const rows = await database
    .select({
      id: assignment.id,
      title: assignment.title,
      brief: assignment.brief,
      dueAt: assignment.dueAt,
    })
    .from(assignmentTarget)
    .innerJoin(assignment, eq(assignmentTarget.assignmentId, assignment.id))
    .where(and(eq(assignment.id, id), eq(assignmentTarget.studentId, viewer.id)))
    .limit(1);

  const work = rows[0];
  if (!work) notFound();

  const history = await database
    .select({
      id: submission.id,
      attempt: submission.attemptNumber,
      status: submission.status,
      submittedAt: submission.submittedAt,
      feedback: review.feedback,
      grade: review.grade,
    })
    .from(submission)
    .leftJoin(review, eq(review.submissionId, submission.id))
    .where(and(eq(submission.assignmentId, id), eq(submission.studentId, viewer.id)))
    .orderBy(desc(submission.attemptNumber));

  const open =
    history.length === 0 || history[0]?.status === "resubmission_requested";

  return (
    <div className="max-w-2xl space-y-10">
      <header>
        <p className="text-ink-muted text-xs tracking-[0.24em] uppercase">Assigned work</p>
        <h1 className="mt-2 text-3xl">{work.title}</h1>
        {work.dueAt ? (
          <p className="text-ink-muted mt-2 text-sm">
            Due {formatInZone(work.dueAt, viewer.timezone, { dateStyle: "full", timeStyle: "short" })}{" "}
            (your time)
          </p>
        ) : null}
      </header>

      <section className="border-ink-700 bg-ink-900 rounded-lg border p-6">
        <p className="leading-relaxed whitespace-pre-line">{work.brief}</p>
      </section>

      {open ? (
        <form action={submitWork} className="space-y-6">
          <input type="hidden" name="assignmentId" value={work.id} />
          <label className="block">
            <span className="text-sm">Your answer</span>
            <textarea
              name="bodyText"
              rows={6}
              className="border-ink-700 bg-ink-900 text-ink-fg focus:border-gold-600 mt-2 w-full rounded-md border px-3.5 py-2.5 outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm">
              In Devanagari, where the work asks for it{" "}
              <span className="text-ink-muted">(checked for corruption on submit)</span>
            </span>
            <textarea
              name="bodyDevanagari"
              lang="sa"
              rows={4}
              className="deva border-ink-700 bg-ink-900 text-ink-fg focus:border-gold-600 mt-2 w-full rounded-md border px-3.5 py-2.5 text-lg outline-none"
            />
          </label>
          <button className="pressable bg-gold-500 text-ink-950 hover:bg-gold-200 h-11 rounded-md px-7 text-sm font-medium transition-colors duration-200">
            Submit to the Acharya
          </button>
        </form>
      ) : (
        <p className="text-ink-muted">
          Submitted. You will see the Acharya&rsquo;s feedback here when it is ready.
        </p>
      )}

      {history.length > 0 ? (
        <section>
          <h2 className="text-ink-muted text-xs tracking-[0.24em] uppercase">History</h2>
          <ul className="mt-4 space-y-3">
            {history.map((h) => (
              <li key={h.id} className="border-ink-700 bg-ink-900 rounded-lg border p-5">
                <p className="text-ink-muted text-sm">
                  Attempt {h.attempt} ·{" "}
                  {formatInZone(h.submittedAt, viewer.timezone, { dateStyle: "medium", timeStyle: "short" })}{" "}
                  · {h.status.replace(/_/g, " ")}
                </p>
                {h.feedback ? (
                  <p className="mt-3 leading-relaxed">{h.feedback}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
