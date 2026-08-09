import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach Vishweshwara Sanskrit, Bengaluru.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Write, and you will receive a reply"
        lede="For questions about study, the right door is an orientation request — it reaches the Acharya directly. For everything else:"
      />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          <Reveal className="border-border bg-surface rounded-lg border p-8">
            <h2 className="text-muted text-xs tracking-[0.24em] uppercase">Email</h2>
            <p className="mt-3">
              <a href="mailto:vishweshwaram12@gmail.com">
                vishweshwaram12@gmail.com
              </a>
            </p>
          </Reveal>
          <Reveal delay={60} className="border-border bg-surface rounded-lg border p-8">
            <h2 className="text-muted text-xs tracking-[0.24em] uppercase">Place</h2>
            <p className="text-muted mt-3">Bengaluru, Karnataka, India</p>
            <p className="text-muted mt-1 text-sm">Classes worldwide, over Zoom</p>
          </Reveal>
          <Reveal delay={120} className="border-border bg-surface rounded-lg border p-8">
            <h2 className="text-muted text-xs tracking-[0.24em] uppercase">To study</h2>
            <p className="mt-3">
              <Link href="/admissions">Request an orientation</Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
