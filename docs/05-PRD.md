# Product Requirements Document — Vishweshwara Sanskrit V1

**Version:** 0.1 DRAFT — for the Acharya's approval
**Status:** No code until this document set is approved.

Assumptions are marked **⚠️ ASSUMED**. Each can be struck individually without invalidating
the rest. Open rulings are marked **🔴 RULING NEEDED**.

---

## 1. What this is

A **Digital Gurukula**: a platform through which one Acharya teaches Sanskrit, Krishna
Yajurveda, Bhagavad Gītā, Advaita Vedānta, and Stotras/Sūktas to students worldwide through
live personal instruction in the Guru–Śiṣya Paramparā.

**It is not** an LMS, a course marketplace, a coaching site, or a video library. The live
session is the centre of the system; recordings are support material, never the product.

### The teaching cycle the software must serve

```
Live session → pronunciation correction → Abhyāsa (practice)
     → assigned work → Acharya's feedback → Avalokanam (assessment)
     → stage progression → certificate
```

### Design principles (binding)

1. **The Acharya's judgment is never replaced by automation.** The system may surface, sort,
   remind, and calculate — it never decides who has progressed, who has passed, or who is
   certified.
2. **Preserve tradition over convention.** Where Gurukula practice and standard software
   practice conflict, tradition wins unless the Acharya rules otherwise.
3. **Qualify, don't maximise.** The platform filters for serious students rather than
   maximising signups.
4. **No money in the system.** Guru Dakṣiṇā is a personal conversation held entirely outside
   the platform. No prices, no invoices, no payment status. *(See §9 for the one open question
   about record-keeping.)*
5. **Built to last.** Permanent URLs, durable content formats, no dependence on trends.

---

## 2. Users

| Role | Count in V1 | Purpose |
|---|---|---|
| **Acharya** | 1 | Teaches, assesses, certifies, administers everything |
| **Student (adult)** | 25–100 | Learns; owns their own account |
| **Student (minor)** | subset | Learns; may have a linked parent |
| **Parent/Guardian** | optional | Visibility into a minor child's progress only |
| **Assistant** ⚠️ ASSUMED | 0 at launch | Role defined but dormant; enabled without rework later |

⚠️ **ASSUMED** — an Assistant role exists in the model from day one but is unused. Retrofitting
a second privileged role later is far more expensive than reserving it now.

🔴 **RULING NEEDED** — Section 2 of the interview (R1–R8) was never answered. Specifically:
minor age threshold; whether young children have their own login; what exactly a parent may see
(especially whether the Acharya's correction of a child is visible to the parent verbatim);
whether a parent may message the Acharya through the platform; whether students can see one
another.

⚠️ **ASSUMED until ruled otherwise:**
- Minor = under 18. A parent link is optional and only exists for minors.
- Every student has their own login regardless of age.
- Parents see attendance, stage progress, Avalokanam results, and certificates — but **not**
  the Acharya's verbatim written or audio correction of the child. *(Reasoning: correction is
  between Guru and śiṣya; a child who knows a parent reads every correction receives it
  differently. The Acharya may overrule.)*
- Parents cannot message through the platform in V1.
- Students **can** see who else is in a shared session, but never another student's marks,
  submissions, or feedback.

---

## 3. The teaching model

### 3.1 Paths and stages

A **Path** is a subject-length journey. A **Stage** is a numbered division within it, and a
**Syllabus Item** is a named text, mantra, or topic within a stage.

| Path | Stages | Duration | Item type |
|---|---|---|---|
| Sanskrit | 6 | 18–24 months, per-stage durations given | Grammar topics, vocabulary sets |
| Bhagavad Gītā | 5 (+advanced) | not stated | Chapters, ślokas, concepts |
| Krishna Yajurveda | 5 | not stated | Mantras, sūktas, praśnas, upaniṣads |
| Advaita Vedānta | 🔴 unknown | unknown | Prakaraṇa granthas |
| Stotras & Sūktas | 🔴 unknown | unknown | Individual stotras |

🔴 **RULING NEEDED** — Advaita Vedānta has no curriculum. Stotras & Sūktas has no curriculum and
overlaps Yajurveda Stages I–III; is it a distinct path or those stages renamed?

