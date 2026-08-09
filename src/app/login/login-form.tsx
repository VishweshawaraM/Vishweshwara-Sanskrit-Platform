"use client";

import { useActionState } from "react";

import { login } from "@/app/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });

  return (
    <form action={action} className="mt-8 space-y-5">
      <label className="block">
        <span className="text-ink-fg text-sm">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="border-ink-700 bg-ink-900 text-ink-fg focus:border-gold-600 mt-2 h-11 w-full rounded-md border px-3.5 outline-none"
        />
      </label>
      <label className="block">
        <span className="text-ink-fg text-sm">Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="border-ink-700 bg-ink-900 text-ink-fg focus:border-gold-600 mt-2 h-11 w-full rounded-md border px-3.5 outline-none"
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
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
