import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { stage } from "./curriculum";
import { enrollment } from "./enrollment";
import { person } from "./identity";

/**
 * Avalokanam. The outcome is a stored decision by the Acharya, never a value
 * computed from marks. 'not_yet' is deliberate: in this tradition a student
 * who has not reached the standard continues — they are not a failure.
 * declared_at separates deciding from telling.
 */
export const avalokanam = pgTable("avalokanam", {
  id: uuid("id").primaryKey().defaultRandom(),
  enrollmentId: uuid("enrollment_id").notNull().references(() => enrollment.id),
  stageId: uuid("stage_id").references(() => stage.id),
  kind: text("kind", { enum: ["continuous", "stage"] }).notNull().default("continuous"),
  title: text("title").notNull(),
  attemptNumber: integer("attempt_number").notNull().default(1),
  status: text("status", {
    enum: ["planned", "in_progress", "awaiting_declaration", "declared"],
  })
    .notNull()
    .default("planned"),
  outcome: text("outcome", {
    enum: ["passed", "not_yet", "passed_with_distinction"],
  }),
  remarks: text("remarks"),
  decidedBy: uuid("decided_by").references(() => person.id),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  declaredAt: timestamp("declared_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
