import type { Metadata } from "next";
import Link from "next/link";

import { Seal } from "@/components/brand/seal";
import { Reveal } from "@/components/motion/reveal";
import { curriculum } from "@/db/seed/curriculum";

export const metadata: Metadata = {
  title: "Vishweshwara Sanskrit — A Digital Gurukula",
  description:
    "Sanskrit, Krishna Yajurveda, Bhagavad Gītā and Advaita Vedānta taught " +
    "directly by an Acharya through live personal instruction, in the " +
    "Guru–Śiṣya Paramparā.",
};

/**
 * Home.
 *
 * Structure follows the three jobs, in order (D-01): build trust, educate,
 * then — and only then — convert. Ink above, parchment below: the hero is a
 * threshold, the reading begins on paper.
 */

/** The cycle every path runs on. This is the method, not a feature list. */
const CYCLE = [
  { term: "Live class", gloss: "Direct instruction from the Acharya" },
  { term: "Abhyāsa", deva: "अभ्यासः", gloss: "Daily practice, recorded" },
  { term: "Correction", gloss: "Pronunciation, corrected by voice" },
  { term: "Avalokanam", deva: "अवलोकनम्", gloss: "Assessment, individually" },
  { term: "Progression", gloss: "Advanced only on mastery" },
];

export default function HomePage() {
  const paths = curriculum.filter((path) => path.published);

  return (
    <>
      {/* ================================================================
          Hero — ink. The threshold.
          ================================================================ */}
      <section className="ink relative overflow-hidden">
        <div className="mx-auto grid min-h-[92svh] max-w-6xl items-center gap-16 px-6 pt-32 pb-24 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Reveal as="p" delay={0} className="text-gold-500 text-xs tracking-[0.32em] uppercase">
              Est. in the Guru–Śiṣya Paramparā
            </Reveal>

            <Reveal as="h1" delay={60} className="mt-7 text-4xl leading-[1.06]">
              Knowledge is not
              <br />
              transmitted by video.
            </Reveal>

            <Reveal
              as="p"
              delay={120}
              className="text-ink-muted mt-7 max-w-(--spacing-measure) text-lg leading-relaxed"
            >
              It grows through guidance, discipline, practice, correction and
              reflection — between one teacher and one student. This is a
              Digital Gurukula: modern tools in service of an old relationship,
              never in place of it.
            </Reveal>

            <Reveal delay={180} className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/admissions"
                className="pressable bg-gold-500 text-ink-950 hover:bg-gold-200 inline-flex h-12 items-center rounded-md px-7 text-sm font-medium no-underline transition-colors duration-200"
              >
                Request an Orientation
              </Link>
              <Link
                href="/gurukula"
                className="text-ink-fg decoration-gold-600/50 hover:decoration-gold-500 inline-flex h-12 items-center px-1 text-sm underline underline-offset-8 transition-colors duration-200"
              >
                How learning actually works
              </Link>
            </Reveal>

            <Reveal delay={240} className="mt-14">
              <div className="rule-gold max-w-24" />
              <p lang="sa" className="deva deva-accented text-gold-500 mt-5 text-lg">
                संस्कृतव्याकरणं विना संस्कृतज्ञानं न सिध्यति।
              </p>
              <p className="text-ink-muted mt-1 text-sm">
                Without grammar, true knowledge of Sanskrit cannot arise.
              </p>
            </Reveal>
          </div>

          <Reveal variant="draw" delay={200} className="justify-self-center lg:justify-self-end">
            <Seal className="w-56 sm:w-72 lg:w-80" />
          </Reveal>
        </div>

        <div className="rule-gold" />
      </section>

      {/* ================================================================
          Parchment — the reading begins.
          ================================================================ */}

      {/* The Acharya. Highest-weighted trust signal on the site (D-04), so it
          comes first and leads with checkable facts, not adjectives. */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="text-muted text-xs tracking-[0.28em] uppercase">
              The Acharya
            </p>
            <h2 className="mt-6 text-3xl leading-tight">Vishweshwara M</h2>
            <p className="text-muted mt-4 leading-relaxed">
              Seven years of Gurukulavāsa at Veda Vijnana Gurukulam, Bengaluru —
              Veda, Vedānta and Yoga — completed with dīkṣānta in 2025. Śāstrī
              in Sanskrit literature, Vyākaraṇa and Dharmaśāstra; Ācārya in
              Vedānta in progress.
            </p>
            <Link
              href="/about"
              className="mt-7 inline-block text-sm underline underline-offset-8"
            >
              The lineage in full
            </Link>
          </Reveal>

          <Reveal delay={80}>
            <figure className="border-border bg-surface rounded-lg border p-9 shadow-[var(--shadow-raised)]">
              <blockquote className="text-lg leading-relaxed">
                “Knowledge is sacred. Students do not simply watch videos. They
                learn directly from an Acharya — through practice, pronunciation
                correction, assessment, and personal guidance. The focus is not
                on completing lessons quickly, but on developing understanding,
                confidence, and mastery.”
              </blockquote>
              <figcaption className="text-muted mt-6 text-sm">
                — from the Acharya’s teaching philosophy
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* The method. This page does the qualifying: a reader should finish it
          knowing the study is demanding. */}
      <section className="bg-raised border-border border-y">
        <div className="mx-auto max-w-6xl px-6 py-28">
          <Reveal>
            <p className="text-muted text-xs tracking-[0.28em] uppercase">
              The method
            </p>
            <h2 className="mt-6 max-w-(--spacing-measure) text-3xl leading-tight">
              Every student moves through the same cycle, at their own pace.
            </h2>
          </Reveal>

          <ol className="mt-16 grid gap-px md:grid-cols-5">
            {CYCLE.map((step, index) => (
              <Reveal
                as="li"
                key={step.term}
                delay={index * 60}
                className="bg-surface border-border lift relative border p-7"
              >
                <span className="text-gold-600 text-xs tracking-[0.2em] tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg">{step.term}</h3>
                {step.deva ? (
                  <p lang="sa" className="deva text-primary mt-1 text-base">
                    {step.deva}
                  </p>
                ) : null}
                <p className="text-muted mt-3 text-sm leading-relaxed">
                  {step.gloss}
                </p>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={120}>
            <p className="text-muted mt-12 max-w-(--spacing-measure) text-sm leading-relaxed">
              Attending classes does not advance a student. Progression depends
              on understanding, pronunciation, sustained practice, and the
              successful completion of Avalokanam — judged by the Acharya.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The paths, read from the curriculum data — not hand-written markup.
          When the Acharya adds Advaita Vedānta, it appears here. */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <Reveal>
          <p className="text-muted text-xs tracking-[0.28em] uppercase">
            Learning paths
          </p>
          <h2 className="mt-6 text-3xl leading-tight">What is studied here</h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {paths.map((path, index) => (
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
                <h3 className="text-heading mt-2 text-xl">{path.latin}</h3>
                <p className="text-muted mt-4 flex-1 text-sm leading-relaxed">
                  {path.summary}
                </p>
                <p className="text-muted mt-7 flex items-baseline gap-3 text-xs tracking-widest uppercase">
                  <span>{path.stages.length} stages</span>
                  {path.minMonths ? (
                    <>
                      <span className="bg-parchment-400 h-px w-4" aria-hidden />
                      <span>
                        {path.minMonths}–{path.maxMonths} months
                      </span>
                    </>
                  ) : null}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Convert — last, and quietly. */}
      <section className="mx-auto max-w-6xl px-6 pb-8">
        <Reveal className="border-border bg-surface rounded-lg border p-12 text-center shadow-[var(--shadow-lifted)]">
          <h2 className="text-2xl">Admission begins with a conversation</h2>
          <p className="text-muted mx-auto mt-4 max-w-(--spacing-measure) leading-relaxed">
            There is no enrolment button. You request an orientation; the Acharya
            listens, understands what you are seeking, and recommends a path —
            or tells you honestly that this is not the right place for you.
          </p>
          <Link
            href="/admissions"
            className="pressable bg-primary text-parchment-50 hover:bg-maroon-800 mt-9 inline-flex h-12 items-center rounded-md px-8 text-sm font-medium no-underline transition-colors duration-200"
          >
            Request an Orientation
          </Link>
        </Reveal>
      </section>
    </>
  );
}
