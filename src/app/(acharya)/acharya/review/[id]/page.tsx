import { and, asc, eq, ne } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { reviewSubmission } from "@/app/actions/work";
import { db } from "@/db";
import { assignment, person, submission } from "@/db/schema";
import { ACHARYA_TIMEZONE, formatInZone } from "@/lib/time";

/**
 * Review one submission. The four-grade scale is the traditional one; the
 * next queued submission is linked so the flow never returns to the list
 * between reviews — at ninety reviews a week, that matters.
 */
export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const database = db();

  const rows = await database
    .select({
      id: submission.id,
      attempt: submission.attemptNumber,
      submittedAt: submission.submittedAt,
      bodyText: submission.bodyText,
      bodyDevanagari: submission.bodyDevanagari,
      isLate: submission.isLate,
      status: submission.status,
      studentName: person.nameLatin,
      title: assignment.title,
      brief: assignment.brief,
    })
    .from(submission)
    .innerJoin(person, eq(submission.studentId, person.id))
    .innerJoin(assignment, eq(submission.assignmentId, assignment.id))
    .where(eq(submission.id, id))
    .limit(1);

  const item = rows[0];
  if (!item) notFound();

  const nextInQueue = await database
    .select({ id: submission.id })
    .from(submission)
    .where(and(eq(submission.status, "submitted"), ne(submission.id, id)))
    .orderBy(asc(submission.submittedAt))
    .limit(1);

  const GRADES = [
    { value: "uttamam", deva: "उत्तमम्", label: "Uttamam" },
    { value: "madhyamam", deva: "मध्यमम्", label: "Madhyamam" },
    { value: "sadharanam", deva: "साधारणम्", label: "Sādhāraṇam" },
    { value: "punarabhyasah", deva: "पुनरभ्यासः", label: "Practise again" },
  ];

  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-8">
        <header>
          <p className="text-muted text-xs tracking-[0.24em] uppercase">
            {item.title} · attempt {item.attempt}
            {item.isLate ? " · late" : ""}
          </p>
          <h1 className="mt-2 text-3xl">{item.studentName}</h1>
          <p className="text-muted mt-1 text-sm">
            Submitted {formatInZone(item.submittedAt, ACHARYA_TIMEZONE, { dateStyle: "full", timeStyle: "short" })}
          </p>
        </header>

        <section className="border-border bg-surface rounded-lg border p-6">
          <h2 className="text-muted text-xs tracking-[0.24em] uppercase">The work set</h2>
          <p className="text-muted mt-3 text-sm leading-relaxed whitespace-pre-line">{item.brief}</p>
        </section>

        {item.bodyDevanagari ? (
          <section className="border-border bg-surface rounded-lg border p-6">
            <h2 className="text-muted text-xs tracking-[0.24em] uppercase">In Devanagari</h2>
            <p lang="sa" className="deva mt-4 text-xl leading-loose whitespace-pre-line">
              {item.bodyDevanagari}
            </p>
          </section>
        ) : null}

        {item.bodyText ? (
          <section className="border-border bg-surface rounded-lg border p-6">
            <h2 className="text-muted text-xs tracking-[0.24em] uppercase">Answer</h2>
            <p className="mt-4 leading-relaxed whitespace-pre-line">{item.bodyText}</p>
          </section>
        ) : null}
      </div>

      <aside>
        {item.status === "submitted" ? (
          <form
            action={reviewSubmission}
            className="border-border bg-surface sticky top-8 space-y-6 rounded-lg border p-7 shadow-[var(--shadow-raised)]"
          >
            <input type="hidden" name="submissionId" value={item.id} />

            <fieldset>
              <legend className="text-sm font-medium">Grade</legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {GRADES.map((g) => (
                  <label
                    key={g.value}
                    className="border-border bg-background has-checked:border-primary has-checked:bg-maroon-100 flex cursor-pointer flex-col rounded-md border px-4 py-3"
                  >
                    <input type="radio" name="grade" value={g.value} className="sr-only" />
                    <span lang="sa" className="deva text-primary">{g.deva}</span>
                    <span className="text-muted mt-0.5 text-xs">{g.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block">
              <span className="text-sm font-medium">Feedback — in your words</span>
              <textarea
                name="feedback"
                required
                rows={6}
                className="border-border bg-background focus:border-primary mt-2 w-full rounded-md border px-3.5 py-2.5 outline-none"
              />
            </label>

            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="requiresResubmission" />
              Ask for resubmission
            </label>

            <button className="pressable bg-primary text-parchment-50 hover:bg-maroon-800 h-11 w-full rounded-md text-sm font-medium transition-colors duration-200">
              Send feedback
            </button>

            {nextInQueue[0] ? (
              <p className="text-muted text-center text-xs">
                Then:{" "}
                <Link href={`/acharya/review/${nextInQueue[0].id}`}>next in queue</Link>
              </p>
            ) : null}
          </form>
        ) : (
          <p className="text-muted">Already reviewed.</p>
        )}
      </aside>
    </div>
  );
}
