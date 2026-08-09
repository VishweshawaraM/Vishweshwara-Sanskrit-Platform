"use server";

import { redirect } from "next/navigation";

import { db } from "@/db";
import { auditLog, person } from "@/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { acharyaExists, secretMatches } from "@/lib/setup";

/**
 * One-time creation of the Acharya's account.
 *
 * The repository is public, so no password — not even a hash — may live in a
 * committed file. The account is instead created here, once, by whoever holds
 * SETUP_SECRET. The route refuses the moment an Acharya exists, so it cannot
 * be used twice or to add a second privileged account.
 */

export async function createAcharya(
  _prev: { error: string },
  formData: FormData,
): Promise<{ error: string }> {
  const token = String(formData.get("token") ?? "");
  if (!secretMatches(token)) return { error: "That setup key is not correct." };

  // Refuse if the Gurukula already has its Acharya.
  if (await acharyaExists()) {
    return { error: "An Acharya account already exists. This page is closed." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email) return { error: "Please give your name and email." };
  if (password.length < 10) {
    return { error: "Choose a password of at least 10 characters." };
  }

  const [created] = await db()
    .insert(person)
    .values({
      role: "acharya",
      email,
      nameLatin: name,
      nameDevanagari: String(formData.get("nameDevanagari") ?? "").trim() || null,
      timezone: "Asia/Kolkata",
      country: "India",
      passwordHash: hashPassword(password),
    })
    .returning();

  await db().insert(auditLog).values({
    actorPersonId: created?.id,
    action: "acharya.created",
    entityType: "person",
    entityId: created?.id,
    detail: { email },
  });

  redirect("/login");
}