**Progress is a position, not a percentage.** Only Sanskrit has durations; Yajurveda Stage V is
open-ended. Progress is expressed as *"Sanskrit · Stage III · 4 of 9 items complete"* — never as
a completion bar against a fixed timeline.

### 3.2 Sessions — the resolution of the one-to-one question

**A Session is a scheduled live meeting with one or more participants.**

- One participant → one-to-one teaching (the default your curricula describe)
- Several participants → a group session
- The same object, the same screens, the same Zoom handling

There is **no Batch entity.** Instead an optional **Study Group** may be attached to a recurring
session series, purely as a convenience for scheduling several students together. Removing every
group in the system leaves a coherent one-to-one platform.

**Why this way:** your curricula state individual progression as a principle. A cohort model
would have forced group progress and made 1:1 the awkward exception. This inverts it correctly
— and it means your ruling on teaching model changes configuration, not schema.

🔴 **RULING STILL NEEDED** — not for the schema, but for the plan: what is the real number of
students you can teach well, and which stages (if any) will you teach in groups? At 75–100
one-to-one students, weekly sessions alone consume 56–75 hours. The system will be built either
way; the roadmap and your calendar depend on the answer.

### 3.3 Enrollment

A student enrolls in a **Path**, not in a class. An enrollment carries: current stage, status
(active / paused / completed / withdrawn), start date, and the Acharya's private notes.

⚠️ **ASSUMED** — a student may hold several concurrent enrollments (e.g. Sanskrit and Gītā).

---

## 4. Modules

### M1 · Public Website

Purpose, in order: **build trust → educate → convert** (D-01).

Pages: Home · About · Learning Paths (one page per path) · Digital Gurukula (the method) ·
Writings (the knowledge archive) · Admissions · Contact · Verify · Terms · Privacy.

- Single CTA sitewide: **Request an Orientation**
- The admission request form is a **filter**: motivation, prior study, weekly hours available,
  ability to attend live at a fixed time, timezone
- **No fees displayed anywhere**
- Writings is a primary pillar — a growing archive organised **by text**, not by course
- Statically generated, readable without JavaScript, LCP < 1.5s on 4G

🔴 D-02a — Admissions as a sixth nav item, or CTA as a persistent button outside the nav?
🔴 D-02b — Keep a Testimonials page, or distribute student voices into the pages?

### M2 · Admissions

Public request → review queue in the Teacher Dashboard → the Acharya schedules an **orientation**
(a session with no path attached) → after orientation the Acharya either enrolls the applicant on
a recommended path, waitlists, or declines.

Guru Dakṣiṇā is discussed personally, outside the platform, and never recorded as an amount.

### M3 · Student Portal

The student's home answers, in one screen: *when is my next class, what do I owe, where am I.*

- Next session with a join button and a countdown **in the student's own timezone**
- Outstanding assigned work, with due dates
- Current position — path, stage, items complete
- The Acharya's most recent feedback, including audio
- Recordings available to them
- Their certificates
- Abhyāsa log — where they record their own daily practice

### M4 · Teacher Dashboard

The screen the Acharya opens every morning:

- Today's sessions, in order, with join links
- Submissions awaiting review, oldest first
- Applications awaiting a decision
- Students flagged as needing attention
- Avalokanam results awaiting declaration

⚠️ **ASSUMED** definition of *needs attention*: no session attended in 14 days, **or** two
consecutive assignments not submitted, **or** no submission in 21 days. The Acharya can
dismiss a flag; the system never contacts a student about it automatically.

### M5 · Student Management

A student record holds: name (Latin and Devanagari), preferred name, email, phone, country,
**timezone**, date of birth, guardian link if minor, referral source, prior Sanskrit exposure,
enrollments, and **private Acharya notes invisible to the student**.

Views: all students · by path · by stage · needing attention · paused · alumni.
Bulk CSV import for existing students. CSV export.

### M6 · Scheduling & Zoom

- A **Session Series** defines a recurring slot (e.g. every Tuesday 18:30 IST) and generates
  sessions.
