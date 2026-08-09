import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { path } from "./curriculum";
import { person } from "./identity";

/**
 * A scheduled live meeting with one or more participants. One participant is
 * one-to-one teaching; several is a small group. Same object, same screens
 * (docs/11 §2). No batch entity exists anywhere.
 */
export const sessionSeries = pgTable("session_series", {
  id: uuid("id").primaryKey().defaultRandom(),
  pathId: uuid("path_id").references(() => path.id),
  title: text("title").notNull(),
  // RFC 5545 RRULE, e.g. FREQ=WEEKLY;BYDAY=TU
  rrule: text("rrule"),
  timezone: text("timezone").notNull().default("Asia/Kolkata"),
  durationMinutes: integer("duration_minutes").notNull().default(60),
  zoomJoinUrl: text("zoom_join_url"),
  // Reserved for the future the Acharya named: more teachers, someday.
  taughtBy: uuid("taught_by").references(() => person.id),
  status: text("status", { enum: ["active", "paused", "ended"] })
    .notNull()
    .default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: uuid("id").primaryKey().defaultRandom(),
  seriesId: uuid("series_id").references(() => sessionSeries.id),
  pathId: uuid("path_id").references(() => path.id),
  kind: text("kind", { enum: ["class", "orientation", "avalokanam", "makeup"] })
    .notNull()
    .default("class"),
  scheduledStartUtc: timestamp("scheduled_start_utc", { withTimezone: true }).notNull(),
  scheduledEndUtc: timestamp("scheduled_end_utc", { withTimezone: true }).notNull(),
  status: text("status", {
    enum: ["scheduled", "completed", "cancelled", "rescheduled"],
  })
    .notNull()
    .default("scheduled"),
  zoomJoinUrl: text("zoom_join_url"),
  // Private to the Acharya.
  acharyaNotes: text("acharya_notes"),
  // What was covered — visible to participants.
  summaryForStudents: text("summary_for_students"),
  taughtBy: uuid("taught_by").references(() => person.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessionParticipant = pgTable(
  "session_participant",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id").notNull().references(() => session.id),
    studentId: uuid("student_id").notNull().references(() => person.id),
    attendance: text("attendance", {
      enum: ["unknown", "present", "absent", "late", "excused"],
    })
      .notNull()
      .default("unknown"),
    attendanceSource: text("attendance_source", { enum: ["zoom", "manual"] }),
    // Zoom only suggests; the Acharya confirms (docs/10 §4).
    attendanceConfirmedBy: uuid("attendance_confirmed_by").references(() => person.id),
    minutesAttended: integer("minutes_attended"),
  },
  (t) => [uniqueIndex("session_participant_idx").on(t.sessionId, t.studentId)],
);

/** Members of a recurring series — generates participants per session. */
export const seriesMember = pgTable(
  "series_member",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    seriesId: uuid("series_id").notNull().references(() => sessionSeries.id),
    studentId: uuid("student_id").notNull().references(() => person.id),
  },
  (t) => [uniqueIndex("series_member_idx").on(t.seriesId, t.studentId)],
);
