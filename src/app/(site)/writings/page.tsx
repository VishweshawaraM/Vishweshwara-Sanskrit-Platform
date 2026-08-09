import type { Metadata } from "next";

import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Writings",
  description:
    "Essays and notes on Sanskrit, Veda and Vedānta by Vishweshwara M.",
};

/**
 * The knowledge archive — a primary pillar of the site (D-01), organised by
 * text as it grows. It begins honestly: empty, with a promise, rather than
 * padded with filler content nobody wrote.
 */
export default function WritingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Writings"
        title="The archive begins here"
        lede="Essays and notes on Sanskrit, the Gītā, and the Vedic tradition — written by the Acharya, organised by text, kept at permanent addresses."
      />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-muted max-w-(--spacing-measure) leading-relaxed">
          The first writings are being prepared. What appears here will stay
          here — every piece keeps its address permanently, so it can be cited,
          shared and returned to for years.
        </p>
      </section>
    </>
  );
}
