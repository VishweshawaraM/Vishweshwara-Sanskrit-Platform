import { and, asc, eq, gte, lt, sql } from "drizzle-orm";
import Link from "next/link";

import { db } from "@/db";
import { application, path, person, session, submission } from "@/db/schema";
import { getViewer } from "@/lib/auth/session";
import { ACHARYA_TIMEZONE, formatInZone } from "@/lib/time";

/**
 * The morning screen (docs/06 §2). Today's sessions, work awaiting review
 * oldest first, applications awaiting decision. Nothing else — if a screen
 * earns being opened every day, it must not be a dashboard of charts.
 */
export default async function AcharyaHome() {
  const viewer = (await getViewer())!;
  const database = db();

  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const today = await database
    .select({
      id: session.id,
      start: session.scheduledStartUtc,
      kind: session.kind,
      joinUrl: session.zoomJoinUrl,
      pathName: path.nameLatin,
    })
    .from(session)
    .leftJoin(path, eq(session.pathId, path.id))
    .where(
      and(
        eq(session.status, "scheduled"),
        gte(session.scheduledStartUtc, dayStart),
        lt(session.scheduledStartUtc, dayEnd),
      ),
    )
    .orderBy(asc(session.scheduledStartUtc));

  const queue = await database
    .select({
      id: submission.id,
      submittedAt: submission.submittedAt,
      studentName: person.nameLatin,
    })
    .from(submission)
    .innerJoin(person, eq(submission.studentId, person.id))
    .where(eq(submission.status, "submitted"))
    .orderBy(asc(submission.submittedAt))
    .limit(10);

  const [pendingApplications] = await database
    .select({ n: sql<number>`count(*)::int` })
    .from(application)
    .where(eq(application.status, "new"));

  return (
    <div className="space-y-12">
      <header>
        <p className="text-muted text-xs tracking-[0.28em] uppercase">
          {formatInZone(new Date(), ACHARYA_TIMEZONE, { dateStyle: "full", timeStyle: undefined })}
        </p>
        <h1 className="mt-2 text-3xl">Namaste, {viewer.nameLatin.split(" ")[0]}</h1>
      </header>

      <section aria-labelledby="today">
        <h2 id="today" className="text-muted text-xs tracking-[0.24em] uppercase">
          Today&rsquo;s sessions — IST
        </h2>
        {today.length === 0 ? (
          <p className="text-muted mt-4">No sessions today.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {today.map((s) => (
              <li
                key={s.id}
                className="border-border bg-surface flex items-center justify-between gap-6 rounded-lg border p-5"
              >
                <div>
                  <p className="text-heading">
                    {formatInZone(s.start, ACHARYA_TIMEZONE, { dateStyle: undefined, timeStyle: "short" })}
                    <span className="text-muted ml-3 text-sm">{s.pathName ?? s.kind}</span>
                  </p>
                </div>
                {s.joinUrl ? (
                  <a
                    href={s.joinUrl}
                    className="pressable bg-primary text-parchment-50 hover:bg-maroon-800 inline-flex h-10 items-center rounded-md px-5 text-sm no-underline transition-colors duration-200"
                  >
                    Join
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-10 md:grid-cols-2">
        <section aria-labelledby="queue">
          <h2 id="queue" className="text-muted text-xs tracking-[0.24em] uppercase">
            Awaiting your review — oldest first
          </h2>
          {queue.length === 0 ? (
            <p className="text-muted mt-4">The queue is empty.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {queue.map((q) => (
                <li key={q.id}>
                  <Link
                    href={`/acharya/review/${q.id}`}
                    className="border-border bg-surface hover:border-primary flex items-baseline justify-between gap-4 rounded-md border px-4 py-3 no-underline transition-colors duration-150"
                  >
                    <span className="text-heading text-sm">{q.studentName}</span>
                    <span className="text-muted shrink-0 text-xs">
                      {formatInZone(q.submittedAt, ACHARYA_TIMEZONE, { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="apps">
          <h2 id="apps" className="text-muted text-xs tracking-[0.24em] uppercase">
            Admissions
          </h2>
          <Link
            href="/acharya/applications"
            className="border-border bg-surface hover:border-primary mt-4 block rounded-lg border p-5 no-underline transition-colors duration-150"
          >
            <p className="text-heading text-2xl tabular-nums">{pendingApplications?.n ?? 0}</p>
            <p className="text-muted mt-1 text-sm">requests awaiting your decision</p>
          </Link>
        </section>
      </div>
    </div>
  );
}
