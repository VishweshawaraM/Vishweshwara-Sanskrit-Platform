# Vishweshwara Sanskrit

A **Digital Gurukula** — a platform through which one Acharya teaches Sanskrit,
Krishna Yajurveda, Bhagavad Gītā, Advaita Vedānta, and Stotras to students
worldwide through live personal instruction in the Guru–Śiṣya Paramparā.

It is not an LMS, a course marketplace, or a coaching site. The live session is
the centre of the system; recordings are support material, never the product.

## Status

**Sprint 1 — foundation only.** No business feature is implemented. The database
schema is deliberately empty. See `docs/` for the full requirements set.

## Getting started

```bash
npm install
cp .env.example .env.local     # nothing is required to run the foundation
npm run dev
```

| Script | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Node test runner |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Apply migrations |

## Documentation

| Doc | Contents |
|---|---|
| `docs/01` | Vision and business |
| `docs/02` | Website decisions — palette, longevity, SEO/AEO/GEO |
| `docs/03` | Founder profile |
| `docs/04` | Curriculum and credentials |
| `docs/05` | **Product Requirements Document** |
| `docs/06` | Information architecture |
| `docs/07` | Database design |
| `docs/08` | Technical architecture and folder structure |
| `docs/09` | Development roadmap |
| `docs/10` | Zoom integration |
| `docs/11` | Teaching model and capacity |
| `docs/12` | **Devanagari reference — canonical strings** |
| `FONTS.md` | The open typography decision |

## Rules that are not negotiable

1. **The Acharya's judgment is never replaced by automation.** Nothing marks a
   student as having progressed, passed, or been certified except an explicit act.
2. **Colour is defined only in `src/app/globals.css`.** No hex in a component.
3. **`src/domain/` never imports from the framework** — enforced by ESLint.
4. **Sanskrit is validated on ingest.** `src/lib/sanskrit/validate.ts` rejects the
   corruption patterns that were present in the original source documents.
5. **`/verify/<id>` is a permanent address.** A certificate link issued in 2026 may
   be checked in 2045. It must never break.
6. **No gamification** — no streaks, badges, or leaderboards, ever.

## Running the full application locally

```bash
# 1. Postgres (any 15+). Locally:
#    pg_ctlcluster 16 main start
#    sudo -u postgres psql -c "CREATE ROLE vishweshwara LOGIN PASSWORD '...' CREATEDB;" \
#                          -c "CREATE DATABASE vishweshwara OWNER vishweshwara;"
# 2. Configure
cp .env.example .env.local     # set DATABASE_URL

# 3. Migrate and seed
npx drizzle-kit migrate
npx tsx scripts/seed.ts        # prints demo credentials — change them

# 4. Run
npm run dev
```

For Supabase: paste the session-pooler connection string as DATABASE_URL.
Nothing else changes.
