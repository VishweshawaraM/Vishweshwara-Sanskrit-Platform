"use client";

import { useActionState } from "react";

import { createAcharya } from "@/app/actions/setup";

const field =
  "border-ink-700 bg-ink-900 text-ink-fg focus:border-gold-600 mt-2 h-11 w-full rounded-md border px-3.5 outline-none";

export function SetupForm() {
  const [state, action, pending] = useActionState(createAcharya, { error: "" });

  return (
    <form action={action} className="mt-8 space-y-5">
      <label className="block">
        <span className="text-sm">Setup key</span>
        <input name="token" type="password" required autoComplete="off" className={field} />
        <span className="text-ink-muted mt-1 block text-xs">
          The value you set as SETUP_SECRET.
        </span>
      </label>

      <label className="block">
        <span className="text-sm">Your name</span>
        <input name="name" required defaultValue="Vishweshwara M" className={field} />
      </label>

      <label className="block">
        <span className="text-sm">
          Your name in Devanagari <span className="text-ink-muted">(optional)</span>
        </span>
        <input name="nameDevanagari" lang="sa" className={`deva ${field}`} />
      </label>

      <label className="block">
        <span className="text-sm">Email — you will sign in with this</span>
        <input name="email" type="email" required autoComplete="username" className={field} />
      </label>

      <label className="block">
        <span className="text-sm">Password — at least 10 characters</span>
        <input
          name="password"
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          className={field}
        />
      </label>

      {state.error ? (
        <p role="alert" className="text-sm text-[#e08a80]">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="pressable bg-gold-500 text-ink-950 hover:bg-gold-200 h-11 w-full rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create my account"}
      </button>
    </form>
  );
}
