import { desc, eq } from "drizzle-orm";

import { logAbhyasa } from "@/app/actions/work";
import { db } from "@/db";
import { abhyasaLog, enrollment, path } from "@/db/schema";
import { getViewer } from "@/lib/auth/session";

/**
 * The Abhyāsa log. Self-reported daily practice. The Acharya sees the
 * pattern; nothing here is graded — consistency is the point.
 */
export default async function AbhyasaPage() {
  const viewer = (await getViewer())!;
  const database = db();

  const enrollments = await database
    .select({ id: enrollment.id, pathName: path.nameLatin })
    .from(enrollment)
    .innerJoin(path, eq(enrollment.pathId, path.id))
    .where(eq(enrollment.studentId, viewer.id));

  const entries = await database
    .select({
      id: abhyasaLog.id,
      practisedOn: abhyasaLog.practisedOn,
      minutes: abhyasaLog.minutes,
      what: abhyasaLog.what,
    })
    .from(abhyasaLog)
    .where(eq(abhyasaLog.studentId, viewer.id))
    .orderBy(desc(abhyasaLog.practisedOn))
    .limit(30);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="max-w-2xl space-y-10">
      <header>
        <p lang="sa" className="deva text-gold-500 text-lg">अभ्यासः</p>
        <h1 className="mt-1 text-3xl">Daily practice</h1>
        <p className="text-ink-muted mt-3 leading-relaxed">
          Record what you practised today. Minutes matter less than the
          unbroken habit.
        </p>
      </header>

      {enrollments[0] ? (
        <form action={logAbhyasa} className="border-ink-700 bg-ink-900 space-y-5 rounded-lg border p-6">
          <input type="hidden" name="enrollmentId" value={enrollments[0].id} />
          <input type="hidden" name="practisedOn" value={today} />
          <label className="block">
            <span className="text-sm">What did you practise?</span>
            <input
              name="what"
              required
              placeholder="e.g. Śrī Sūktam, first three ṛks"
              className="border-ink-700 bg-ink-950 text-ink-fg focus:border-gold-600 mt-2 h-11 w-full rounded-md border px-3.5 outline-none"
            />
          </label>
          <label className="block max-w-40">
            <span className="text-sm">Minutes</span>
            <input
              name="minutes"
              type="number"
              min="1"
              max="600"
              required
              className="border-ink-700 bg-ink-950 text-ink-fg focus:border-gold-600 mt-2 h-11 w-full rounded-md border px-3.5 outline-none"
            />
          </label>
          <button className="pressable bg-gold-500 text-ink-950 hover:bg-gold-200 h-11 rounded-md px-7 text-sm font-medium transition-colors duration-200">
            Record today&rsquo;s Abhyāsa
          </button>
        </form>
      ) : (
        <p className="text-ink-muted">You are not enrolled on a path yet.</p>
      )}

      <section>
        <h2 className="text-ink-muted text-xs tracking-[0.24em] uppercase">Last 30 days</h2>
        {entries.length === 0 ? (
          <p className="text-ink-muted mt-4">No entries yet. Today is a good day to begin.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {entries.map((e) => (
              <li
                key={e.id}
                className="border-ink-700 bg-ink-900 flex items-baseline justify-between gap-6 rounded-md border px-4 py-3"
              >
                <span className="text-ink-fg text-sm">{e.what}</span>
                <span className="text-ink-muted shrink-0 text-sm tabular-nums">
                  {e.practisedOn} · {e.minutes} min
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
