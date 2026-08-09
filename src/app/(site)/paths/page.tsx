import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/site/page-header";
import { curriculum } from "@/db/seed/curriculum";

export const metadata: Metadata = {
  title: "Learning Paths",
  description:
    "Structured journeys through Sanskrit, Bhagavad Gītā and Krishna " +
    "Yajurveda — live instruction, staged progression, individual mastery.",
};

export default function PathsPage() {
  const published = curriculum.filter((path) => path.published);
  const forthcoming = curriculum.filter((path) => !path.published);

  return (
    <>
      <PageHeader
        eyebrow="Learning paths"
        title="Five subjects. One method."
        lede="Each path is a staged journey with a defined syllabus. Whatever the subject, the cycle is the same: live teaching, daily practice, correction, assessment, progression on mastery."
      />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {published.map((path, index) => (
            <Reveal key={path.slug} delay={index * 70}>
              <Link
                href={`/paths/${path.slug}`}
                className="group border-border bg-surface lift flex h-full flex-col rounded-lg border p-8 no-underline shadow-[var(--shadow-raised)]"
              >
                {path.devanagari ? (
                  <p lang="sa" className="deva text-primary text-lg">
                    {path.devanagari}
                  </p>
                ) : null}
                <h2 className="text-heading mt-2 text-xl">{path.latin}</h2>
                <p className="text-muted mt-4 flex-1 text-sm leading-relaxed">
                  {path.summary}
                </p>
                <p className="text-muted mt-7 flex items-baseline gap-3 text-xs tracking-widest uppercase">
                  <span>{path.stages.length} stages</span>
                  {path.minMonths ? (
                    <>
                      <span className="bg-parchment-400 h-px w-4" aria-hidden />
                      <span>{path.minMonths}–{path.maxMonths} months</span>
                    </>
                  ) : null}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        {forthcoming.length > 0 ? (
          <Reveal delay={120} className="mt-16">
            <h2 className="text-muted text-xs tracking-[0.28em] uppercase">
              Being prepared
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {forthcoming.map((path) => (
                <div
                  key={path.slug}
                  className="border-border rounded-lg border border-dashed p-8"
                >
                  {path.devanagari ? (
                    <p lang="sa" className="deva text-muted text-lg">
                      {path.devanagari}
                    </p>
                  ) : null}
                  <h3 className="text-muted mt-2 text-xl">{path.latin}</h3>
                  <p className="text-muted mt-3 text-sm leading-relaxed">
                    {path.summary} The curriculum is being prepared; ask about
                    it at orientation.
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        ) : null}
      </section>
    </>
  );
}
