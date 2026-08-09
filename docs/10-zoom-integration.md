# Zoom Integration Design

**Account confirmed:** Zoom Workplace **Pro**, 1 licence.
**Status:** PRD ruling #2 — **CLOSED.** Automation is available.

---

## 1. What Pro unlocks

| Capability | Available | Used for |
|---|---|---|
| **Server-to-Server OAuth app** | ✅ | All API access. No user login, no token refresh dance |
| Meeting API — create, update, delete, recurring | ✅ | Session series and one-off sessions |
| **Cloud recording** | ✅ 10 GB | See §3 — this is the constraint |
| Recording API — list, download, delete | ✅ | Automated offload |
| **Participant reports** | ✅ Pro+ | Attendance suggestions |
| Webhooks | ✅ | Real-time session lifecycle |
| Meeting capacity | 100 | Far beyond need |
| Zoom Scheduler | 1 booking page | Possible orientation shortcut — §6 |
| Whiteboard | **3 editable boards** | A real limit — §6 |
| Clips Plus | ✅ | Optional; short correction videos |
| AI Companion | ✅ | Recommended **off** — §6 |

**The architecture in doc 08 stands unchanged.** Everything assumed available is available.

---

## 2. Meeting strategy — one recurring meeting per series

Confirmed as correct, and now for a second reason beyond tidiness.

**Zoom rate-limits meeting creation to roughly 100 calls per day per user.** At 50+ sessions a
week, per-session creation would be workable but wasteful, and any backfill or reschedule storm
would hit the ceiling. A recurring meeting per `session_series` collapses this to one call per
student per path — a handful of calls a month.

```
session_series  ──1:1──▶  Zoom recurring meeting (no fixed time, or RRULE-matched)
      │
      └── generates ──▶ session rows, all sharing the series join URL
```

One-off sessions — orientations, makeups, stage Avalokanam vivas — get their own single-occurrence
meeting created on demand.

**Consequence:** the join URL is stable per student per path. That is genuinely better for
students, who can bookmark one link, and it survives reschedules.

---

## 3. 🔴 The 10 GB cloud storage ceiling

This is the finding that matters, and it changes the recording design.

### The arithmetic

| Recording mode | Per 45-min session | Sessions before 10 GB is full |
|---|---|---|
| Video, speaker view 720p | ~110–260 MB | **≈ 40–90** |
| **Audio only (M4A)** | ~22 MB | **≈ 460** |

At 50 sessions a week with video, **10 GB fills in roughly one week.** Even at 20 sessions a
week it fills in under three. Once full, Zoom stops recording — silently, from the Acharya's
point of view, mid-term.

### The design that solves it

**Automated offload, triggered by webhook, within minutes of the session ending:**

```
meeting ends
   └─▶ Zoom fires  recording.completed
        └─▶ our webhook enqueues a job
             ├─ download the file using the S2S download token
             ├─ store in Cloudflare R2, write a session_recording row
             ├─ verify the SHA-256 of the stored object
             └─ DELETE the recording from Zoom cloud   ← frees the 10 GB
```

Zoom cloud becomes a **transit buffer, never a library.** Steady-state usage stays near zero,
and 10 GB is then ample. R2 has no egress fees, so serving the same recitation recording back to
a student fifty times costs nothing.

Non-negotiable safeguards, because this job deletes the only copy: never delete before the R2
write is verified · retry with backoff and alert the Acharya on repeated failure · a weekly job
that reports Zoom cloud usage so nobody discovers the ceiling by hitting it.

### Recommendation: record audio by default, video by exception

For one-to-one pronunciation correction, video adds cost and almost nothing else — the pedagogy
is entirely in the sound. Audio-only cuts storage roughly **90%** and makes recordings far more
usable on a phone over a weak connection, which matters for your international students.

Record video only where the screen carries meaning: Sanskrit grammar sessions with handwritten
explanation, and group classes.

Year-one R2 cost at 50 sessions/week: **~$1/month audio-only**, versus ~$8/month all-video.
Both affordable — but the audio-first default is better pedagogy *and* cheaper, which is rare.

🔴 **RULING NEEDED (E6):** do you want one-to-one sessions recorded at all? A recorded 1:1 is a
different thing from a recorded lecture — some teachers find it changes how a student speaks, and
being recorded while being corrected can inhibit exactly the risk-taking that improves
pronunciation. Options: always · never · at the student's request · your discretion per session.
**I would default to off for 1:1 and on for group, but this is your judgment, not mine.**

