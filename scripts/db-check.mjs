/**
 * Connection diagnostic.
 *
 * Runs before migrations in CI so a failure names itself instead of surfacing
 * as a bare stack trace. Every message below maps a real postgres-js error to
 * the specific setting that causes it.
 */
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const host = (() => {
  try {
    return new URL(url).hostname;
  } catch {
    console.error("DATABASE_URL is not a valid URL. Did the password contain a @ or # that needs escaping?");
    process.exit(1);
  }
})();

const isLocal = host === "localhost" || host === "127.0.0.1";
console.log(`Connecting to ${host} …`);

const sql = postgres(url, {
  prepare: false,
  max: 1,
  ssl: isLocal ? false : "require",
  connect_timeout: 20,
});

try {
  const [row] = await sql`select current_database() as db, version() as version`;
  console.log(`Connected. database=${row.db}`);
  console.log(row.version.split(",")[0]);
  await sql.end();
} catch (error) {
  const message = String(error?.message ?? error);
  console.error(`\nConnection failed: ${message}\n`);

  if (/insecure|SSL/i.test(message)) {
    console.error("→ The server requires TLS. This is now handled in code; if you see this, the fix did not deploy.");
  } else if (/password authentication failed|SASL/i.test(message)) {
    console.error("→ Wrong password. Reset it: Supabase → Settings → Database → Reset database password,");
    console.error("  then update the DATABASE_URL secret. Remember to remove the [ ] brackets around it.");
  } else if (/Tenant or user not found/i.test(message)) {
    console.error("→ The username is wrong for the pooler. It must be postgres.<project-ref>, not plain 'postgres'.");
    console.error("  Copy the string again from Supabase → Connect → Session pooler.");
  } else if (/ENOTFOUND|EAI_AGAIN/i.test(message)) {
    console.error("→ Host not found. Check the hostname in the connection string.");
  } else if (/ETIMEDOUT|ECONNREFUSED|timeout/i.test(message)) {
    console.error("→ Could not reach the host. If it looks like db.<ref>.supabase.co, that is the IPv6-only");
    console.error("  direct connection — use the Session pooler string instead.");
  }
  process.exit(1);
}
