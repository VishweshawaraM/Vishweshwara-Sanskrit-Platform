import {
  date,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { stage, syllabusItem, path } from "./curriculum";
import { person } from "./identity";

/** A student's journey on one path. Progress is a position, not a percentage. */
export const enrollment = pgTable(
  "enrollment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id").notNull().references(() => person.id),
    pathId: uuid("path_id").notNull().references(() => path.id),
    currentStageId: uuid("current_stage_id").references(() => stage.id),
    status: text("status", {
      enum: ["active", "paused", "completed", "withdrawn"],
    })
      .notNull()
      .default("active"),
    startedOn: date("started_on"),
    completedOn: date("completed_on"),
    // PRIVATE. Never rendered on any student or parent surface.
    acharyaNotes: text("acharya_notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("enrollment_student_path_idx").on(t.studentId, t.pathId)],
);

/**
 * Per-item progress. 'mastered' is set ONLY by an explicit act of the
 * Acharya — there is deliberately no trigger and no computed advancement.
 */
export const itemProgress = pgTable(
  "item_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enrollmentId: uuid("enrollment_id").notNull().references(() => enrollment.id),
    syllabusItemId: uuid("syllabus_item_id").notNull().references(() => syllabusItem.id),
    status: text("status", {
      enum: ["not_started", "in_progress", "completed", "mastered"],
    })
      .notNull()
      .default("not_started"),
    markedBy: uuid("marked_by").references(() => person.id),
    markedAt: timestamp("marked_at", { withTimezone: true }),
    notes: text("notes"),
  },
  (t) => [uniqueIndex("item_progress_idx").on(t.enrollmentId, t.syllabusItemId)],
);

/** Stage completion — an explicit, dated act of approval. */
export const stageCompletion = pgTable("stage_completion", {
  id: uuid("id").primaryKey().defaultRandom(),
  enrollmentId: uuid("enrollment_id").notNull().references(() => enrollment.id),
  stageId: uuid("stage_id").notNull().references(() => stage.id),
  completedOn: date("completed_on").notNull(),
  approvedBy: uuid("approved_by").notNull().references(() => person.id),
  remarks: text("remarks"),
});
