import type { Metadata } from "next";

import { env } from "@/lib/env";
import { acharyaExists } from "@/lib/setup";

import { SetupForm } from "./setup-form";

export const metadata: Metadata = {
  title: "Setup",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const configured = Boolean(env.SETUP_SECRET);
  const done = configured ? await acharyaExists() : false;

  return (
    <main className="ink flex min-h-dvh items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="text-gold-500 text-xs tracking-[0.32em] uppercase">
          Vishweshwara Sanskrit
        </p>
        <h1 className="mt-4 text-3xl">Create the Acharya&rsquo;s account</h1>

        {!configured ? (
          <p className="text-ink-muted mt-5 leading-relaxed">
            This page is not available. Set a <code>SETUP_SECRET</code>{" "}
            environment variable on the deployment first, then reload.
          </p>
        ) : done ? (
          <p className="text-ink-muted mt-5 leading-relaxed">
            The Acharya&rsquo;s account already exists, so this page is closed.
            Sign in at <a href="/login">/login</a>.
          </p>
        ) : (
          <>
            <p className="text-ink-muted mt-5 leading-relaxed">
              This runs once. Your password is never stored in the repository —
              it is set here and held only as a hash.
            </p>
            <SetupForm />
          </>
        )}
      </div>
    </main>
  );
}
