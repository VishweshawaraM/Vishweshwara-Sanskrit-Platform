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

## 2 · Supabase (~5 min)

1. [supabase.com](https://supabase.com) → New project → name it
   `vishweshwara` → region **Mumbai (ap-south-1)** → generate a strong
   database password and save it.
2. Project Settings → Database → **Connection string → URI**, and choose the
   **Session pooler** variant. Copy it.
3. From your terminal, in the repo:

```bash
echo 'DATABASE_URL=<the pooler string you copied>' > .env.local
npx drizzle-kit migrate        # creates all 22 tables
npx tsx scripts/seed.ts        # Acharya + demo student + curriculum
```

> The seed prints two demo logins. **Change both passwords immediately** —
> or delete the demo student once you have real accounts.

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
