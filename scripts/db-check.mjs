/**
 * Connection diagnostic.
 *
 * Runs before migrations so a failure names itself instead of surfacing as a
 * bare stack trace. Findings go to the job summary as well as the log, because
 * the summary is readable through the API when raw logs are not.
 *
 * Nothing here ever prints the password — only its length and shape.
 */
import { appendFileSync } from "node:fs";
import postgres from "postgres";

const lines = [];
function say(line) {
  console.log(line);
  lines.push(line);
}
function flush() {
  const file = process.env.GITHUB_STEP_SUMMARY;
  if (file) appendFileSync(file, lines.join("\n") + "\n");
}

const url = process.env.DATABASE_URL;
if (!url) {
  say("**DATABASE_URL is not set.** Add it under Settings → Secrets and variables → Actions.");
  flush();
  process.exit(1);
}

// ---- Inspect the string before dialling -----------------------------------

let parsed;
try {
  parsed = new URL(url);
} catch {
  say("**The connection string is not a valid URL.**");
  say("This usually means the password contains a character that must be");
  say("percent-encoded: `@` → `%40`, `#` → `%23`, `/` → `%2F`, `:` → `%3A`.");
  say("Simplest fix: Supabase → Settings → Database → Reset database password,");
  say("choose one with only letters and digits, then update the secret.");
  flush();
  process.exit(1);
}

const username = decodeURIComponent(parsed.username || "");
const password = decodeURIComponent(parsed.password || "");
const host = parsed.hostname;
const port = parsed.port || "5432";

say(`- host: \`${host}\``);
say(`- port: \`${port}\``);
say(`- username: \`${username}\``);
say(`- password: ${password.length} characters`);
say("");

let fatal = false;

if (/^\[.*\]$/.test(password) || /your.?password/i.test(password)) {
  say("**The password is still the placeholder.** The string contains");
  say("`[YOUR-PASSWORD]` rather than your real password. Replace it —");
  say("including the square brackets — with the database password you set when");
  say("creating the project, then update the `DATABASE_URL` secret.");
  fatal = true;
}

if (password.length === 0) {
  say("**No password in the connection string.**");
  fatal = true;
}

if (host.includes("pooler.supabase.com") && !username.includes(".")) {
  say(`**The username is wrong for the pooler.** It is \`${username}\`, but the`);
  say("pooler needs `postgres.<project-ref>` — for this project,");
  say("`postgres.kfgffpppnuswonpizgae`. Copy the string again from");
  say("Supabase → Connect → **Session pooler**.");
  fatal = true;
}

if (fatal) {
  flush();
  process.exit(1);
}

// ---- Dial ------------------------------------------------------------------

const isLocal = host === "localhost" || host === "127.0.0.1";
const sql = postgres(url, {
  prepare: false,
  max: 1,
  ssl: isLocal ? false : "require",
  connect_timeout: 20,
});

try {
  const [row] = await sql`select current_database() as db, version() as version`;
  say(`**Connected.** database \`${row.db}\``);
  say("");
  say("```");
  say(row.version.split(",")[0]);
  say("```");
  await sql.end();
  flush();
} catch (error) {
  const message = String(error?.message ?? error);
  say(`**Connection failed:** \`${message}\``);
  say("");

  if (/password authentication failed|SASL|SCRAM/i.test(message)) {
    say("→ The password is wrong. Supabase → Settings → Database →");
    say("  **Reset database password**, then update the `DATABASE_URL` secret.");
  } else if (/Tenant or user not found/i.test(message)) {
    say("→ The pooler does not recognise this username. It must be");
    say("  `postgres.kfgffpppnuswonpizgae`. Re-copy from Connect → Session pooler.");
  } else if (/insecure|SSL|TLS/i.test(message)) {
    say("→ TLS negotiation failed. This should be handled in code; report it.");
  } else if (/ENOTFOUND|EAI_AGAIN/i.test(message)) {
    say("→ The hostname does not resolve. Check it for typos.");
  } else if (/ETIMEDOUT|ECONNREFUSED|timeout/i.test(message)) {
    say("→ Could not reach the host. If the project was paused, resume it in");
    say("  the Supabase dashboard and try again.");
  } else {
    say("→ Unrecognised error. Send this message and it can be diagnosed.");
  }
  flush();
  process.exit(1);
}