- Every session displays in each viewer's own timezone. **The Acharya's calendar is authoritative
  in IST.**
- Zoom meetings created automatically via **Server-to-Server OAuth**.

⚠️ **ASSUMED** — one recurring Zoom meeting per session series rather than a unique meeting per
session. At 50+ sessions a week, per-session creation risks Zoom rate limits and clutters the
account.

✅ **RESOLVED** — the Acharya holds **Zoom Workplace Pro**. Server-to-Server OAuth, cloud
recording, and participant reports are all available. See doc 10 for the integration design.

🔴 **NEW CONSTRAINT** — Pro includes only **10 GB of cloud recording storage**, which video fills
in roughly one week at 50 sessions/week. Recordings must be offloaded to R2 automatically on the
`recording.completed` webhook and deleted from Zoom cloud, making Zoom a transit buffer rather
than a library. Recommended default: **audio-only for one-to-one, video for group sessions.**
See doc 10 §3.

- Attendance: pulled from Zoom participant reports where possible, always presented to the
  Acharya as **"review and confirm"** — Zoom name matching is unreliable.
- Cancellation and rescheduling notify affected students.

### M7 · Abhyāsa & Assigned Work

Your philosophy lists *Abhyāsa (Practice)* and *Homework* separately, so V1 models **two objects**:

**Abhyāsa Log** — the student's own record of daily practice: date, what was practised, minutes,
optional audio recording. Self-reported, encouraging consistency. The Acharya sees the pattern
but does not grade it.

**Assignment** — work set by the Acharya, with a due date and a submission. Submission types:
typed Devanagari, uploaded handwriting photograph, **audio recitation**, or text answer.

Review carries: written feedback, **audio feedback** (essential for pronunciation), a qualitative
grade, and a resubmission request where needed.

⚠️ **ASSUMED** grading scale — **उत्तमम् / मध्यमम् / साधारणम् / पुनरभ्यासः** (excellent / middling /
fair / practise again). Qualitative, traditional, no numeric marks. Overrule if you use marks.

🔴 **RULING NEEDED** — confirm Abhyāsa and Homework really are two things, not one thing named
twice.

### M8 · Avalokanam

Two kinds, both authored and judged by the Acharya:

- **Continuous** — an ongoing judgment recorded during teaching ("continuous assessments" appears
  in your Sanskrit methodology)
- **Stage Avalokanam** — a formal examination gating progression to the next stage

Components per assessment, mixable: recitation (audio), oral/viva conducted live, written answer,
objective questions.

- Results are **held until the Acharya declares them** — result declaration is an explicit act
- Passing is the **Acharya's decision**, informed by component results, never computed
- Retakes permitted, with the attempt history retained

⚠️ **ASSUMED** — no proctoring, no lockdown, no timers in V1. A Gurukula runs on trust, and
surveillance would contradict the relationship. Overrule if you want timed written papers.

### M9 · Progress Tracking

Per enrollment: current stage, per-item status (not started / in progress / completed /
**mastered**), stage completion history, attendance rate, submission rate, Avalokanam history.

**Mastery is set by the Acharya only.** Nothing marks itself complete.

Student view is encouraging and honest; Acharya view is diagnostic across all students.

### M10 · Certificates

Modelled on your own dīkṣānta certificate — an **āśaṁsanapatram**, a blessing rather than a
transcript.

- Issued on stage or path completion, **always by explicit act of the Acharya**, never automatic
- Carries: student name (Devanagari and Latin), path and stage, the Sanskrit benediction,
  the Acharya's name and title, institution name, seal, signature, a unique certificate ID,
  and **the date in both Gregorian and pañcāṅga form** (saṁvatsara, māsa, pakṣa, tithi, vāra)
- **Public verification** at a permanent URL — `/verify/<id>` — showing validity, holder name,
  what was completed, and the issue date
- Revocable, with the verification page reflecting revocation
- Downloadable PDF, printable at A4

🔴 **RULING NEEDED** — the exact Sanskrit benediction wording, and your title as it should appear.

---

## 5. Sanskrit & script handling

Non-negotiable, and the reason a generic LMS cannot serve this platform:

