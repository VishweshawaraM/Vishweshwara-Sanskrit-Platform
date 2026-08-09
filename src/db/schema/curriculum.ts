import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Curriculum is DATA, not code.
 *
 * Paths, stages and syllabus items are rows. Content can be added, reordered and
 * corrected at any time without a deploy. Two of the five paths have no stages
 * yet — that is a normal state, not a blocker.
 */

export const path = pgTable(
  "path",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    nameLatin: text("name_latin").notNull(),
    nameDevanagari: text("name_devanagari"),
    summary: text("summary"),
    durationMinMonths: integer("duration_min_months"),
    durationMaxMonths: integer("duration_max_months"),
    sortOrder: integer("sort_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("path_slug_idx").on(t.slug)],
);

export const stage = pgTable(
  "stage",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pathId: uuid("path_id").notNull().references(() => path.id),
    stageNumber: integer("stage_number").notNull(),
    nameLatin: text("name_latin").notNull(),
    nameDevanagari: text("name_devanagari"),
    description: text("description"),
    durationMinMonths: integer("duration_min_months"),
    durationMaxMonths: integer("duration_max_months"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("stage_path_number_idx").on(t.pathId, t.stageNumber)],
);

export const syllabusItem = pgTable("syllabus_item", {
  id: uuid("id").primaryKey().defaultRandom(),
  stageId: uuid("stage_id").notNull().references(() => stage.id),
  sortOrder: integer("sort_order").notNull().default(0),
  titleLatin: text("title_latin").notNull(),
  titleDevanagari: text("title_devanagari"),
  kind: text("kind").notNull().default("topic"),
  reference: text("reference"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
});
