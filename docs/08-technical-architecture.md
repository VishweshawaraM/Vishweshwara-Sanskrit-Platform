# Technical Architecture & Folder Structure

**Version:** 0.1 DRAFT
⚠️ The entire stack is **ASSUMED** — M1 (stack preference) and M2 (budget) were never answered.

---

## 1. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15, App Router, TypeScript** | Static generation for the public site *and* a real application in one codebase — one deploy, one design system, one thing for a solo maintainer to know |
| Styling | **Tailwind CSS** with a locked design-token layer | Tokens hold the palette and type scale; no ad-hoc colour anywhere |
| Database | **PostgreSQL** (Neon or Supabase) | Relational data with real constraints. Free tier is sufficient at this scale |
| ORM | **Drizzle** | SQL-transparent, light, migrations readable in twenty years. Prisma hides too much for a schema meant to outlive its ORM |
| Auth | **Auth.js** — email magic link + Google | ⚠️ No passwords. Phone/OTP deferred until you confirm students need it |
| File storage | **Cloudflare R2** | S3-compatible with **zero egress fees** — decisive when serving recitation audio repeatedly |
| Email | **Resend** | Transactional email on a custom domain |
| Video | **Zoom Server-to-Server OAuth** | 🔴 Requires Zoom Pro or above |
| PDF | **@react-pdf/renderer**, server-side | Certificates rendered with embedded Devanagari fonts |
| Content | **MDX files in git** | No CMS. Writings are plain text with no presentation baked in — durable, diffable, portable (D-05) |
| Jobs | **Vercel Cron** or pg-boss | Reminders, digests, Zoom sync |
| Hosting | **Vercel** | ⚠️ Alternative: Coolify on a Hetzner VPS (~€5/mo) for full control at more operational effort |
| Analytics | **Plausible** | Privacy-respecting; no cookie banner needed |
| Errors | **Sentry** free tier | |

**Estimated monthly cost: $25–45.** Dominated by Vercel Pro ($20) and Resend ($20 above free
tier). Everything else sits in free tiers at this scale. 🔴 Confirm against your budget.

### Why not a CMS, headless or otherwise

The Acharya edits rarely and writes long-form. MDX in git gives permanent content, free version
history, no vendor to outlive, and no monthly cost. The trade-off is honest: **editing requires
a developer, or a text editor and a commit.** If you want to publish writings yourself without
help, say so now — it changes this decision, and retrofitting is expensive.

### Devanagari font strategy

The single most likely cause of a blown performance budget. Accent-complete Devanagari fonts are
large. Required: subset to the actual glyph range including vedic accents · WOFF2 · `font-display:
swap` with a metric-matched fallback so nothing shifts · `<link rel=preload>` on pages with
Sanskrit above the fold · self-hosted, never from a font CDN.
🔴 Murty Sanskrit and Shobhika licensing must be verified before selection.

---

## 2. Folder structure

