import type { Metadata } from "next";

import { Button } from "@/components/ui/button";

/**
 * Foundation verification page.
 *
 * NOT the home page. This exists to satisfy the Phase 0 exit criterion
 * (docs/09-roadmap.md): the design tokens resolve, the type scale renders, and
 * accented Devanagari displays correctly on a real device. It is replaced
 * wholesale in Phase 1.
 */

export const metadata: Metadata = {
  title: "Foundation",
  robots: { index: false, follow: false },
};

export default function FoundationPage() {
  return (
    <main className="mx-auto w-full max-w-(--spacing-measure-wide) px-6 py-20">
      <header className="border-b border-border pb-10">
        <p className="text-sm tracking-widest text-muted uppercase">
          Sprint 1 · Foundation
        </p>
        <h1 className="mt-4 text-4xl">Vishweshwara Sanskrit</h1>
        <p className="mt-4 max-w-(--spacing-measure) text-lg text-muted">
          A Digital Gurukula. This page verifies the design system only — no
          feature of the platform is implemented yet.
        </p>
      </header>

      <section className="mt-14" aria-labelledby="script">
        <h2 id="script" className="text-2xl">
          Script rendering
        </h2>
        <p className="mt-2 max-w-(--spacing-measure) text-muted">
          Devanagari carries marks above and below the glyph, so it is set with
          greater line height than the surrounding Latin text.
        </p>

        <dl className="mt-8 space-y-6">
          <div>
            <dt className="text-sm text-muted">Path name</dt>
            <dd lang="sa" className="deva mt-1 text-2xl">
              संस्कृताध्ययनपरम्परा
            </dd>
            <dd className="iast text-muted">Saṁskṛtādhyayanaparamparā</dd>
          </div>

          <div>
            <dt className="text-sm text-muted">
              Stage II — confirmed by the Acharya
            </dt>
            <dd lang="sa" className="deva mt-1 text-2xl">
              वाक्यनिर्माणम्
            </dd>
            <dd className="iast text-muted">Vākyanirmāṇam</dd>
          </div>

          <div>
            <dt className="text-sm text-muted">
              Vedic accents — udātta and anudātta must remain distinct
            </dt>
            <dd lang="sa" className="deva deva-accented mt-1 text-2xl">
              अ॒ग्निमी॑ळे पु॒रोहि॑तं य॒ज्ञस्य॑ दे॒वमृत्विजम्
            </dd>
          </div>

          <div>
            <dt className="text-sm text-muted">Governing maxim</dt>
            <dd lang="sa" className="deva mt-1 text-lg">
              संस्कृतव्याकरणं विना संस्कृतज्ञानं न सिध्यति।
            </dd>
            <dd className="text-muted">
              Without Sanskrit grammar, true Sanskrit knowledge cannot arise.
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-14" aria-labelledby="palette">
        <h2 id="palette" className="text-2xl">
          Palette
        </h2>
        <p className="mt-2 max-w-(--spacing-measure) text-muted">
          Parchment ground, charcoal text, maroon institutional, gold as accent
          only.
        </p>

        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { name: "Parchment", className: "bg-parchment-200" },
            { name: "Charcoal", className: "bg-charcoal-800" },
            { name: "Maroon", className: "bg-maroon-700" },
            { name: "Gold", className: "bg-gold-500" },
          ].map((swatch) => (
            <li key={swatch.name}>
              <div
                className={`h-20 rounded-md border border-border ${swatch.className}`}
              />
              <p className="mt-2 text-sm text-muted">{swatch.name}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="controls">
        <h2 id="controls" className="text-2xl">
          Controls
        </h2>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button>Request an Orientation</Button>
          <Button variant="outline">Secondary</Button>
          <Button variant="ghost">Tertiary</Button>
          <Button variant="link">A link</Button>
        </div>
        <p className="mt-4 text-sm text-muted">
          There is no gold button variant. Gold is reserved for rules, seals,
          and certificates.
        </p>
      </section>

      <footer className="mt-20 border-t border-border pt-8 text-sm text-muted">
        <p>
          Design decisions are recorded in{" "}
          <code className="text-charcoal-800">docs/02-website-decisions.md</code>
          . Colour is defined only in{" "}
          <code className="text-charcoal-800">src/app/globals.css</code>.
        </p>
      </footer>
    </main>
  );
}
