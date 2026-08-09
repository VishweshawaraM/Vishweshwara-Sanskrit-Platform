# Development Roadmap — Vishweshwara Sanskrit V1

**Version:** 0.1 DRAFT
⚠️ No launch date was given (M4) and no budget ceiling (M2). Durations are effort estimates for
one experienced full-stack developer working steadily, not calendar promises.

---

## Sequencing principle

**Ship the public site first, then the teaching loop, then everything around it.**

The public site is the only module with no dependency on unanswered questions, it starts
accumulating SEO and AI-citation value the day it goes live, and it can carry admissions by
email long before a portal exists. The teaching loop — session → work → feedback → progress —
is the heart; everything else is support.

A deliberate consequence: **the Acharya can run the Gurukula with Phases 0–2 alone.** Every phase
after that removes manual effort rather than enabling teaching.

---

## Phase 0 — Foundations · ~1 week

Repository, TypeScript, Tailwind with the locked token layer, Postgres, Drizzle, migrations, CI.
Design system: the parchment/charcoal/maroon/gold palette as tokens, type scale, spacing.
**Devanagari font selection, licensing check, subsetting pipeline, and a rendering test with real
vedic accents on real devices.** Lighthouse budgets wired into CI.

*Exit:* an empty site deploys, hits the performance budget, and renders accented Devanagari
correctly on a low-end Android.

**Do this first because font handling is the likeliest thing to quietly wreck both the design and
the performance targets, and it is far cheaper to discover in week one.**

---

## Phase 1 — Public website · ~2–3 weeks

Home · About · the five Learning Path pages · Digital Gurukula · Writings archive · Admissions ·
Contact · Terms · Privacy. MDX content pipeline. Structured data, sitemap, `llms.txt`.
Admission request form → stored to the database and emailed to the Acharya.
Migration of the existing domain with redirects preserving any current URLs.

*Depends on:* the Acharya's own writing (D-07), verified Devanagari, the Advaita and Stotra
curricula, brand asset decisions, D-02a/D-02b.

*Exit:* **live at the domain, taking real admission requests.** The Gurukula is now operating
with the platform, handling everything after the request by hand.

---

## Phase 2 — The teaching loop · ~4–5 weeks

The heart. Nothing here is optional.

- Auth — magic link and Google; the Acharya's account; student invitation
- Curriculum seeded with the three real curricula
- Students and enrollments; the student record; private Acharya notes
- Sessions and session series; **Zoom Server-to-Server OAuth**; join links; timezone display
- Attendance with Zoom suggestion and Acharya confirmation
- Assignments; submission of audio, handwriting photographs, and Devanagari text
- **The review queue** — keyboard-driven, audio playback and recording in place
- Written and **audio feedback**; resubmission
- Progress: item-level marking; the Acharya's mastery decision
- Student portal home; teacher morning screen
- Email notifications: session reminders, work set, work reviewed

*Depends on:* 🔴 the Zoom plan, 🔴 Section 2 roles, 🔴 Abhyāsa-vs-Homework, 🔴 the grading scale.

*Exit:* a full week of real teaching runs through the platform end to end.

**Suggested checkpoint: run Phase 2 with three willing students for two weeks before going
wider.** The review queue is where the Acharya will spend most of their working life, and its
ergonomics can only be judged in use.

---

## Phase 3 — Avalokanam & Certificates · ~3 weeks

Assessment authoring with mixed components · recitation, oral, written, objective · recording
results · the declaration step · retakes with history · stage completion gating.

Certificate issuance always by explicit act · the āśaṁsanapatram design in the tradition of the
Acharya's own dīkṣānta · **pañcāṅga plus Gregorian dating** · PDF with embedded Devanagari ·
`/verify/<id>` permanent public verification · revocation.

*Depends on:* 🔴 benediction wording, 🔴 the Acharya's title, 🔴 legal vs public name, seal and
signature assets, pañcāṅga calculation source.

*Exit:* the first real certificate is issued and verifies at a public URL.

---

## Phase 4 — Depth · ~3 weeks

Abhyāsa daily log · progress views for student and Acharya · parent access for minors ·
announcements · admissions review queue with orientation scheduling and conversion to enrollment ·
recording distribution with consent · CSV import and export · the Acharya's daily digest ·
audit log surfaced.

---

## Phase 5 — Sanskrit craft · ~2 weeks

The work that separates this from any LMS, deliberately placed after the loop works:

Transliteration input (`namaste` → नमस्ते) · cross-script search · the śloka component with
padaccheda and layered translation · audio slow-play without pitch change and A–B looping ·
accent rendering audited across browsers and devices.

*This is scheduled late but is not optional. It is the reason the platform exists rather than a
Google Classroom account.*

---

## Phase 6 — Hardening & launch · ~2 weeks

Accessibility audit to WCAG 2.1 AA · low-end Android and 3G testing · **backup restore test** ·
DPDP and GDPR review · Terms and Privacy finalised · Sentry and uptime monitoring · a written
runbook for the Acharya · data migration of existing students.

---

## Total: roughly 17–20 weeks of focused work

| Phase | Effort | Cumulative |
|---|---|---|
| 0 Foundations | 1 wk | 1 |
| 1 Public website | 2–3 wk | 4 |
| 2 Teaching loop | 4–5 wk | 9 |
| 3 Avalokanam & Certificates | 3 wk | 12 |
| 4 Depth | 3 wk | 15 |
| 5 Sanskrit craft | 2 wk | 17 |
| 6 Hardening | 2 wk | 19 |

---

## What is deliberately *not* built

Payments · cart · marketplace · community · mobile app · AI chatbot · multi-teacher · in-browser
video · automated grading of anything requiring judgment · **gamification of any kind**.

Seams left clean for a possible V2 — without building any of it: a `teacher_id` is absent from
sessions today but the schema can take one; enrollment and Dakṣiṇā are fully separated, so
payments could attach later without touching the teaching model; content lives in MDX so a CMS
can be introduced without a data migration.

---

## The critical path, honestly stated

Four things gate everything, and three of them are yours rather than mine:

1. 🔴 **The Zoom plan.** Free cannot automate. This gates Phase 2 entirely.
2. 🔴 **Your writing** — the method, the paramparā, your reasons for teaching. This gates
   Phase 1, and no one else can produce it.
3. 🔴 **Verified Devanagari** for every stage name and text title. Gates Phases 0 and 1.
4. 🔴 **The teaching-model ruling** — the real student ceiling, and which stages are taught in
   groups. It does not change the schema, but it decides whether the review queue must handle
   30 submissions a week or 300, which is a genuine difference in how Phase 2 is built.

---

## Recommendation

**Approve Phases 0 and 1 now and let me begin**, while Sections 2 through 11 of the interview
continue in parallel. The public site depends on almost nothing that is still open, it is the
module you can most usefully react to when you see it, and every week it is live is a week of
accumulating search and citation authority.

The portal should not begin until the four critical-path items above are settled.
