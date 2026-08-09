import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { path, stage } from "./curriculum";
import { enrollment } from "./enrollment";
import { person } from "./identity";
import { session } from "./sessions";

/**
 * Two objects, because the Acharya's philosophy lists them separately:
 * Abhyāsa is the student's own daily practice, self-reported and ungraded;
 * an Assignment is work the Acharya sets and reviews.
 */

export const abhyasaLog = pgTable(
  "abhyasa_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enrollmentId: uuid("enrollment_id").notNull().references(() => enrollment.id),
    studentId: uuid("student_id").notNull().references(() => person.id),
    practisedOn: date("practised_on").notNull(),
    minutes: integer("minutes").notNull(),
    what: text("what").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("abhyasa_day_idx").on(t.enrollmentId, t.practisedOn)],
);

export const assignment = pgTable("assignment", {
  id: uuid("id").primaryKey().defaultRandom(),
  pathId: uuid("path_id").references(() => path.id),
  stageId: uuid("stage_id").references(() => stage.id),
  sessionId: uuid("session_id").references(() => session.id),
  title: text("title").notNull(),
  brief: text("brief").notNull(),
  dueAt: timestamp("due_at", { withTimezone: true }),
  allowLate: boolean("allow_late").notNull().default(true),
  createdBy: uuid("created_by").notNull().references(() => person.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
});

export const assignmentTarget = pgTable(
  "assignment_target",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assignmentId: uuid("assignment_id").notNull().references(() => assignment.id),
    studentId: uuid("student_id").notNull().references(() => person.id),
  },
  (t) => [uniqueIndex("assignment_target_idx").on(t.assignmentId, t.studentId)],
);

export const submission = pgTable(
  "submission",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assignmentId: uuid("assignment_id").notNull().references(() => assignment.id),
    studentId: uuid("student_id").notNull().references(() => person.id),
    attemptNumber: integer("attempt_number").notNull().default(1),
    bodyText: text("body_text"),
    bodyDevanagari: text("body_devanagari"),
    isLate: boolean("is_late").notNull().default(false),
    status: text("status", {
      enum: ["submitted", "reviewed", "resubmission_requested"],
    })
      .notNull()
      .default("submitted"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("submission_attempt_idx").on(
      t.assignmentId,
      t.studentId,
      t.attemptNumber,
    ),
  ],
);

/**
 * The Acharya's response. The grade is the traditional qualitative scale —
 * and 'punarabhyasah' (practise again) is a request, not a failure.
 */
export const review = pgTable("review", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id").notNull().references(() => submission.id),
  reviewedBy: uuid("reviewed_by").notNull().references(() => person.id),
  grade: text("grade", {
    enum: ["uttamam", "madhyamam", "sadharanam", "punarabhyasah"],
  }),
  feedback: text("feedback").notNull(),
  requiresResubmission: boolean("requires_resubmission").notNull().default(false),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }).notNull().defaultNow(),
});
