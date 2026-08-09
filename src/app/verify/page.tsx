import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify a certificate",
  description:
    "Confirm the authenticity of a certificate issued by Vishweshwara Sanskrit.",
};

/**
 * Deliberately plain and fast. No login, no tracking. A registrar with a
 * certificate ID in hand should be done in ten seconds.
 */
export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (id) redirect(`/verify/${encodeURIComponent(id.trim().toUpperCase())}`);

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6 py-20">
      <h1 className="text-3xl">Verify a certificate</h1>
      <p className="text-muted mt-4 leading-relaxed">
        Every certificate issued by Vishweshwara Sanskrit carries an ID of the
        form <code className="text-heading">VS-XXXX-XXXX-XXXX</code>. Enter it
        to confirm authenticity.
      </p>
      <form action="/verify" method="GET" className="mt-8 flex gap-3"
        // Progressive enhancement: plain GET works; the route handles ?id=.
      >
        <input
          name="id"
          required
          placeholder="VS-…"
          className="border-border bg-surface focus:border-primary h-12 flex-1 rounded-md border px-4 outline-none"
        />
        <button className="pressable bg-primary text-parchment-50 hover:bg-maroon-800 h-12 rounded-md px-6 text-sm font-medium transition-colors duration-200">
          Verify
        </button>
      </form>
    </main>
  );
}