---

## 4. Attendance

```
meeting.ended  ─▶  GET /report/meetings/{meetingId}/participants
                    └─▶ match participants to students
                         ├─ confident match  → attendance='present', source='zoom'
                         └─ unmatched        → flagged for the Acharya
```

Matching is by Zoom account email first, then by display name, then not at all. Display names are
unreliable — students join as "iPhone", "Papa's laptop", or a nickname — so the Acharya's screen
always presents attendance as **review and confirm**, never as settled fact.

`session_participant.attendance_confirmed_by IS NULL` renders as "needs review". One click
confirms the whole session.

For one-to-one sessions this is nearly free: one participant, one student, unambiguous.

---

## 5. Webhooks consumed

| Event | Action |
|---|---|
| `meeting.started` | Record `actual_start_utc`; mark the session live |
| `meeting.ended` | Record `actual_end_utc`; queue the participant report |
| `meeting.participant_joined` / `_left` | Accumulate minutes attended |
| `recording.completed` | **Trigger the offload job — §3** |
| `meeting.updated` / `deleted` | Detect changes made directly in Zoom and reconcile |

All webhooks verified with Zoom's signature header. Every event stored raw before processing, so
a bug never loses an event permanently.

The last row matters: the Acharya will sometimes change a meeting inside the Zoom client rather
than in the platform. The system must notice rather than silently diverge.

---

## 6. The rest of the Workplace bundle

**Zoom Whiteboard — 3 editable boards.** Your Sanskrit methodology names "digital handwritten
explanation" as part of teaching, which makes this a real constraint: three boards will not serve
30+ students with persistent work. Options: (a) export each board to PDF into the student's
session record and clear it — workable, adds a step; (b) an iPad with a notes app, screen-shared,
exported as an image into the session — more flexible, likely better; (c) upgrade the whiteboard
plan. 🔴 Worth deciding, since handwriting is part of how you teach.

**Zoom Scheduler — 1 booking page.** A genuine Phase-1 shortcut: after an admission request passes
your review, send the applicant your Scheduler link to book the orientation themselves. That
removes scheduling back-and-forth without building a booking system. Note it must sit *after* the
filter, never as the public CTA — a public booking page would let anyone take your time.

**AI Companion — recommend off.** Its summaries and transcripts are trained on conversational
English and will produce nonsense from Sanskrit recitation, IAST, and Devanagari. Beyond
uselessness, running a Guru–Śiṣya session through an automated summariser sits badly with the
platform's stated principles. Off by default; the Acharya may enable it per meeting.

**Clips Plus.** Legitimately useful later — a 30-second recorded correction of a single mantra,
sent to one student. Not V1, but worth remembering.

---

## 7. Configuration required from the Acharya

1. Create a **Server-to-Server OAuth app** in the Zoom App Marketplace (requires account owner).
2. Grant scopes: `meeting:write:admin`, `meeting:read:admin`, `recording:write:admin`,
   `recording:read:admin`, `report:read:admin`, `user:read:admin`.
3. Supply **Account ID, Client ID, Client Secret** — these go into secrets, never the repository.
4. Enable **cloud recording** in account settings, and set **audio-only recording** as the default
   if §3's recommendation is accepted.
5. Set the webhook endpoint and copy the **secret token** for signature verification.

---

## 8. Failure posture

**A session must never fail because the platform is down.** Join URLs come from Zoom and remain
valid independently — if the platform is unreachable, teaching continues; only the surrounding
record-keeping pauses and reconciles afterwards.

If the Zoom API is unavailable when a series is created, the session is created without a meeting
and retried; the Acharya sees "meeting pending" rather than a hard failure.

---

## Updated critical path

| # | Item | Status |
|---|---|---|
| 1 | ~~Zoom plan~~ | ✅ **RESOLVED** — Pro, automation available |
| 2 | The Acharya's writing — method, paramparā, reasons | 🔴 Open — gates Phase 1 |
| 3 | Verified Devanagari for all stage names and text titles | 🔴 Open — gates Phases 0–1 |
| 4 | Teaching-model ruling — real student ceiling, group stages | 🔴 Open — sizes Phase 2 |
| 5 | Existing website content | 🔴 Blocked by network egress policy |
| — | *New:* record 1:1 sessions at all? | 🔴 Open — §3 |
| — | *New:* whiteboard approach given the 3-board limit | 🔴 Open — §6 |
