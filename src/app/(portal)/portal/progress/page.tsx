import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { enrollment, itemProgress, path, stage, syllabusItem } from "@/db/schema";
import { getViewer } from "@/lib/auth/session";

/**
 * Progress is a position, not a percentage. There is no completion bar
 * anywhere on this page by design — mastery is the Acharya's judgment.
 */
export default async function ProgressPage() {
  const viewer = (await getViewer())!;
  const database = db();

  const enrollments = await database
    .select({
      id: enrollment.id,
      pathId: enrollment.pathId,
      pathName: path.nameLatin,
      pathDeva: path.nameDevanagari,
      currentStageId: enrollment.currentStageId,
    })
    .from(enrollment)
    .innerJoin(path, eq(enrollment.pathId, path.id))
    .where(eq(enrollment.studentId, viewer.id));

  const STATUS_LABEL: Record<string, string> = {
    not_started: "not started",
    in_progress: "in progress",
    completed: "completed",
    mastered: "mastered ✓",
  };

  return (
    <div className="space-y-14">
      <header>
        <h1 className="text-3xl">Your position</h1>
        <p className="text-ink-muted mt-3 max-w-xl leading-relaxed">
          Progression follows the Acharya&rsquo;s judgment of mastery — there
          are no percentages here, and completing items does not advance you
          by itself.
        </p>
      </header>

      {await Promise.all(
        enrollments.map(async (enr) => {
          const stages = await database
            .select({ id: stage.id, number: stage.stageNumber, latin: stage.nameLatin, deva: stage.nameDevanagari })
            .from(stage)
            .where(eq(stage.pathId, enr.pathId))
            .orderBy(asc(stage.stageNumber));

          const progress = await database
            .select({
              itemId: itemProgress.syllabusItemId,
              status: itemProgress.status,
            })
            .from(itemProgress)
            .where(eq(itemProgress.enrollmentId, enr.id));
          const byItem = new Map(progress.map((p) => [p.itemId, p.status]));

          const currentIndex = stages.findIndex((s) => s.id === enr.currentStageId);

          return (
            <section key={enr.id} aria-label={enr.pathName}>
              {enr.pathDeva ? (
                <p lang="sa" className="deva text-gold-500">{enr.pathDeva}</p>
              ) : null}
              <h2 className="mt-1 text-2xl">{enr.pathName}</h2>

              <ol className="mt-6 space-y-3">
                {await Promise.all(
                  stages.map(async (s, index) => {
                    const isCurrent = s.id === enr.currentStageId;
                    const isPast = currentIndex > -1 && index < currentIndex;
                    const items = isCurrent
                      ? await database
                          .select({ id: syllabusItem.id, latin: syllabusItem.titleLatin, deva: syllabusItem.titleDevanagari })
                          .from(syllabusItem)
                          .where(eq(syllabusItem.stageId, s.id))
                          .orderBy(asc(syllabusItem.sortOrder))
                      : [];

                    return (
                      <li
                        key={s.id}
                        className={`rounded-lg border p-5 ${
                          isCurrent
                            ? "border-gold-600 bg-ink-900"
                            : "border-ink-700 bg-ink-900/50"
                        }`}
                      >
                        <div className="flex items-baseline gap-4">
                          <span className="text-gold-600 text-xs tabular-nums">
                            {String(s.number).padStart(2, "0")}
                          </span>
                          <span lang="sa" className="deva text-lg">{s.deva}</span>
                          <span className="iast text-ink-muted">{s.latin}</span>
                          <span className="text-ink-muted ml-auto text-xs tracking-widest uppercase">
                            {isCurrent ? "you are here" : isPast ? "completed" : ""}
                          </span>
                        </div>

                        {isCurrent && items.length > 0 ? (
                          <ul className="mt-4 space-y-1.5">
                            {items.map((item) => (
                              <li key={item.id} className="flex items-baseline justify-between gap-4 text-sm">
                                <span>
                                  {item.deva ? (
                                    <span lang="sa" className="deva mr-2">{item.deva}</span>
                                  ) : null}
                                  <span className="iast text-ink-muted">{item.latin}</span>
                                </span>
                                <span className="text-ink-muted shrink-0 text-xs tracking-wide">
                                  {STATUS_LABEL[byItem.get(item.id) ?? "not_started"]}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    );
                  }),
                )}
              </ol>
            </section>
          );
        }),
      )}
    </div>
  );
}
