import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getViewer } from "@/lib/auth/session";

import { PasswordForm } from "./password-form";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };

export default async function AccountPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");

  const home = viewer.role === "acharya" ? "/acharya" : "/portal";

  return (
    <main className="ink min-h-dvh px-6 py-16">
      <div className="mx-auto max-w-md">
        <Link href={home} className="text-ink-muted text-sm no-underline hover:text-ink-fg">
          ← Back
        </Link>
        <h1 className="mt-6 text-3xl">Your account</h1>
        <p className="text-ink-muted mt-2 text-sm">
          {viewer.nameLatin} · {viewer.email}
        </p>
        <PasswordForm />
      </div>
    </main>
  );
}
