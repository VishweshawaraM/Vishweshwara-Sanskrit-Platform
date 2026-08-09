import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Request received",
  robots: { index: false },
};

export default function ThankYouPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admissions"
        title="Your request has been received"
        lede="The Acharya reads every request personally. You will hear back by email — usually within a few days."
      />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-muted max-w-(--spacing-measure) leading-relaxed">
          While you wait, the best preparation is to read{" "}
          <Link href="/gurukula">how learning works here</Link> — it will make
          the orientation conversation more useful for both of you.
        </p>
      </section>
    </>
  );
}
