/**
 * Public site layout.
 *
 * Statically generated, readable without JavaScript (D-05). Navigation and
 * footer land in Phase 1 — docs/06-information-architecture.md §1.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="flex min-h-dvh flex-col">{children}</div>;
}