```
vishweshwara-sanskrit/
├── docs/                              # this requirements set — kept in the repo
├── content/                           # MDX. Durable, no presentation baked in.
│   ├── writings/<slug>.mdx
│   ├── paths/<path>.mdx               # public-facing path narrative
│   └── pages/{about,gurukula,admissions}.mdx
│
├── public/
│   ├── fonts/                         # self-hosted, subsetted
│   ├── brand/                         # logo, seal, signature
│   └── llms.txt
│
├── src/
│   ├── app/
│   │   ├── (site)/                    # PUBLIC — statically generated, no JS required
│   │   │   ├── page.tsx               # home
│   │   │   ├── about/ gurukula/ contact/ terms/ privacy/
│   │   │   ├── paths/[slug]/
│   │   │   ├── writings/[slug]/  texts/[slug]/
│   │   │   └── admissions/{page,request,thank-you}/
│   │   │
│   │   ├── verify/[publicId]/         # PERMANENT. Never move this route.
│   │   │
│   │   ├── (portal)/portal/           # STUDENT
│   │   │   ├── page.tsx  sessions/  work/  abhyasa/
│   │   │   ├── progress/  avalokanam/  certificates/  profile/
│   │   │
│   │   ├── (parent)/parent/           # GUARDIAN — minors only
│   │   │
│   │   ├── (acharya)/acharya/         # TEACHER
│   │   │   ├── page.tsx               # the morning screen
│   │   │   ├── schedule/  sessions/[id]/
│   │   │   ├── students/[id]/
│   │   │   ├── review/[id]/           # the highest-traffic screen
│   │   │   ├── assignments/  avalokanam/  applications/
│   │   │   ├── certificates/  curriculum/  settings/
│   │   │
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── webhooks/zoom/
│   │   │   ├── uploads/sign/          # presigned R2 URLs
│   │   │   └── cron/{reminders,digest,zoom-sync}/
│   │   └── layout.tsx
│   │
│   ├── db/
│   │   ├── schema/                    # one file per domain — mirrors doc 07
│   │   │   ├── identity.ts  curriculum.ts  enrollment.ts
│   │   │   ├── sessions.ts  abhyasa.ts  avalokanam.ts
│   │   │   ├── certificates.ts  admissions.ts  ops.ts
│   │   ├── migrations/                # committed, never edited after apply
│   │   ├── seed/                      # the three real curricula
│   │   └── index.ts
│   │
│   ├── domain/                        # BUSINESS LOGIC — framework-independent.
│   │   ├── enrollment/  progress/  scheduling/
│   │   ├── abhyasa/  avalokanam/  certificates/  admissions/
│   │   └── policy/                    # who may see what
│   │
│   ├── services/                      # OUTSIDE WORLD — each behind an interface
│   │   ├── zoom/  storage/  email/  pdf/  panchanga/
│   │
│   ├── lib/
│   │   ├── sanskrit/                  # ← the part no generic LMS has
│   │   │   ├── transliterate.ts       # IAST ⇄ Devanagari ⇄ Harvard-Kyoto
│   │   │   ├── normalize.ts           # Unicode NFC, accent-safe
│   │   │   ├── search.ts              # cross-script search
│   │   │   └── validate.ts            # reject corrupted conjuncts on ingest
│   │   ├── time/                      # timezone conversion. IST is authoritative.
│   │   ├── auth/  audit/  ids/        # UUIDv7, opaque certificate IDs
│   │
│   ├── components/
│   │   ├── primitives/                # Button, Field, Dialog…
│   │   ├── sanskrit/                  # Shloka, DevanagariInput, AccentedText
│   │   ├── audio/                     # Recorder, Player (slow-play, A–B loop)
│   │   ├── site/  portal/  acharya/
│   │
│   └── styles/tokens.css              # palette + type scale. The ONLY place colour lives.
│
├── emails/                            # React Email templates
├── tests/{unit,integration,e2e}/
└── scripts/                           # font subsetting, curriculum import, backup verify
```

### The three rules this structure enforces

1. **`domain/` never imports from `app/` or `services/`.** Business logic — what mastery means,
   who may see a child's feedback, when a certificate may issue — outlives every framework
   decision above it. In 2035 the UI can be replaced without touching it.
2. **`lib/sanskrit/` is a first-class module, not a utility drawer.** Transliteration,
   normalisation, cross-script search, and corruption validation are the platform's
   differentiator. `validate.ts` exists because the supplied PDFs proved how easily Devanagari
   corrupts in transit — nothing enters the database unvalidated.
3. **`services/` are interfaces.** Zoom, R2, Resend, and the pañcāṅga calculator are each behind
   a boundary. Zoom in particular will change its API; that must be a one-file change.

---

## 3. Security and privacy

- Authorization enforced in `domain/policy/`, server-side, on every request. A parent link grants
  *scoped* access to one child's summary — never feedback, unless `can_view_feedback` is true.
- All uploads via presigned URLs; **no file is ever publicly readable** — audio and handwriting
  are served through short-lived signed URLs after an authorization check.
- Private fields — `enrollment.acharya_notes_md`, `session.acharya_notes_md`,
  `application.acharya_notes_md` — never leave the server for a non-Acharya request. Enforced at
  the query layer, not by hiding them in the UI.
- Audit log append-only; no update or delete grant on that table.
- Nightly `pg_dump` to R2, 30-day retention, **with a monthly restore test** — an untested backup
  is not a backup.
- DPDP and GDPR: data minimisation, export on request, deletion honoured by archival plus
  personal-data erasure, retaining the certificate record for verification integrity.
- Recording consent captured per student; a student who declines is excluded from published
  recordings.

---

## 4. Performance

| Target | Method |
|---|---|
| LCP < 1.5s on 4G | Static generation, no hero video, subsetted preloaded fonts |
| CLS ≈ 0 | Metric-matched font fallback; fixed media dimensions |
| < 100KB JS on public pages | Server components; client JS only where interaction demands it |
| Public site works with JS disabled | Forms post to server actions with a no-JS path |
| Audio streams, never fully downloads | Range requests from R2 |

Enforced in CI with Lighthouse budgets — a regression fails the build rather than being noticed
in a year.
