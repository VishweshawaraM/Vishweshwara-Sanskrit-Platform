import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "About the Acharya",
  description:
    "Vishweshwara M — seven years of Gurukulavāsa at Veda Vijnana Gurukulam, " +
    "Bengaluru; Śāstrī in Sanskrit literature, Vyākaraṇa and Dharmaśāstra; " +
    "founder of Vishweshwara Sanskrit, a Digital Gurukula.",
};

/**
 * The About page is a lineage document, not a bio (D-05). It leads with
 * checkable facts — names, years, signatories — because paramparā and training
 * is the highest-weighted trust signal on the site (D-04), and the audiences
 * who most need it (parents, international students) are the ones who verify.
 *
 * Every word of the personal sections is the Acharya's own writing, verbatim
 * from docs/source/acharya-writing.md. Nothing is embellished.
 */

const QUALIFICATIONS = [
  {
    period: "2018–2025",
    title: "Gurukulavāsa — Veda Vijnana Gurukulam",
    detail:
      "Seven years of residential training in the Gurukula system at Janaseva Trust, Channenahalli, Bengaluru: Veda, Vedānta and Yoga, completed with dīkṣānta in April 2025. The āśaṁsanapatram is signed by Prof. Ramachandra G Bhat (President, VVSS), Dr. Mahabaleshwar S Bhat (Principal), and A. S. Nirmal Kumar (Secretary).",
  },
  {
    period: "2024",
    title: "Śāstrī (B.A.) — Veda Vignana Shodha Samsthana Samskrutha Mahapathashala",
    detail:
      "Sanskrit literature, Vyākaraṇa (grammar) and Dharmaśāstra.",
  },
  {
    period: "2022",
    title: "Sāhitya (PUC)",
    detail: "Classical Sanskrit literature and Vedic chanting.",
  },
  {
    period: "expected 2026",
    title: "Ācārya (M.A.) — in progress",
    detail: "Specialisation in Vedānta and Śāstra.",
  },
  {
    period: "2024–2025",
    title: "Teaching — Veda Vijnana Gurukulam",
    detail:
      "Taught Sanskrit, Yoga and Social Science to more than twenty students inside the Gurukula; served as Research & Editorial Assistant at the Veda Vignana Shodha Samsthanam.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Formed inside a Gurukula. Teaching in the tradition that shaped him."
        lede="Vishweshwara M is a Sanskrit and Vedic teacher from Bengaluru, and the founder of Vishweshwara Sanskrit."
      />

      {/* His own words — verbatim. */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <h2 className="text-2xl">Why I teach</h2>
            <div className="text-foreground mt-6 space-y-5 leading-relaxed">
              <p>
                I teach because I believe Sanskrit is not merely a language —
                it is the key to understanding India&rsquo;s timeless knowledge
                tradition. Through Sanskrit, students gain access to the Vedas,
                Upanishads, Bhagavad Gita, and the wisdom preserved by
                generations of Acharyas.
              </p>
              <p>
                My purpose is to make this knowledge accessible to sincere
                learners around the world while preserving its authenticity.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="text-2xl">The Guru–Shishya tradition</h2>
            <div className="text-foreground mt-6 space-y-5 leading-relaxed">
              <p>
                I believe that true learning happens through the Guru–Shishya
                Paramparā. Knowledge is not transferred through recorded videos
                alone. It grows through guidance, discipline, practice,
                correction, reflection, and continuous interaction between the
                teacher and the student.
              </p>
              <p>
                Technology should support this relationship, not replace it.
                That is why Vishweshwara Sanskrit is built as a Digital
                Gurukula rather than a conventional online learning platform.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The record — facts, dated, checkable. */}
      <section className="bg-raised border-border border-y">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <p className="text-muted text-xs tracking-[0.28em] uppercase">
              The record
            </p>
            <h2 className="mt-5 text-3xl">Training and qualifications</h2>
          </Reveal>

          <ol className="border-border mt-14 divide-y divide-(--color-border)">
            {QUALIFICATIONS.map((item, index) => (
              <Reveal
                as="li"
                key={item.title}
                delay={index * 50}
                className="grid gap-3 py-8 md:grid-cols-[10rem_1fr] md:gap-10"
              >
                <p className="text-gold-700 text-sm tracking-wide tabular-nums">
                  {item.period}
                </p>
                <div>
                  <h3 className="text-lg">{item.title}</h3>
                  <p className="text-muted mt-2 max-w-(--spacing-measure-wide) text-sm leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={100}>
            <p className="text-muted mt-10 max-w-(--spacing-measure) text-sm leading-relaxed">
              Languages: Sanskrit, Kannada and English; Hindi. Participant in
              the Rāṣṭrīya Gurukula Saṅgoṣṭhi and the All India Oriental
              Conference, Udupi.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The paramparā — his words, with the lineage section honestly pending. */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <h2 className="text-2xl">About the paramparā</h2>
            <div className="mt-6 space-y-5 leading-relaxed">
              <p>
                I have received my education through the traditional Gurukula
                system, where discipline, daily study, chanting, reflection,
                and guidance from Acharyas formed the foundation of learning.
              </p>
              <p>
                This platform carries forward those values in a modern digital
                environment.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="border-border bg-surface rounded-lg border p-8 shadow-[var(--shadow-raised)]">
              <h3 className="text-lg">Study with him</h3>
              <p className="text-muted mt-3 text-sm leading-relaxed">
                Admission begins with an orientation — a conversation, not a
                checkout. The Acharya listens to what you are seeking and
                recommends a path.
              </p>
              <Link
                href="/admissions"
                className="pressable bg-primary text-parchment-50 hover:bg-maroon-800 mt-6 inline-flex h-11 items-center rounded-md px-6 text-sm font-medium no-underline transition-colors duration-200"
              >
                Request an Orientation
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
