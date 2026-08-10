"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { person } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { getViewer } from "@/lib/auth/session";

/** Change your own password. Available to every signed-in person. */
export async function changePassword(
  _prev: { error: string; done: boolean },
  formData: FormData,
): Promise<{ error: string; done: boolean }> {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 10) {
    return { error: "Choose a new password of at least 10 characters.", done: false };
  }
  if (next !== confirm) {
    return { error: "The two new passwords do not match.", done: false };
  }

  const [me] = await db().select().from(person).where(eq(person.id, viewer.id)).limit(1);
  if (!me?.passwordHash || !verifyPassword(current, me.passwordHash)) {
    return { error: "Your current password is not correct.", done: false };
  }

  await db()
    .update(person)
    .set({ passwordHash: hashPassword(next) })
    .where(eq(person.id, viewer.id));

  return { error: "", done: true };
}
