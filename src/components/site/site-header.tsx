import Link from "next/link";

import { Mark } from "@/components/brand/mark";

/**
 * Navigation. English labels, per the Acharya's ruling (D-02) — Sanskrit is
 * taught inside the pages, not used as a gate at the door.
 *
 * Deliberately boring: persistent, predictable, no scroll-hiding, no mega-menu.
 * Only sites that doubt themselves need clever navigation.
 *
 * It sits over the ink hero, so it carries a light backdrop blur — the one
 * translucency in the design. This is not a glass panel; it is a scrim that
 * keeps the wordmark legible over a dark ground.
 */

const NAV = [
  { href: "/about", label: "About" },
  { href: "/paths", label: "Learning Paths" },
  { href: "/gurukula", label: "Digital Gurukula" },
  { href: "/writings", label: "Writings" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 text-ink-fg no-underline"
        >
          <Mark className="h-9 w-9 text-gold-500" />
          <span className="flex flex-col leading-none">
            <span className="text-sm tracking-[0.22em] uppercase">
              Vishweshwara
            </span>
            <span className="text-gold-500 text-[0.68rem] tracking-[0.34em] uppercase">
              Sanskrit
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-ink-muted hover:text-ink-fg text-sm no-underline transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* The single sitewide call to action. "Request" signals selectivity —
            which is accurate. Admission is by the Acharya's decision (D-04). */}
        <Link
          href="/admissions"
          className="pressable border-gold-600/60 text-gold-500 hover:border-gold-500 hover:bg-gold-500/10 rounded-md border px-4 py-2 text-sm no-underline transition-colors duration-200"
        >
          Request an Orientation
        </Link>
      </div>
    </header>
  );
}
