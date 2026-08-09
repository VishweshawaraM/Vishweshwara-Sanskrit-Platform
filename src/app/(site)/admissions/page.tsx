import type { Metadata } from "next";

import { submitApplication } from "@/app/actions/admissions";
import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/site/page-header";
import { curriculum } from "@/db/seed/curriculum";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Admission to Vishweshwara Sanskrit begins with an orientation — a " +
    "conversation with the Acharya, not a checkout. Request one here.",
};

/**
 * The admission form is a filter, not a lead capture (D-04). Its questions
 * are answerable only by someone serious: motivation, prior study, weekly
 * hours, ability to attend live. No fee appears anywhere — Guru Dakṣiṇā is a
 * personal conversation held entirely outside the platform (V7).
 *
 * Sprint scope: the form posts to a server action stub that will store to the
 * `application` table (docs/07 §8) once the database is provisioned. The
 * markup is a plain form — it works without JavaScript.
 */

const PROCESS = [
  {
    name: "You request an orientation",
    body: "The form below. It asks you to say a little about yourself — that is deliberate.",
  },
  {
    name: "The Acharya reads it",
    body: "Every request personally. Some are invited to orientation; some are told honestly that this is not the right place.",
  },
  {
    name: "Orientation",
    body: "A conversation over Zoom. What you are seeking, what you have studied, what your days allow. You will also see how a class actually works.",
  },
  {
    name: "A recommendation",
    body: "The Acharya recommends a path and a starting stage — sometimes a different one than you asked for. Guru Dakṣiṇā is discussed personally at this point, never before, and never on this website.",
  },
  {
    name: "You begin",
    body: "A fixed weekly class time, your portal account, and your first Abhyāsa.",
  },
];

export default function AdmissionsPage() {
  const paths = curriculum.filter((p) => p.published);

  return (
    <>
      <PageHeader
        eyebrow="Admissions · Praveśa"
        devanagari="प्रवेशः"
        title="Admission begins with a conversation"
        lede="There is no enrolment button and no price list. You request an orientation; the Acharya decides, with you, whether this is the right place."
      />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <p className="text-muted text-xs tracking-[0.28em] uppercase">The process</p>
          <h2 className="mt-5 text-3xl">Five steps, no shortcuts</h2>
        </Reveal>

        <ol className="mt-14 grid gap-px md:grid-cols-5">
          {PROCESS.map((step, index) => (
            <Reveal
              as="li"
              key={step.name}
              delay={index * 60}
              className="border-border bg-surface border p-7"
            >
              <span className="text-gold-600 text-xs tracking-[0.2em] tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-base leading-snug">{step.name}</h3>
              <p className="text-muted mt-3 text-sm leading-relaxed">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* The request form — the filter */}
      <section className="bg-raised border-border border-y">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <Reveal>
            <h2 className="text-3xl">Request an orientation</h2>
            <p className="text-muted mt-4 leading-relaxed">
              Answer in your own words — a few honest sentences are worth more
              than polish. The Acharya reads every request himself.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <form
              className="border-border bg-surface mt-12 space-y-8 rounded-lg border p-9 shadow-[var(--shadow-raised)]"
              action={submitApplication}
            >
              <div className="grid gap-8 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium">Your name</span>
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    className="border-border bg-background focus:border-primary mt-2 h-11 w-full rounded-md border px-3.5 outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Email</span>
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    className="border-border bg-background focus:border-primary mt-2 h-11 w-full rounded-md border px-3.5 outline-none"
                  />
                </label>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium">Country &amp; timezone</span>
                  <input
                    required
                    name="location"
                    placeholder="e.g. Germany, CET"
                    className="border-border bg-background focus:border-primary mt-2 h-11 w-full rounded-md border px-3.5 outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Path you are drawn to</span>
                  <select
                    name="path"
                    className="border-border bg-background focus:border-primary mt-2 h-11 w-full rounded-md border px-3 outline-none"
                  >
                    {paths.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.latin}
                      </option>
                    ))}
                    <option value="unsure">I am not sure — advise me</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium">
                  Why do you want to study this?
                </span>
                <textarea
                  required
                  name="motivation"
                  rows={4}
                  className="border-border bg-background focus:border-primary mt-2 w-full rounded-md border px-3.5 py-2.5 outline-none"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">
                  What have you studied before, if anything?
                </span>
                <textarea
                  name="prior"
                  rows={3}
                  placeholder="None is a perfectly good answer."
                  className="border-border bg-background focus:border-primary mt-2 w-full rounded-md border px-3.5 py-2.5 outline-none"
                />
              </label>

              <div className="grid gap-8 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium">
                    Hours you can give each week
                  </span>
                  <input
                    required
                    name="hours"
                    inputMode="numeric"
                    placeholder="Including daily practice"
                    className="border-border bg-background focus:border-primary mt-2 h-11 w-full rounded-md border px-3.5 outline-none"
                  />
                </label>
                <fieldset>
                  <legend className="text-sm font-medium">
                    Can you attend live, at a fixed weekly time?
                  </legend>
                  <div className="mt-3 flex gap-6">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="live" value="yes" required /> Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="live" value="no" /> No
                    </label>
                  </div>
                </fieldset>
              </div>

              <button
                type="submit"
                className="pressable bg-primary text-parchment-50 hover:bg-maroon-800 h-12 w-full rounded-md text-sm font-medium transition-colors duration-200"
              >
                Send the request
              </button>

              <p className="text-muted text-center text-xs leading-relaxed">
                No payment is requested at any point on this website.
                Guru Dakṣiṇā is discussed personally, after orientation.
              </p>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
