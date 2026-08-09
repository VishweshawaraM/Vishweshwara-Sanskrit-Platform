"use server";

import { eq, isNull, and } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { person } from "@/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";

export async function login(_prev: { error: string }, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Enter your email and password." };

  const rows = await db()
    .select()
    .from(person)
    .where(and(eq(person.email, email), isNull(person.archivedAt)))
    .limit(1);

  const found = rows[0];

  // Same error either way — do not reveal which emails exist.
  if (!found?.passwordHash || !verifyPassword(password, found.passwordHash)) {
    return { error: "That email and password do not match." };
  }
  if (found.status === "paused" || found.status === "declined") {
    return { error: "This account is not currently active. Please write to the Acharya." };
  }

  await createSession(found.id);
  redirect(found.role === "acharya" ? "/acharya" : "/portal");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
