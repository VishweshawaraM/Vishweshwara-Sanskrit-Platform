import Link from "next/link";
import { redirect } from "next/navigation";

import { logout } from "@/app/actions/auth";
import { Mark } from "@/components/brand/mark";
import { getViewer } from "@/lib/auth/session";

export default async function AcharyaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  if (viewer.role !== "acharya") redirect("/portal");

  return (
    <div className="min-h-dvh">
      <header className="border-border bg-surface border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/acharya" className="flex items-center gap-3 no-underline">
            <Mark className="text-primary h-7 w-7" />
            <span className="text-heading text-sm tracking-[0.18em] uppercase">
              Acharya
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/acharya" className="text-muted hover:text-heading no-underline">Today</Link>
            <Link href="/acharya/review" className="text-muted hover:text-heading no-underline">Review</Link>
            <Link href="/acharya/students" className="text-muted hover:text-heading no-underline">Students</Link>
            <Link href="/acharya/applications" className="text-muted hover:text-heading no-underline">Applications</Link>
            <form action={logout}>
              <button className="text-muted hover:text-heading cursor-pointer text-sm">Sign out</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12">{children}</main>
    </div>
  );
}
