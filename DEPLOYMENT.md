# Deployment — three steps, ~20 minutes

Everything below happens in your browser and one terminal. Nothing here
requires a developer.

---

## 1 · GitHub (~5 min)

On the machine where you downloaded `vishweshwara-fullstack.bundle`:

```bash
git clone vishweshwara-fullstack.bundle vishweshwara
cd vishweshwara
git remote set-url origin https://github.com/VishweshawaraM/Vishweshwara-Sanskrit-Platform
git push -u origin claude/vishweshwara-requirements-y7t9f8
```

Then on github.com, open the repository → **Compare & pull request** → merge
the branch into `main` (or just push to main directly:
`git push origin claude/vishweshwara-requirements-y7t9f8:main`).

**While you are there:** github.com → Settings → Integrations → the Claude
app → grant **Read and write** on this repository. That is the single change
that lets me commit directly in every future session — no more bundles.

## 2 · Supabase (~5 min, no terminal)

1. [supabase.com](https://supabase.com) → New project → name it `vishweshwara`
   → region **South Asia (Mumbai)** → set a database password and save it.
2. Once the project finishes provisioning, press **Connect** (top bar) →
   **Connection string** → choose **Session pooler**. Copy it, and replace
   `[YOUR-PASSWORD]` with the password from step 1.

   > It must be the **Session pooler** on port **5432**. GitHub runners and
   > Vercel are IPv4-only; Supabase's direct connection is IPv6-only and will
   > simply time out. The transaction pooler (6543) cannot run migrations.

3. Put that string in **two** places, both in the browser:

   **a. GitHub** → your repo → Settings → Secrets and variables → Actions →
   **New repository secret** → name `DATABASE_URL`, paste the string.

   **b. Vercel** → (after step 3 below) Project → Settings → Environment
   Variables → `DATABASE_URL`, same string.

4. Create the tables — **no terminal**: GitHub → **Actions** tab → **Database**
   → **Run workflow** → tick **Also run the seed** (first time only) → Run.

   Two minutes later the run turns green: 22 tables created, the Acharya and a
   demo student exist. The log prints both passwords — **change them.**

## 3 · Vercel (~5 min)

1. [vercel.com](https://vercel.com) → Add New → Project → Import the GitHub
   repository. Framework is auto-detected (Next.js). Do not change build
   settings.
2. Before the first deploy, add one Environment Variable:
   - `DATABASE_URL` = the same Session-pooler string
3. Deploy. You get `https://<project>.vercel.app` in about two minutes.

**Custom domain, when ready:** Vercel → Project → Settings → Domains → add
`vishweshwarasanskrit.com` and follow the DNS instructions at your registrar.
Do not take the old site down until the new one is live at the domain.

---

## After it is live

| To do | Where |
|---|---|
| Change the Acharya password | (until a UI exists) Supabase → Table editor → `person` → ask Claude to add a change-password page — it is a small task |
| Zoom automation | Create the Server-to-Server OAuth app per `docs/10-zoom-integration.md` §7, add the four `ZOOM_*` vars in Vercel |
| Email notifications | resend.com → verify your domain → add `RESEND_API_KEY` and `EMAIL_FROM` |
| Audio submissions | Cloudflare R2 bucket → add the four `R2_*` vars |

Each of these unlocks the next slice of `docs/09-roadmap.md` Phase 2–3, and
none of them blocks the platform from being used today.

## What runs where

```
Browser ──► Vercel (Next.js: public site + portal + dashboard)
                     │
                     └──► Supabase Postgres (all data)

Zoom / Resend / R2 — attached later via environment variables only.
```

One repository, one deploy, one database. Designed so a single person can
operate it (docs/05 §1, principle 5).
