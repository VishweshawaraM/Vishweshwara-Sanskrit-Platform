import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getViewer } from "@/lib/auth/session";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

export default async function LoginPage() {
  const viewer = await getViewer();
  if (viewer) redirect(viewer.role === "acharya" ? "/acharya" : "/portal");

  return (
    <main className="ink flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-gold-500 text-xs tracking-[0.32em] uppercase">
          Vishweshwara Sanskrit
        </p>
        <h1 className="mt-4 text-3xl">Sign in</h1>
        <p className="text-ink-muted mt-3 text-sm leading-relaxed">
          Accounts are created at enrolment. If you are not yet a student,
          begin with an orientation request.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
