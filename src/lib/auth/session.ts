import { createHash, randomBytes } from "node:crypto";

import { and, eq, gt, isNull } from "drizzle-orm";
import { cookies } from "next/headers";

import { db } from "@/db";
import { person, sessionToken } from "@/db/schema";

/**
 * Cookie sessions backed by the session_token table.
 *
 * The cookie carries a random token; the database stores only its SHA-256,
 * so a leaked database dump cannot be replayed as a session. Sessions are
 * revocable server-side (docs/07 §1).
 */

const COOKIE = "vs_session";
const TTL_DAYS = 30;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(personId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000);

  await db().insert(sessionToken).values({
    personId,
    tokenHash: hashToken(token),
    expiresAt,
  });

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export type Viewer = {
  id: string;
  role: "acharya" | "student" | "parent" | "assistant";
  nameLatin: string;
  email: string;
  timezone: string;
};

export async function getViewer(): Promise<Viewer | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  const rows = await db()
    .select({
      id: person.id,
      role: person.role,
      nameLatin: person.nameLatin,
      email: person.email,
      timezone: person.timezone,
    })
    .from(sessionToken)
    .innerJoin(person, eq(sessionToken.personId, person.id))
    .where(
      and(
        eq(sessionToken.tokenHash, hashToken(token)),
        gt(sessionToken.expiresAt, new Date()),
        isNull(sessionToken.revokedAt),
        isNull(person.archivedAt),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    await db()
      .update(sessionToken)
      .set({ revokedAt: new Date() })
      .where(eq(sessionToken.tokenHash, hashToken(token)));
  }
  jar.delete(COOKIE);
}
