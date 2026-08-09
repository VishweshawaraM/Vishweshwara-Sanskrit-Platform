"use server";

import { redirect } from "next/navigation";

import { db } from "@/db";
import { application } from "@/db/schema";

/** Public: store an orientation request. No auth — this is the front door. */
export async function submitApplication(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const motivation = String(formData.get("motivation") ?? "").trim();

  if (!name || !email || !motivation) redirect("/admissions");

  await db().insert(application).values({
    name: name.slice(0, 200),
    email: email.slice(0, 200),
    location: String(formData.get("location") ?? "").slice(0, 200) || null,
    interestedPath: String(formData.get("path") ?? "").slice(0, 100) || null,
    motivation: motivation.slice(0, 5000),
    priorStudy: String(formData.get("prior") ?? "").slice(0, 5000) || null,
    weeklyHours: String(formData.get("hours") ?? "").slice(0, 50) || null,
    canAttendLive: String(formData.get("live") ?? "") === "yes",
  });

  redirect("/admissions/thank-you");
}
