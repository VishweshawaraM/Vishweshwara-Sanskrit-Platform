import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "The Digital Gurukula",
  description:
    "How learning actually works here: live classes, Abhyāsa, pronunciation " +
    "correction, Avalokanam, and progression by the Acharya's judgment — " +
    "the Guru–Śiṣya Paramparā carried into a digital environment.",
};

/**
 * The method page. Its job is qualification: a reader should finish knowing
 * exactly what will be asked of them, and either want it or know it is not
 * for them. Both outcomes are successes (D-04).
 */

const WEEK = [
  {
    name: "The live class",
    body:
      "You meet the Acharya over Zoom — one-to-one or in a small group of three to eight, depending on the subject and your level. Yajurveda is taught mostly one-to-one, because recitation demands close attention. The class is work, not a lecture: you recite, you are corrected, you try again.",
  },
  {
    name: "Abhyāsa — daily practice",
    deva: "अभ्यासः",
    body:
      "Between classes you practise every day and log it in the portal — what you practised, for how long, with a recording when the work is recitation. The Acharya sees the pattern. Consistency matters more than duration.",
  },
  {
    name: "Assigned work and correction",
    body:
      "The Acharya sets work with a due date: recitation to record, Devanagari to write by hand and photograph, exercises to answer. Feedback comes back personally — in writing, and in the Acharya's own voice when pronunciation needs correcting. Where the work is not yet right, you revise and resubmit.",
  },
  {
    name: "Avalokanam — assessment",
    deva: "अवलोकनम्",
    body:
      "Assessment is continuous, and formal at the end of each stage: recitation, oral examination live with the Acharya, written work. It is always individual, even if you learn in a group. The result is declared by the Acharya — never computed by software.",
  },
  {
    name: "Progression",
    body:
      "You move to the next stage when the Acharya judges you have mastered this one. Attending every class does not advance you. Completing exercises does not advance you. Understanding, pronunciation and practice do. A certificate — an āśaṁsanapatram, dated in both the Gregorian and traditional calendars — marks each completed stage, and can be verified publicly by anyone you show it to.",
  },
];

export default function GurukulaPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Digital Gurukula"
        devanagari="गुरुशिष्यपरम्परा"
        title="How learning actually works here"
        lede="Not a video library. Not a course you click through. A weekly rhythm of teaching, practice, correction and assessment — between you and an Acharya."
      />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <ol className="relative space-y-14 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-(--color-border) md:before:left-[9px]">
          {WEEK.map((step, index) => (
            <Reveal
              as="li"
              key={step.name}
              delay={Math.min(index * 60, 240)}
              className="relative pl-12 md:pl-16"
            >
              <span
                aria-hidden
                className="border-gold-600 bg-background absolute top-1.5 left-0 h-4 w-4 rounded-full border-2 md:h-5 md:w-5"
              />
              <h2 className="flex flex-wrap items-baseline gap-x-4 text-2xl">
                {step.name}
                {step.deva ? (
                  <span lang="sa" className="deva text-primary text-xl">
                    {step.deva}
                  </span>
                ) : null}
              </h2>
              <p className="text-muted mt-4 max-w-(--spacing-measure-wide) leading-relaxed">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="bg-raised border-border border-y">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-14 lg:grid-cols-2">
            <Reveal>
              <h2 className="text-2xl">What the software does</h2>
              <p className="text-muted mt-5 max-w-(--spacing-measure) leading-relaxed">
                The portal keeps the rhythm: your next class in your own
                timezone, the work you owe, your practice log, your position in
                the path, the Acharya&rsquo;s feedback in one place. It
                reminds, records and organises.
              </p>
            </Reveal>
            <Reveal delay={70}>
              <h2 className="text-2xl">What it never does</h2>
              <p className="text-muted mt-5 max-w-(--spacing-measure) leading-relaxed">
                It never grades you, never advances you, never awards anything.
                There are no streaks, badges or leaderboards here, and there
                never will be. Every judgment that matters is made by the
                Acharya. Technology supports the relationship; it does not
                replace it.
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
          </Reveal>
        </div>
      </section>
    </>
  );
}
