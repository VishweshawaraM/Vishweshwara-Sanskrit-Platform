import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { person } from "./identity";

/**
 * An orientation request from the public site. No fee, no amount, no payment
 * field anywhere — Guru Dakṣiṇā is discussed personally and recorded nowhere.
 */
export const application = pgTable("application", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  location: text("location"),
  interestedPath: text("interested_path"),
  motivation: text("motivation").notNull(),
  priorStudy: text("prior_study"),
  weeklyHours: text("weekly_hours"),
  canAttendLive: boolean("can_attend_live").notNull().default(true),
  status: text("status", {
    enum: [
      "new",
      "orientation_scheduled",
      "orientation_done",
      "enrolled",
      "waitlisted",
      "declined",
    ],
  })
    .notNull()
    .default("new"),
  // Private to the Acharya.
  acharyaNotes: text("acharya_notes"),
  decidedBy: uuid("decided_by").references(() => person.id),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  createdPersonId: uuid("created_person_id").references(() => person.id),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
});
