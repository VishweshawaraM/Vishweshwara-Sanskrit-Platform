import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { application } from "@/db/schema";
import { ACHARYA_TIMEZONE, formatInZone } from "@/lib/time";

export default async function ApplicationsPage() {
  const rows = await db()
    .select()
    .from(application)
    .where(eq(application.status, "new"))
    .orderBy(asc(application.submittedAt));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl">Orientation requests</h1>
        <p className="text-muted mt-2">
          {rows.length === 0 ? "None waiting." : `${rows.length} awaiting your reading.`}
        </p>
      </header>

      <ul className="space-y-4">
        {rows.map((a) => (
          <li key={a.id} className="border-border bg-surface rounded-lg border p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-lg">{a.name}</h2>
              <p className="text-muted text-sm">
                {formatInZone(a.submittedAt, ACHARYA_TIMEZONE, { dateStyle: "medium", timeStyle: "short" })}
              </p>
            </div>
            <p className="text-muted mt-1 text-sm">
              {a.email} · {a.location ?? "location not given"} · drawn to{" "}
              {a.interestedPath ?? "unsure"} · {a.weeklyHours ?? "?"} hrs/week ·{" "}
              {a.canAttendLive ? "can attend live" : "cannot attend live"}
            </p>
            <p className="mt-4 leading-relaxed">{a.motivation}</p>
            {a.priorStudy ? (
              <p className="text-muted mt-3 text-sm leading-relaxed">
                Prior study: {a.priorStudy}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
