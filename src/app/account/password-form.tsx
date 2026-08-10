"use client";

import { useActionState } from "react";

import { changePassword } from "@/app/actions/account";

const field =
  "border-ink-700 bg-ink-900 text-ink-fg focus:border-gold-600 mt-2 h-11 w-full rounded-md border px-3.5 outline-none";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, {
    error: "",
    done: false,
  });

  return (
    <form action={action} className="mt-10 space-y-5">
      <h2 className="text-lg">Change your password</h2>

      <label className="block">
        <span className="text-sm">Current password</span>
        <input name="current" type="password" required autoComplete="current-password" className={field} />
      </label>
      <label className="block">
        <span className="text-sm">New password — at least 10 characters</span>
        <input name="next" type="password" required minLength={10} autoComplete="new-password" className={field} />
      </label>
      <label className="block">
        <span className="text-sm">New password again</span>
        <input name="confirm" type="password" required minLength={10} autoComplete="new-password" className={field} />
      </label>

      {state.error ? (
        <p role="alert" className="text-sm text-[#e08a80]">{state.error}</p>
      ) : null}
      {state.done ? (
        <p role="status" className="text-gold-500 text-sm">Your password has been changed.</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="pressable bg-gold-500 text-ink-950 hover:bg-gold-200 h-11 w-full rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-60"
      >
        {pending ? "Changing…" : "Change password"}
      </button>
    </form>
  );
}
