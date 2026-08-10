"use client";

import { useActionState, useState } from "react";

import { addStudent } from "@/app/actions/teaching";

const field =
  "border-border bg-background focus:border-primary mt-1.5 h-10 w-full rounded-md border px-3 text-sm outline-none";

export function AddStudentForm({ paths }: { paths: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(addStudent, { error: "" });

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="pressable border-border hover:border-primary rounded-md border px-4 py-2 text-sm transition-colors duration-150"
      >
        Add a student
      </button>
    );
  }

  return (
    <form action={action} className="border-border bg-surface rounded-lg border p-6">
      <h2 className="text-lg">Add a student</h2>
      <p className="text-muted mt-1 text-sm">
        For students you already teach. Give them a temporary password and tell
        them personally — they can change it once signed in.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-muted text-xs">Name</span>
          <input name="name" required className={field} />
        </label>
        <label className="block">
          <span className="text-muted text-xs">Name in Devanagari (optional)</span>
          <input name="nameDevanagari" lang="sa" className={`deva ${field}`} />
        </label>
        <label className="block">
          <span className="text-muted text-xs">Email — they sign in with this</span>
          <input name="email" type="email" required className={field} />
        </label>
        <label className="block">
          <span className="text-muted text-xs">Temporary password</span>
          <input name="password" required minLength={8} className={field} />
        </label>
        <label className="block">
          <span className="text-muted text-xs">Country (optional)</span>
          <input name="country" className={field} />
        </label>
        <label className="block">
          <span className="text-muted text-xs">Their timezone</span>
          <input name="timezone" defaultValue="Asia/Kolkata" className={field} />
          <span className="text-muted mt-1 block text-xs">
            e.g. Europe/Berlin, America/New_York, Australia/Sydney
          </span>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-muted text-xs">Enrol on</span>
          <select name="pathId" required defaultValue="" className={field}>
            <option value="" disabled>Choose a path…</option>
            {paths.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>
      </div>

      {state.error ? (
        <p role="alert" className="text-danger mt-4 text-sm">{state.error}</p>
      ) : null}

      <div className="mt-6 flex gap-3">
        <button
          disabled={pending}
          className="pressable bg-primary text-parchment-50 hover:bg-maroon-800 h-10 rounded-md px-6 text-sm transition-colors duration-200 disabled:opacity-60"
        >
          {pending ? "Adding…" : "Add and enrol"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-muted hover:text-heading h-10 px-2 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
