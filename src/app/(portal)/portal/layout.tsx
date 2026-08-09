import Link from "next/link";
import { redirect } from "next/navigation";

import { logout } from "@/app/actions/auth";
import { Mark } from "@/components/brand/mark";
import { getViewer } from "@/lib/auth/session";

/**
 * Student portal shell. Ink ground: the portal is a place of focus, not
 * long-form reading (D-03 allows ink where reading authority is not the goal).
 */
export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.role === "acharya") redirect("/acharya");

  return (
    <div className="ink min-h-dvh">
      <header className="border-ink-700 border-b">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/portal" className="flex items-center gap-3 no-underline">
            <Mark className="text-gold-500 h-7 w-7" />
            <span className="text-ink-fg text-sm tracking-[0.18em] uppercase">
              Portal
            </span>
          </Link>
          <nav className="flex items-center gap-7 text-sm">
            <Link href="/portal" className="text-ink-muted hover:text-ink-fg no-underline">
              Today
            </Link>
            <Link href="/portal/abhyasa" className="text-ink-muted hover:text-ink-fg no-underline">
              Abhyāsa
            </Link>
            <Link href="/portal/progress" className="text-ink-muted hover:text-ink-fg no-underline">
              Progress
            </Link>
            <form action={logout}>
              <button className="text-ink-muted hover:text-ink-fg cursor-pointer text-sm">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>
    </div>
  );
}
