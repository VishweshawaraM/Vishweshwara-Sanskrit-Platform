import Link from "next/link";

import { Mark } from "@/components/brand/mark";

const COLUMNS = [
  {
    heading: "Study",
    links: [
      { href: "/paths/sanskrit", label: "Sanskrit" },
      { href: "/paths/bhagavad-gita", label: "Bhagavad Gītā" },
      { href: "/paths/krishna-yajurveda", label: "Krishna Yajurveda" },
      { href: "/paths", label: "All paths" },
    ],
  },
  {
    heading: "The Gurukula",
    links: [
      { href: "/about", label: "The Acharya" },
      { href: "/gurukula", label: "How learning works" },
      { href: "/writings", label: "Writings" },
    ],
  },
  {
    heading: "Practical",
    links: [
      { href: "/admissions", label: "Admissions" },
      { href: "/verify", label: "Verify a certificate" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="ink mt-32">
      <div className="rule-gold" />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Mark className="text-gold-500 h-12 w-12" />
            <p className="text-ink-muted mt-5 max-w-xs text-sm leading-relaxed">
              A Digital Gurukula. Sanskrit, Veda and Vedānta taught directly by
              an Acharya, in the Guru–Śiṣya Paramparā.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <h2 className="text-gold-500 text-xs tracking-[0.2em] uppercase">
                {column.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-ink-muted hover:text-ink-fg text-sm no-underline transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-ink-700 text-ink-muted mt-14 flex flex-col gap-3 border-t pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Vishweshwara Sanskrit. Bengaluru.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-ink-muted no-underline hover:text-ink-fg">
              Terms
            </Link>
            <Link href="/privacy" className="text-ink-muted no-underline hover:text-ink-fg">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
