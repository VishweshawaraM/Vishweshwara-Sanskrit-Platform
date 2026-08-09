import { asc, eq } from "drizzle-orm";
import Link from "next/link";

import { db } from "@/db";
import { assignment, person, submission } from "@/db/schema";
import { ACHARYA_TIMEZONE, formatInZone } from "@/lib/time";

/** The review queue — the highest-traffic screen in the system. */
export default async function ReviewQueuePage() {
  const rows = await db()
    .select({
      id: submission.id,
      attempt: submission.attemptNumber,
      submittedAt: submission.submittedAt,
      isLate: submission.isLate,
      studentName: person.nameLatin,
      title: assignment.title,
    })
    .from(submission)
    .innerJoin(person, eq(submission.studentId, person.id))
    .innerJoin(assignment, eq(submission.assignmentId, assignment.id))
    .where(eq(submission.status, "submitted"))
    .orderBy(asc(submission.submittedAt));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl">Review</h1>
        <p className="text-muted mt-2">
          {rows.length === 0
            ? "Nothing waits for you."
            : `${rows.length} submission${rows.length === 1 ? "" : "s"}, oldest first.`}
        </p>
      </header>

      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.id}>
            <Link
              href={`/acharya/review/${r.id}`}
              className="border-border bg-surface hover:border-primary flex items-baseline justify-between gap-6 rounded-md border px-5 py-4 no-underline transition-colors duration-150"
            >
              <span className="text-heading">
                {r.studentName}
                <span className="text-muted ml-3 text-sm">{r.title}</span>
                {r.attempt > 1 ? (
                  <span className="text-muted ml-2 text-xs">attempt {r.attempt}</span>
                ) : null}
                {r.isLate ? (
                  <span className="text-warning ml-2 text-xs">late</span>
                ) : null}
              </span>
              <span className="text-muted shrink-0 text-sm">
                {formatInZone(r.submittedAt, ACHARYA_TIMEZONE, { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
