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

## 2 · Create the database (~2 min, no password needed)

Supabase generates a database password when the project is created, and if you
signed up through GitHub you were never shown it. You do not need it.

1. Supabase → left sidebar → **SQL Editor** → **New query**
2. Open **`supabase-setup.sql`** from this repository, select all, copy
3. Paste into the editor → press **Run**

That creates all 22 tables and loads the curriculum — five paths, sixteen
stages, thirty-five texts. It contains **no accounts and no passwords**, which
is why it is safe to keep in a public repository.

## 3 · Vercel (~5 min)

1. [vercel.com](https://vercel.com) → Add New → Project → import the GitHub
   repository. Next.js is detected automatically; change no build settings.
2. Connect the database — **either** way works:
   - **Easiest:** Vercel → Integrations → **Supabase** → connect your project.
     Vercel then sets `POSTGRES_URL` itself and you never handle a password.
   - **Manual:** add `DATABASE_URL` yourself, using the **Session pooler**
     string from Supabase → Connect, with the password filled in.
3. Add one more Environment Variable:
   - `SETUP_SECRET` — any long phrase you invent. It guards the page that
     creates your account. You will need it once.
4. Deploy. You get `https://<project>.vercel.app`.

## 4 · Create your account (~1 min)

Visit **`https://<your-site>/setup`**, enter your `SETUP_SECRET`, your name,
email and a password of your choosing.

The page then closes permanently — it refuses to run once an Acharya exists, so
it cannot create a second privileged account. Your password exists only as a
hash in your own database; it is never in this repository.

Sign in at `/login`. You are live.

**Custom domain, when ready:** Vercel → Settings → Domains → add
`vishweshwarasanskrit.com` and follow the DNS instructions at your registrar.
Do not take the old site down until the new one answers at the domain.

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
