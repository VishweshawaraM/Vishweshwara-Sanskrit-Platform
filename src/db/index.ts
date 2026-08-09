import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { sslModeFor } from "@/lib/db-url";
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
    const url = requireDatabaseUrl();
    // prepare:false is required by Supabase's pooler; ssl by every managed host.
    client = postgres(url, { prepare: false, max: 1, ssl: sslModeFor(url) });
    database = drizzle(client, { schema });
  }
  return database;
}

export { schema };
