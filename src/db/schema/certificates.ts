import { date, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { path, stage } from "./curriculum";
import { person } from "./identity";

/**
 * Certificates are historical records: every displayed value is SNAPSHOTTED at
 * issue and never re-read from live tables. If the Acharya's title changes in
 * 2030, a 2026 certificate still reads as it did when granted.
 *
 * public_id is opaque, non-sequential, permanent. /verify/<public_id> reads
 * only this table, unauthenticated, forever (docs/06 §3).
 */
export const certificate = pgTable(
  "certificate",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    publicId: text("public_id").notNull(),
    studentId: uuid("student_id").notNull().references(() => person.id),
    pathId: uuid("path_id").notNull().references(() => path.id),
    stageId: uuid("stage_id").references(() => stage.id),
    kind: text("kind", {
      enum: ["stage_completion", "path_completion", "participation"],
    }).notNull(),

    holderNameLatin: text("holder_name_latin").notNull(),
    holderNameDevanagari: text("holder_name_devanagari"),
    pathNameLatin: text("path_name_latin").notNull(),
    pathNameDevanagari: text("path_name_devanagari"),
    stageNameLatin: text("stage_name_latin"),
    acharyaName: text("acharya_name").notNull(),
    institutionName: text("institution_name").notNull(),

    issuedOnGregorian: date("issued_on_gregorian").notNull(),
    issuedPanchanga: text("issued_panchanga"),

    issuedBy: uuid("issued_by").notNull().references(() => person.id),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    revokedReason: text("revoked_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("certificate_public_id_idx").on(t.publicId)],
);
