import { eq } from "drizzle-orm";
import type { Metadata } from "next";

import { db } from "@/db";
import { certificate } from "@/db/schema";
import { Mark } from "@/components/brand/mark";

export const metadata: Metadata = {
  title: "Certificate verification",
  robots: { index: false },
};

/**
 * PERMANENT URL. This route must survive every redesign and migration —
 * a registrar may check a 2026 certificate in 2045 (docs/06 §3).
 * Reads only the certificate table's snapshotted values.
 */
export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = await params;

  const rows = await db()
    .select()
    .from(certificate)
    .where(eq(certificate.publicId, publicId.toUpperCase()))
    .limit(1);
  const cert = rows[0];

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6 py-20">
      {!cert ? (
        <>
          <h1 className="text-3xl">Not found</h1>
          <p className="text-muted mt-4 leading-relaxed">
            No certificate with the ID{" "}
            <code className="text-heading">{publicId}</code> has been issued by
            Vishweshwara Sanskrit. Check the ID for mistyped characters — or
            treat the document with suspicion.
          </p>
        </>
      ) : cert.revokedAt ? (
        <>
          <h1 className="text-danger text-3xl">Revoked</h1>
          <p className="text-muted mt-4 leading-relaxed">
            Certificate <code>{cert.publicId}</code> was issued to{" "}
            {cert.holderNameLatin} but has since been revoked
            {cert.revokedReason ? ` (${cert.revokedReason})` : ""}. It should
            not be relied upon.
          </p>
        </>
      ) : (
        <div className="border-gold-600 bg-surface rounded-lg border p-10 shadow-[var(--shadow-lifted)]">
          <div className="flex items-start justify-between gap-6">
            <Mark className="text-gold-600 h-14 w-14" />
            <p className="text-success text-sm font-medium tracking-wide uppercase">
              ✓ Authentic
            </p>
          </div>

          <h1 className="mt-8 text-2xl leading-snug">
            {cert.holderNameLatin}
            {cert.holderNameDevanagari ? (
              <span lang="sa" className="deva text-primary mt-1 block text-xl">
                {cert.holderNameDevanagari}
              </span>
            ) : null}
          </h1>

          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="text-muted text-xs tracking-[0.2em] uppercase">Completed</dt>
              <dd className="mt-1">
                {cert.stageNameLatin ? `${cert.stageNameLatin} — ` : ""}
                {cert.pathNameLatin}
                {cert.pathNameDevanagari ? (
                  <span lang="sa" className="deva text-muted ml-2">
                    {cert.pathNameDevanagari}
                  </span>
                ) : null}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs tracking-[0.2em] uppercase">Issued</dt>
              <dd className="mt-1">
                {cert.issuedOnGregorian}
                {cert.issuedPanchanga ? ` · ${cert.issuedPanchanga}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs tracking-[0.2em] uppercase">By</dt>
              <dd className="mt-1">
                {cert.acharyaName}, {cert.institutionName}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs tracking-[0.2em] uppercase">Certificate ID</dt>
              <dd className="mt-1 font-mono text-xs">{cert.publicId}</dd>
            </div>
          </dl>
        </div>
      )}
    </main>
  );
}
