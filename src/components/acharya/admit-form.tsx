"use client";

import { useActionState } from "react";

import { admitApplicant } from "@/app/actions/teaching";

const field =
  "border-border bg-background focus:border-primary h-10 w-full rounded-md border px-3 text-sm outline-none";

export function AdmitForm({
  applicationId,
  paths,
}: {
  applicationId: string;
  paths: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(admitApplicant, { error: "" });

  return (
    <form action={action} className="border-border mt-5 grid gap-3 border-t pt-5 sm:grid-cols-[1.2fr_1fr_1fr_auto]">
      <input type="hidden" name="applicationId" value={applicationId} />

      <label className="block">
        <span className="text-muted text-xs">Enrol on</span>
        <select name="pathId" required className={field} defaultValue="">
          <option value="" disabled>Choose a path…</option>
          {paths.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-muted text-xs">Their timezone</span>
        <input name="timezone" defaultValue="Asia/Kolkata" className={field} />
      </label>

      <label className="block">
        <span className="text-muted text-xs">Temporary password</span>
        <input name="password" required minLength={8} className={field} placeholder="tell them personally" />
      </label>

      <button
        disabled={pending}
        className="pressable bg-primary text-parchment-50 hover:bg-maroon-800 h-10 self-end rounded-md px-5 text-sm transition-colors duration-200 disabled:opacity-60"
      >
        {pending ? "Admitting…" : "Admit"}
      </button>

      {state.error ? (
        <p role="alert" className="text-danger text-sm sm:col-span-4">{state.error}</p>
      ) : null}
    </form>
  );
}
