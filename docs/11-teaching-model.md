# Teaching Model & Capacity — RULED

**Status:** ✅ Critical-path item 4 **CLOSED** by the Acharya's ruling.

---

## 1. The ruling as given

**Capacity:** 80–100 active students. Quality over quantity. Single Acharya in V1;
more teachers possible in future versions but out of scope.

**Formats in use:** one-to-one · small group (3–8) · occasional larger introductory or
orientation sessions. *The format depends on the subject and the student's level.*

| Path | Format |
|---|---|
| Orientation | Group or individual |
| Sanskrit (beginner) | **Small group preferred**; 1:1 available if needed |
| Bhagavad Gītā | Small group **or** 1:1 |
| Krishna Yajurveda | **Mostly 1:1 or very small groups** — pronunciation and recitation require close attention |

**Invariant, regardless of format:**
- **Avalokanam is always individual**, even for students taught in a group.
- **Abhyāsa and feedback are always individual.**
- **Progress is always individual mastery.** Attending classes does not advance a student;
  understanding, pronunciation, practice, and Avalokanam do.

---

## 2. The schema needs no changes

The model in doc 07 already expresses this exactly:

- `session` + `session_participant` — one participant is 1:1, three to eight is a small group,
  a large orientation is the same object with more rows. No special cases.
- `study_group` — an optional convenience for scheduling, holding 3–8 students. It carries **no
  progress and no assessment**, which is precisely right: the Acharya's ruling makes the group a
  *scheduling* construct, never a pedagogical one.
- `enrollment` + `item_progress` — progress hangs off the individual student, never the group.
- `avalokanam` — keyed to `enrollment_id`, so it is individual by construction.
- `assignment_target` — can target a group for convenience, but `submission` and `review` are
  always per student.

**This was the right call.** Had we modelled cohorts, group teaching would have dragged shared
progress along with it, and the Acharya's central principle — individual mastery — would have had
to be bolted back on.

### One cheap change recommended

The Acharya explicitly anticipates additional teachers later. Add a nullable
`taught_by_person_id` to `session` and `session_series` **now**, defaulting to the Acharya.
It costs nothing today, and it avoids a migration that would otherwise touch every historical
session row. V1 still supports exactly one teacher — nothing in the UI exposes it.

---

## 3. Capacity arithmetic — the real constraint

With the hybrid model, 80–100 students becomes achievable. But it is **not** achievable at any
mix. The binding variable is the proportion taught one-to-one.

Assumptions: 90 active students · one session per student per week · 60-minute blocks
(50 teaching, 10 turnaround) · average small group of 6.

| Share taught 1:1 | 1:1 sessions/wk | Group sessions/wk | Total sessions | Teaching hrs/wk |
|---|---|---|---|---|
| 20% (18 students) | 18 | 12 | 30 | **30** |
| 30% (27) | 27 | 10.5 | 37.5 | **37.5** |
| 40% (36) | 36 | 9 | 45 | **45** |
| 50% (45) | 45 | 7.5 | 52.5 | **52.5** |

Add the work that does not appear on a calendar:

- **Review:** 90 individual Abhyāsa submissions per week × ~5 minutes with audio feedback ≈
  **7.5 hrs/wk**
- **Avalokanam, preparation, admissions, correspondence:** ≈ **5 hrs/wk**

| Share taught 1:1 | Total working hours/week |
|---|---|
| 20% | ~43 |
| 30% | ~50 |
| 40% | ~58 |
| **50%** | **~65 — not sustainable** |

### The planning number

> **At 90 active students, one-to-one teaching must stay at or below roughly 30–35% of the
> student body.** Beyond that the week stops closing.

Since Krishna Yajurveda is the path that genuinely requires 1:1, **Yajurveda enrollment is the
governing constraint on total capacity** — approximately **25–30 Yajurveda students** alongside
60–65 group-taught students in Sanskrit and Gītā.

This is not a reason to change the model. It is a number to plan admissions against, and it
argues for keeping Sanskrit beginner and Gītā firmly in small groups so that Yajurveda can stay
one-to-one where it must be.

### Timezone feasibility

37 sessions a week across India, Europe, the US, and Australia is workable — roughly 6–7 sessions
a day across a long but humane teaching window — provided students are grouped by region so that
one small group does not straddle three continents. **Study groups should be formed by timezone
band first, level second.** That constraint should be visible when the Acharya forms a group.

---

## 4. A feature this ruling demands: the load guard

The Acharya's stated first principle is quality over quantity. The most common way that principle
fails is not a bad decision — it is an accumulation of individually reasonable ones. Each new
student seems affordable; the twelfth 1:1 enrollment is the one that breaks the week, and it does
not announce itself.

**Proposed for the Teacher Dashboard:**

- Current weekly teaching load in hours, and the count of scheduled sessions
- Split between one-to-one and group students, against the ~30–35% guideline
- Projected review load from active enrollments
- A visible warning **before** confirming an enrollment that would push the week past a threshold
  the Acharya sets himself

It advises; it never blocks. Consistent with the platform's binding principle — the system
surfaces, the Acharya decides.

*This is the rare feature where software genuinely protects the tradition: it makes the cost of
over-enrolling visible at the moment of the decision, rather than three months later in the
quality of teaching.*

---

## 5. Consequences for the roadmap

- **The review queue is confirmed as the single most important screen in the system.**
  Ninety individual reviews a week, each with audio feedback. A five-minute review is 7.5 hours
  weekly; a seven-minute review is 10.5. Two minutes of interface friction costs the Acharya
  three hours a week, every week. This screen justifies disproportionate design effort.
- **Group management enters Phase 2** — forming groups, timezone-banded, 3–8 students, attached
  to a session series. Small, but no longer deferrable.
- **Recording defaults differ by format:** audio-only for 1:1 (doc 10 §3), video for group
  sessions where handwriting is shared.
- Admissions review should show current load at the moment of the accept decision.

---

## 6. The Acharya's writing — received

Supplied: *Why I Teach* · *The Guru–Shishya Tradition* · *My Teaching Method* ·
*About the Paramparā*. This is the core of the About and Digital Gurukula pages and it is
usable as written — clear, unembellished, and consistent with everything else in the record.

The Acharya has noted that the guru's name, Gurukula details, and lineage will be added later,
**after verifying the exact wording.** That is the correct instinct and the standing rule holds:
nothing about lineage is published until he supplies it verbatim.

Pages can be built now with the lineage section deliberately empty, and filled without rework.

---

## Updated critical path

| # | Item | Status |
|---|---|---|
| 1 | Zoom plan | ✅ Workplace Pro |
| 2 | The Acharya's writing | ✅ **Received** — lineage paragraph pending verification |
| 3 | **Verified Devanagari** — 1 of ~21 terms confirmed (वाक्यनिर्माणम्) | 🔴 **Now the top blocker** |
| 4 | Teaching model and capacity | ✅ **Ruled** — this document |
| 5 | Existing website content | 🔴 Blocked by network egress policy |
| 6 | Advaita Vedānta and Stotra curricula | 🔴 Open |
| 7 | **Repository write access** | 🔴 **Blocks all code** — see below |

### 🔴 Repository write access now blocks everything

Ten commits of documentation sit in an ephemeral container that cannot push
(`403` on `git-receive-pack`; the GitHub API returns *Resource not accessible by integration*).

Writing code into a container that cannot persist it would waste the work. **Write access to
`VishweshawaraM/Vishweshwara-Sanskrit-Platform` must be granted before Phase 0 begins.**
