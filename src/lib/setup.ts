import { timingSafeEqual } from "node:crypto";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { person } from "@/db/schema";
import { env } from "@/lib/env";

/** Constant-time comparison against SETUP_SECRET. */
export function secretMatches(supplied: string | undefined): boolean {
  const expected = env.SETUP_SECRET;
  if (!expected || !supplied) return false;
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Once true, the setup route closes permanently. */
export async function acharyaExists(): Promise<boolean> {
  const rows = await db()
    .select({ id: person.id })
    .from(person)
    .where(eq(person.role, "acharya"))
    .limit(1);
  return rows.length > 0;
}
