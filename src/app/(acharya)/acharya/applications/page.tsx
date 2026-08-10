import { asc, eq } from "drizzle-orm";

import { decideApplication } from "@/app/actions/teaching";
import { AdmitForm } from "@/components/acharya/admit-form";
import { db } from "@/db";
import { application, path } from "@/db/schema";
import { ACHARYA_TIMEZONE, formatInZone } from "@/lib/time";

export default async function ApplicationsPage() {
  const paths = await db()
    .select({ id: path.id, name: path.nameLatin })
    .from(path)
    .where(eq(path.isPublished, true))
    .orderBy(asc(path.sortOrder));

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

            <AdmitForm applicationId={a.id} paths={paths} />

            <form action={decideApplication} className="mt-3 flex gap-4">
              <input type="hidden" name="applicationId" value={a.id} />
              <button
                name="decision"
                value="waitlisted"
                className="text-muted hover:text-heading cursor-pointer text-sm underline underline-offset-4"
              >
                Waitlist
              </button>
              <button
                name="decision"
                value="declined"
                className="text-muted hover:text-heading cursor-pointer text-sm underline underline-offset-4"
              >
                Decline, with thanks
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
