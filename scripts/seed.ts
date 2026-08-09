/**
 * Development seed. Idempotent-ish: run once on a fresh database.
 *
 *   DATABASE_URL=... npx tsx scripts/seed.ts   (or node --experimental-strip-types)
 *
 * Creates: the Acharya, one demo student, the curriculum, a weekly session
 * series with next occurrence, one assignment targeted at the student.
 * Prints the credentials it created. CHANGE BOTH PASSWORDS IMMEDIATELY in
 * any environment that outlives a demo.
 */
import { eq } from "drizzle-orm";

import { db } from "../src/db";
import {
  assignment,
  assignmentTarget,
  enrollment,
  path,
  person,
  session,
  sessionParticipant,
  sessionSeries,
  seriesMember,
  stage,
} from "../src/db/schema";
import { hashPassword } from "../src/lib/auth/password";
import { seedCurriculum } from "../src/db/seed";

async function main() {
  const database = db();

  console.log("Seeding curriculum…");
  await seedCurriculum();

  console.log("Creating people…");
  const [acharya] = await database
    .insert(person)
    .values({
      role: "acharya",
      email: "acharya@vishweshwarasanskrit.com",
      nameLatin: "Vishweshwara M",
      nameDevanagari: "विश्वेश्वरः",
      timezone: "Asia/Kolkata",
      country: "India",
      passwordHash: hashPassword("gurukula-dev-1"),
    })
    .onConflictDoNothing()
    .returning();

  const [student] = await database
    .insert(person)
    .values({
      role: "student",
      email: "shishya@example.com",
      nameLatin: "Ananya Sharma",
      nameDevanagari: "अनन्या शर्मा",
      timezone: "Europe/Berlin",
      country: "Germany",
      passwordHash: hashPassword("abhyasa-dev-1"),
    })
    .onConflictDoNothing()
    .returning();

  if (!acharya || !student) {
    console.log("People already exist; stopping (fresh DB expected).");
    return;
  }

  const [yajurveda] = await database
    .select()
    .from(path)
    .where(eq(path.slug, "krishna-yajurveda"))
    .limit(1);
  const [stage1] = await database
    .select()
    .from(stage)
    .where(eq(stage.pathId, yajurveda!.id))
    .limit(1);

  console.log("Enrolling the student…");
  const [_enr] = await database
    .insert(enrollment)
    .values({
      studentId: student.id,
      pathId: yajurveda!.id,
      currentStageId: stage1!.id,
      startedOn: new Date().toISOString().slice(0, 10),
      acharyaNotes: "Good ear. Rushes the dīrgha vowels when nervous.",
    })
    .returning();

  console.log("Scheduling a session…");
  const [series] = await database
    .insert(sessionSeries)
    .values({
      pathId: yajurveda!.id,
      title: "Yajurveda — Tuesday evening",
      rrule: "FREQ=WEEKLY;BYDAY=TU",
      timezone: "Asia/Kolkata",
      durationMinutes: 60,
      zoomJoinUrl: "https://zoom.us/j/placeholder",
      taughtBy: acharya.id,
    })
    .returning();

  await database.insert(seriesMember).values({ seriesId: series!.id, studentId: student.id });

  const nextTuesday = new Date();
  nextTuesday.setDate(nextTuesday.getDate() + ((9 - nextTuesday.getDay()) % 7 || 7));
  nextTuesday.setHours(18, 30, 0, 0); // 18:30 IST-ish for the demo
  const end = new Date(nextTuesday.getTime() + 60 * 60 * 1000);

  const [sess] = await database
    .insert(session)
    .values({
      seriesId: series!.id,
      pathId: yajurveda!.id,
      scheduledStartUtc: nextTuesday,
      scheduledEndUtc: end,
      zoomJoinUrl: "https://zoom.us/j/placeholder",
      taughtBy: acharya.id,
    })
    .returning();

  await database
    .insert(sessionParticipant)
    .values({ sessionId: sess!.id, studentId: student.id });

  console.log("Setting one assignment…");
  const [work] = await database
    .insert(assignment)
    .values({
      pathId: yajurveda!.id,
      stageId: stage1!.id,
      title: "Gaṇapati Sūktam — first anuvāka, recitation notes",
      brief:
        "Write out the first anuvāka in Devanagari from memory, and note in " +
        "English where your breath breaks differ from the recording we used " +
        "in class. We will correct pronunciation live on Tuesday.",
      dueAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      createdBy: acharya.id,
    })
    .returning();

  await database
    .insert(assignmentTarget)
    .values({ assignmentId: work!.id, studentId: student.id });

  console.log(`
Seed complete.

  Acharya   acharya@vishweshwarasanskrit.com / gurukula-dev-1
  Student   shishya@example.com / abhyasa-dev-1

Change both passwords in any environment that outlives a demo.
`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
