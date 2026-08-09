import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { requireDatabaseUrl } from "@/lib/env";
import * as schema from "./schema";

/**
 * Database client.
 *
 * Lazily constructed so the project builds and the public site renders before a
 * database exists — Sprint 1 has no tables and needs no connection.
 */

let client: ReturnType<typeof postgres> | undefined;
let database: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function db() {
  if (!database) {
    client = postgres(requireDatabaseUrl(), { prepare: false, max: 1 });
    database = drizzle(client, { schema });
  }
  return database;
}

export { schema };
