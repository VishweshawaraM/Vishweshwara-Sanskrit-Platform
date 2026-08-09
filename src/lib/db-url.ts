/**
 * Connection options derived from DATABASE_URL.
 *
 * Supabase (and every managed Postgres) requires TLS; a local development
 * database usually has none. Requesting SSL unconditionally breaks local work,
 * and omitting it breaks production with the opaque postgres-js message
 * "connection is insecure (try using sslmode=require)". So decide by host.
 */
export function sslModeFor(url: string): "require" | false {
  try {
    const host = new URL(url).hostname;
    const local =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host.endsWith(".local");
    return local ? false : "require";
  } catch {
    return "require";
  }
}
