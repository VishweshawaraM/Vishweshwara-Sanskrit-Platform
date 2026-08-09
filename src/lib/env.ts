import { z } from "zod";

/**
 * Environment validation.
 *
 * Fails at startup rather than at the moment a student tries to join a class.
 * Sprint 1 keeps every integration OPTIONAL so the project builds and runs
 * before any external account exists.
 */

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Public
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),

  // Database — Supabase Postgres
  DATABASE_URL: z.string().min(1).optional(),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // Zoom — Server-to-Server OAuth (docs/10 §7). Not wired until Phase 2.
  ZOOM_ACCOUNT_ID: z.string().optional(),
  ZOOM_CLIENT_ID: z.string().optional(),
  ZOOM_CLIENT_SECRET: z.string().optional(),
  ZOOM_WEBHOOK_SECRET_TOKEN: z.string().optional(),

  // Storage — Cloudflare R2. Recordings are offloaded here from Zoom (docs/10 §3).
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET: z.string().optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment:\n", z.treeifyError(parsed.error));
  throw new Error("Invalid environment. See .env.example.");
}

export const env = parsed.data;

/** Guards for code paths that genuinely need an integration configured. */
export function requireDatabaseUrl(): string {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");
  }
  return env.DATABASE_URL;
}
