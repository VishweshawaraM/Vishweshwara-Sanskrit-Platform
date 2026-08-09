import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { person } from "./identity";

/**
 * Append-only audit of consequential acts: grade changes, mastery marks,
 * result declarations, certificate issue and revocation. No update or delete
 * path exists in application code.
 */
export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorPersonId: uuid("actor_person_id").references(() => person.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  detail: jsonb("detail"),
  at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
});
