import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/site/page-header";
import { curriculum } from "@/db/seed/curriculum";

/**
 * One page per learning path, generated from the curriculum data. When the
 * Acharya publishes Advaita Vedānta, its page appears — no code change.
 *
 * The page is honest about difficulty on purpose: this site qualifies rather
 * than maximises (D-04). The syllabus is shown in full, stage by stage,
 * because the specificity of real text names — Śrī Rudram, Laghusiddhānta-
 * kaumudī — is itself the trust signal.
 */

export function generateStaticParams() {
  return curriculum
    .filter((path) => path.published)
    .map((path) => ({ slug: path.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = curriculum.find((p) => p.slug === slug && p.published);
  if (!path) return {};
  return {
    title: `${path.latin} — Learning Path`,
    description: path.summary,
  };
}

export default async function PathPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const path = curriculum.find((p) => p.slug === slug && p.published);
  if (!path) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Learning path"
        devanagari={path.devanagari}
        title={path.latin}
        lede={path.summary}
      />

      {/* The shape of the journey */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="flex flex-wrap gap-x-14 gap-y-6">
          <div>
            <p className="text-muted text-xs tracking-[0.24em] uppercase">Stages</p>
            <p className="mt-2 text-3xl tabular-nums">{path.stages.length}</p>
          </div>
          {path.minMonths ? (
            <div>
              <p className="text-muted text-xs tracking-[0.24em] uppercase">Duration</p>
              <p className="mt-2 text-3xl tabular-nums">
                {path.minMonths}–{path.maxMonths}
                <span className="text-muted ml-2 text-base">months</span>
              </p>
            </div>
          ) : (
            <div>
              <p className="text-muted text-xs tracking-[0.24em] uppercase">Duration</p>
              <p className="text-muted mt-2 max-w-56 text-sm leading-relaxed">
                Open-ended — progression follows mastery, not a calendar.
              </p>
            </div>
          )}
          <div>
            <p className="text-muted text-xs tracking-[0.24em] uppercase">Format</p>
            <p className="text-muted mt-2 max-w-64 text-sm leading-relaxed">
              Live instruction. Individual Abhyāsa, feedback and Avalokanam —
              regardless of class format.
            </p>
          </div>
        </Reveal>
      </section>

      {/* The stages, in full */}
      <section className="bg-raised border-border border-y">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <p className="text-muted text-xs tracking-[0.28em] uppercase">The journey</p>
            <h2 className="mt-5 text-3xl">Stage by stage</h2>
          </Reveal>

          <ol className="mt-14 space-y-5">
            {path.stages.map((stage, index) => (
              <Reveal
                as="li"
                key={stage.number}
                delay={Math.min(index * 50, 200)}
                className="border-border bg-surface rounded-lg border p-8 shadow-[var(--shadow-raised)]"
              >
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                  <span className="text-gold-600 text-sm tracking-[0.2em] tabular-nums">
                    {String(stage.number).padStart(2, "0")}
                  </span>
                  <h3 lang="sa" className="deva text-primary text-xl">
                    {stage.devanagari}
                  </h3>
                  <p className="iast text-heading text-lg">{stage.latin}</p>
                  {stage.minMonths ? (
                    <p className="text-muted ml-auto text-sm tabular-nums">
                      {stage.minMonths}–{stage.maxMonths} months
                    </p>
                  ) : null}
                </div>

                <p className="text-muted mt-4 max-w-(--spacing-measure-wide) leading-relaxed">
                  {stage.english}
                </p>

                {stage.items && stage.items.length > 0 ? (
                  <ul className="mt-6 flex flex-wrap gap-2.5">
                    {stage.items.map((item) => (
                      <li
                        key={item.latin}
                        className="border-border bg-background rounded-md border px-3.5 py-1.5 text-sm"
                      >
                        {item.devanagari ? (
                          <span lang="sa" className="deva mr-2">
                            {item.devanagari}
                          </span>
                        ) : null}
                        <span className="iast text-muted">{item.latin}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Who this is for — the honest filter */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-10 md:grid-cols-2">
          <Reveal className="border-border bg-surface rounded-lg border p-9">
            <h2 className="text-xl">This path asks of you</h2>
            <ul className="text-muted mt-5 space-y-3 text-sm leading-relaxed">
              <li>Attendance at live classes, at a fixed time each week</li>
              <li>Daily Abhyāsa between classes — practice is not optional</li>
              <li>Willingness to be corrected, repeatedly, on small things</li>
              <li>Patience: progression follows mastery, never the calendar</li>
            </ul>
          </Reveal>

          <Reveal delay={70} className="border-border bg-surface rounded-lg border p-9">
            <h2 className="text-xl">It is not suited to</h2>
            <ul className="text-muted mt-5 space-y-3 text-sm leading-relaxed">
              <li>Collecting a certificate quickly</li>
              <li>Self-paced browsing of recorded videos</li>
              <li>Study without regular practice</li>
            </ul>
            <p className="text-muted mt-5 text-sm leading-relaxed">
              That is not a judgment — it is a description of the method, so
              you can decide honestly whether it fits.
            </p>
          </Reveal>
        </div>

        <Reveal delay={100} className="mt-16 text-center">
          <Link
            href="/admissions"
            className="pressable bg-primary text-parchment-50 hover:bg-maroon-800 inline-flex h-12 items-center rounded-md px-8 text-sm font-medium no-underline transition-colors duration-200"
          >
            Request an Orientation
          </Link>
          <p className="text-muted mt-4 text-sm">
            The Acharya will recommend the right starting point — which may not
            be this path.
          </p>
        </Reveal>
      </section>
    </>
  );
}
