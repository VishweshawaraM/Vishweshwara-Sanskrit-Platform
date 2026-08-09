# Section 1 — Vision & Business (ANSWERED)

## Standing instruction from the Acharya

> Do not optimize for generic software industry practices. Where answers reflect the
> traditional Gurukula system, preserve that philosophy instead of replacing it with modern
> education patterns. Where something could be improved, explain the reasoning and **ask
> before changing the concept.**

This governs every decision in this project. Concretely:
- Guru Dakṣiṇā is a conversation, not a checkout flow.
- Avalokanam is an examination by the Acharya, not an auto-graded quiz engine.
- Automation may *inform* the Acharya's judgment; it never replaces it.
- Any proposed departure from tradition must be raised as a question, not implemented silently.

---

## V1 — What it is

A **Digital Gurukula** teaching **Sanskrit, Bhagavad Gītā, and Krishna Yajurveda** through the
traditional **Guru–Śiṣya Paramparā**, using modern technology. Authentic teaching plus structured
digital tools, preserving the spirit of a Gurukula.

## V2 — Why it exists

Online Sanskrit learning today is recorded video, rote memorization, and exam-orientation.
This platform exists for **authentic guided learning**: personal attention, pronunciation
correction, regular practice, and continuous guidance from an Acharya.

## V3 — The methodology (the core the platform must encode)

- Every student learns **directly from the Acharya in live sessions**. Not video-watching.
- The cycle is: **practice → pronunciation correction → Abhyāsa → Avalokanam → personal
  feedback → step-by-step progression** through a structured curriculum.
- **The teacher–student relationship is central to the learning process.**

**Architectural consequence:** the live session is the centre of the system, not a feature
attached to a content library. Recordings are support material, never the product.

## V4 — Audience (ranked)

1. Serious students who genuinely want to learn
2. Parents seeking authentic Sanskrit education for their children
3. Working professionals interested in Sanātana knowledge
4. International students

**Explicitly not ideal:** certificate-seekers; students expecting instant or self-paced
learning; students unwilling to practise regularly.

**Consequence:** the platform must *filter* for seriousness, not maximise signups.
Admission is selective by design.

## V5 — "Premium" defined (ranked)

1. High-touch personal guidance
2. Institutionally serious and authentic
3. Visually refined
4. Exclusive — limited intake to protect quality
5. High price is **not** the goal; value comes first

## V6 — Success at 12 months

A stable Digital Gurukula: **75–100 active students across multiple countries**, a smooth
teaching workflow, high retention, strong testimonials.

> ⚠️ OPEN: the 75–100 figure arrived as a suggested draft. Needs the Acharya's confirmation —
> it sets the scale target for the whole architecture.

## V7 — How money works (no gateway in V1)

1. Student attends an **orientation**
2. Acharya understands their goals and **recommends a learning path**
3. **Guru Dakṣiṇā** is discussed personally — varies by course, commitment, and circumstance
4. Payment is handled **manually, entirely outside the platform**
5. The platform manages **enrollment and learning only**

**Consequence:** "Orientation" is a real, first-class step in the student journey, not a
marketing term. Dakṣiṇā amounts are personal and must not be exposed as a price list.

## V8 — Ambition

Begin as a **boutique Digital Gurukula** built on quality and personal guidance. Design well
enough that it can **grow into a respected institution without rebuilding**.

**Accepted tension (named, not resolved by force):** boutique reality vs. institutional future.
Approach — build for the boutique truth today (some things stay deliberately manual because the
Acharya's judgment belongs there), while keeping data model and boundaries clean enough that
scale does not require a rewrite. Cost of this choice: we will not pre-build automation that
would dilute the Guru–Śiṣya relationship, even where it would scale better.

---

## Carried forward into later sections

- **Krishna Yajurveda** implies **vedic accent marks (svara)** — a hard constraint on fonts,
  encoding, and audio. Resolve in Course Structure + Technical Architecture.
- **Orientation** is a journey step — resolve in Student Journey.
- **Parents: minors only, optional, never mandatory.** Adults have no parent linkage.
- V1 module list is now **nine**: Public Website, Student Portal, Teacher Dashboard,
  Student Management, Zoom, Abhyāsa, Avalokanam, **Progress Tracking**, Certificates.