- **Full Devanagari with vedic accent marks** — udātta, anudātta, svarita — stored as verified
  Unicode. Never round-tripped through a format that corrupts conjuncts.
- **IAST diacritics** throughout the Latin text.
- **Transliteration input** for students without a Devanagari keyboard: type `namaste` → नमस्ते.
- Devanagari typography: line-height ≈ 1.8–2.0, a font with genuine vedic accent support
  (Murty Sanskrit or Shobhika), subsetted and preloaded so it never causes layout shift.
- **Śloka display** supporting pāda breaks, padaccheda, and layered translation — required by
  Gītā Stages III–IV.
- **Audio** with slow-playback without pitch change and A–B looping, for recitation practice.

---

## 6. Notifications

⚠️ **ASSUMED** — **email only in V1.** WhatsApp Business API carries per-message cost, template
approval, and a Meta business verification process; it is a V2 decision, not a launch dependency.

Events: session reminder (24h and 1h) · session cancelled or rescheduled · assignment set ·
work reviewed · Avalokanam declared · certificate issued · (to the Acharya) new application,
new submission, daily digest.

🔴 **RULING NEEDED** — K1: is email actually sufficient, or do your students genuinely live on
WhatsApp? If the latter, it changes the cost model and needs planning now.

---

## 7. Non-functional requirements

| Concern | Requirement |
|---|---|
| Scale | Design for 150 students, ~4,000 sessions/year, ~20,000 submissions |
| Performance | LCP < 1.5s on 4G · CLS ≈ 0 · < 100KB JS on public pages |
| Availability | Best-effort; a session must never fail because the platform is down — Zoom links remain valid independently |
| Backups | Nightly database backup, 30-day retention. Uploaded audio and images are the irreplaceable asset |
| Data loss tolerance | ≤ 24 hours |
| Privacy | India DPDP Act and GDPR (EU students). Data minimisation; explicit consent for recordings |
| Minors | Guardian consent recorded at enrollment |
| Accessibility | WCAG 2.1 AA target; must work on low-end Android over 3G |
| Mobile | No app, but the portal must be fully usable on a phone — ⚠️ **ASSUMED** a majority of students are phone-first |
| Audit | Every grade change, certificate issue, and revocation logged immutably |

---

## 8. Explicitly out of scope for V1

Payment gateway · shopping cart · marketplace · community or forum · mobile app · AI chatbot ·
multi-teacher support · live in-browser video (Zoom does this) · automated grading of anything
requiring judgment · public student directory · gamification, streaks, badges, or leaderboards.

*Gamification is called out deliberately: it is the default of modern education software and it
would actively corrupt the Guru–Śiṣya relationship by substituting extrinsic reward for
discipline.*

---

## 9. Consolidated open rulings

| # | Ruling needed | Blocks |
|---|---|---|
| 1 | Real student ceiling; which stages are taught in groups | Roadmap, your calendar |
| 2 | ~~Zoom plan~~ ✅ **RESOLVED — Workplace Pro.** New sub-ruling: record one-to-one sessions at all? And the approach to handwriting given Zoom's 3-whiteboard limit (doc 10) | M6 |
| 3 | Section 2, R1–R8 — roles, minors, parent visibility | M3, M5 |
| 4 | Advaita Vedānta curriculum | M1, M9 |
| 5 | Stotras & Sūktas — separate path or Yajurveda I–III? | M1, M9 |
| 6 | Abhyāsa and Homework — two objects or one? | M7 |
| 7 | Grading scale — the proposed Sanskrit qualitative scale, or marks? | M7, M8 |
| 8 | Certificate benediction wording and your title | M10 |
| 9 | Email sufficient, or is WhatsApp required? | M6 notifications |
| 10 | D-02a nav / D-02b testimonials | M1 |
| 11 | Verified Devanagari for all stage names and text titles | Everything displayed |
| 12 | Legal name vs public name (Mayachara / M) | M10, legal pages |
| 13 | Should the platform record Dakṣiṇā status (paid/pending/waived) as private bookkeeping, with no amounts and no gateway? Recommend **no** for V1 — but you may need it | M5 |
| 14 | Budget ceiling and target launch date | Roadmap |
