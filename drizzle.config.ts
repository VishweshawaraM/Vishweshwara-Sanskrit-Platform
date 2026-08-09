import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL ?? "";

// Managed Postgres (Supabase, Neon) requires TLS; local development has none.
const host = (() => {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
})();
const isLocal = host === "localhost" || host === "127.0.0.1" || host === "::1";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url,
    ssl: isLocal ? false : "require",
  },
  // Migrations are committed and never edited after being applied (docs/08 §2).
  strict: true,
  verbose: true,
});
