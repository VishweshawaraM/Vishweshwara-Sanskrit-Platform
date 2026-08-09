import {
  boolean,
  date,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/** People. One row per human; role decides which surfaces they see. */
export const person = pgTable(
  "person",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    role: text("role", { enum: ["acharya", "student", "parent", "assistant"] })
      .notNull()
      .default("student"),
    email: text("email").notNull(),
    nameLatin: text("name_latin").notNull(),
    nameDevanagari: text("name_devanagari"),
    phone: text("phone"),
    country: text("country"),
    timezone: text("timezone").notNull().default("Asia/Kolkata"),
    dateOfBirth: date("date_of_birth"),
    status: text("status", {
      enum: ["invited", "active", "paused", "alumni", "declined"],
    })
      .notNull()
      .default("active"),
    // scrypt hash, format: salt:hex. NULL until the person sets a password.
    passwordHash: text("password_hash"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("person_email_idx").on(t.email)],
);

/** Opaque server-side sessions. The cookie carries only the token. */
export const sessionToken = pgTable(
  "session_token",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    personId: uuid("person_id").notNull().references(() => person.id),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("session_token_hash_idx").on(t.tokenHash)],
);

/** Minors only. Adults never have a row here (PRD §2). */
export const guardianLink = pgTable(
  "guardian_link",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    guardianPersonId: uuid("guardian_person_id").notNull().references(() => person.id),
    studentPersonId: uuid("student_person_id").notNull().references(() => person.id),
    relationship: text("relationship"),
    consentRecordedAt: timestamp("consent_recorded_at", { withTimezone: true }),
    canViewFeedback: boolean("can_view_feedback").notNull().default(false),
  },
  (t) => [
    uniqueIndex("guardian_pair_idx").on(t.guardianPersonId, t.studentPersonId),
  ],
);
