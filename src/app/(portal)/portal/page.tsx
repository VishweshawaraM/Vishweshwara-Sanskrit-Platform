import { and, asc, eq, gte, notInArray, sql } from "drizzle-orm";
import Link from "next/link";

import { db } from "@/db";
import {
  assignment,
  assignmentTarget,
  enrollment,
  path,
  review,
  session,
  sessionParticipant,
  stage,
  submission,
} from "@/db/schema";
import { getViewer } from "@/lib/auth/session";
import { formatInZone } from "@/lib/time";

/**
 * The student's home answers three questions above the fold:
 * when is my next class (in MY timezone), what do I owe, where am I.
 */
export default async function PortalHome() {
  const viewer = (await getViewer())!;
  const database = db();

  const nextSessions = await database
    .select({
      id: session.id,
      start: session.scheduledStartUtc,
      kind: session.kind,
      joinUrl: session.zoomJoinUrl,
      pathName: path.nameLatin,
    })
    .from(sessionParticipant)
    .innerJoin(session, eq(sessionParticipant.sessionId, session.id))
    .leftJoin(path, eq(session.pathId, path.id))
    .where(
      and(
        eq(sessionParticipant.studentId, viewer.id),
        eq(session.status, "scheduled"),
        gte(session.scheduledStartUtc, new Date()),
      ),
    )
    .orderBy(asc(session.scheduledStartUtc))
    .limit(3);

  // Assignments targeted at me with no live submission from me.
  const mySubmitted = database
    .select({ id: submission.assignmentId })
    .from(submission)
    .where(
      and(
        eq(submission.studentId, viewer.id),
        notInArray(submission.status, ["resubmission_requested"]),
      ),
    );

  const owed = await database
    .select({
      id: assignment.id,
      title: assignment.title,
      dueAt: assignment.dueAt,
      pathName: path.nameLatin,
    })
    .from(assignmentTarget)
    .innerJoin(assignment, eq(assignmentTarget.assignmentId, assignment.id))
    .leftJoin(path, eq(assignment.pathId, path.id))
    .where(
      and(
        eq(assignmentTarget.studentId, viewer.id),
        notInArray(assignment.id, mySubmitted),
      ),
    )
    .orderBy(asc(assignment.dueAt))
    .limit(10);

  const positions = await database
    .select({
      pathName: path.nameLatin,
      pathDeva: path.nameDevanagari,
      stageNumber: stage.stageNumber,
      stageLatin: stage.nameLatin,
    })
    .from(enrollment)
    .innerJoin(path, eq(enrollment.pathId, path.id))
    .leftJoin(stage, eq(enrollment.currentStageId, stage.id))
    .where(and(eq(enrollment.studentId, viewer.id), eq(enrollment.status, "active")));

  // Latest feedback to me.
  const myLatestReviews = await database
    .select({
      feedback: review.feedback,
      grade: review.grade,
      reviewedAt: review.reviewedAt,
      title: assignment.title,
    })
    .from(review)
    .innerJoin(submission, eq(review.submissionId, submission.id))
    .innerJoin(assignment, eq(submission.assignmentId, assignment.id))
    .where(eq(submission.studentId, viewer.id))
    .orderBy(sql`${review.reviewedAt} desc`)
    .limit(1);

  const GRADE_LABEL: Record<string, string> = {
    uttamam: "उत्तमम् · Uttamam",
    madhyamam: "मध्यमम् · Madhyamam",
    sadharanam: "साधारणम् · Sādhāraṇam",
    punarabhyasah: "पुनरभ्यासः · Practise again",
  };

  const next = nextSessions[0];

  return (
    <div className="space-y-12">
      <header>
        <p className="text-gold-500 text-xs tracking-[0.28em] uppercase">Namaste</p>
        <h1 className="mt-2 text-3xl">{viewer.nameLatin}</h1>
      </header>

      {/* Next class — in the student's own timezone, stated explicitly. */}
      <section aria-labelledby="next-class">
        <h2 id="next-class" className="text-ink-muted text-xs tracking-[0.24em] uppercase">
          Next class
        </h2>
        {next ? (
          <div className="border-ink-700 bg-ink-900 mt-4 rounded-lg border p-7">
            <p className="text-2xl">
              {formatInZone(next.start, viewer.timezone, { dateStyle: "full", timeStyle: "short" })}
            </p>
            <p className="text-ink-muted mt-2 text-sm">
              {next.pathName ?? "Session"} · shown in your timezone ({viewer.timezone})
            </p>
            {next.joinUrl ? (
              <a
                href={next.joinUrl}
                className="pressable bg-gold-500 text-ink-950 hover:bg-gold-200 mt-5 inline-flex h-11 items-center rounded-md px-6 text-sm font-medium no-underline transition-colors duration-200"
              >
                Join over Zoom
              </a>
            ) : (
              <p className="text-ink-muted mt-4 text-sm">The join link will appear here.</p>
            )}
          </div>
        ) : (
          <p className="text-ink-muted mt-4">No class is scheduled yet.</p>
        )}
      </section>

      {/* What I owe */}
      <section aria-labelledby="owed">
        <h2 id="owed" className="text-ink-muted text-xs tracking-[0.24em] uppercase">
          Work to submit
        </h2>
        {owed.length === 0 ? (
          <p className="text-ink-muted mt-4">Nothing outstanding. Continue your Abhyāsa.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {owed.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/portal/work/${item.id}`}
                  className="border-ink-700 bg-ink-900 hover:border-gold-600 flex items-baseline justify-between gap-6 rounded-lg border p-5 no-underline transition-colors duration-200"
                >
                  <span className="text-ink-fg">{item.title}</span>
                  <span className="text-ink-muted shrink-0 text-sm">
                    {item.dueAt
                      ? `due ${formatInZone(item.dueAt, viewer.timezone, { dateStyle: "medium", timeStyle: "short" })}`
                      : "no due date"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Where I stand + latest feedback */}
      <div className="grid gap-10 md:grid-cols-2">
        <section aria-labelledby="position">
          <h2 id="position" className="text-ink-muted text-xs tracking-[0.24em] uppercase">
            Where you stand
          </h2>
          <ul className="mt-4 space-y-3">
            {positions.map((p) => (
              <li key={p.pathName} className="border-ink-700 bg-ink-900 rounded-lg border p-5">
                {p.pathDeva ? (
                  <p lang="sa" className="deva text-gold-500 text-sm">{p.pathDeva}</p>
                ) : null}
                <p className="text-ink-fg mt-1">{p.pathName}</p>
                <p className="text-ink-muted mt-1 text-sm">
                  {p.stageNumber
                    ? `Stage ${p.stageNumber} — ${p.stageLatin}`
                    : "Starting stage to be set by the Acharya"}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="feedback">
          <h2 id="feedback" className="text-ink-muted text-xs tracking-[0.24em] uppercase">
            Latest feedback
          </h2>
          {myLatestReviews[0] ? (
            <div className="border-ink-700 bg-ink-900 mt-4 rounded-lg border p-5">
              <p className="text-ink-muted text-sm">{myLatestReviews[0].title}</p>
              {myLatestReviews[0].grade ? (
                <p lang="sa" className="deva text-gold-500 mt-2">
                  {GRADE_LABEL[myLatestReviews[0].grade]}
                </p>
              ) : null}
              <p className="text-ink-fg mt-3 leading-relaxed">{myLatestReviews[0].feedback}</p>
            </div>
          ) : (
            <p className="text-ink-muted mt-4">None yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
