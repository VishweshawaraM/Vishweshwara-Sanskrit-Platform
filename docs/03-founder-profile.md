# Founder Profile — source content from the Acharya

Supplied verbatim by the Acharya. This is the raw source for the About page and for the
institution's self-description across the site, structured data, and `llms.txt`.

---

## As supplied

**Name:** Vishweshwara M
**Role:** Founder, Vishweshwara Sanskrit
**Profession:** Sanskrit Teacher and Vedic Educator

### About

> My name is Vishweshwara M. I am a traditional Sanskrit and Vedic teacher dedicated to
> preserving and teaching Sanskrit, Krishna Yajurveda, Bhagavad Gita, and Advaita Vedanta
> through the Guru–Shishya tradition.
>
> I founded Vishweshwara Sanskrit with the vision of creating an authentic Digital Gurukula
> where students receive personal guidance, structured learning, and disciplined practice.
>
> I teach students from India and around the world through live online classes.

### Mission

> To preserve the Guru–Shishya Parampara by combining traditional teaching with modern
> technology while maintaining authenticity, discipline, and personal guidance.

### Teaching philosophy

> Knowledge is sacred. Students do not simply watch videos. They learn directly from an
> Acharya through: Live Classes · Abhyāsa (Practice) · Homework · Pronunciation Correction ·
> Avalokanam (Assessment) · Personal Guidance · Structured Progress.
> Every student follows a defined learning path and receives continuous feedback.

### Subjects

1. Sanskrit
2. Krishna Yajurveda
3. Bhagavad Gita
4. Advaita Vedanta
5. Stotras and Suktas

### Platform vision

> Vishweshwara Sanskrit is a Digital Gurukula. It is not a coaching institute or a
> course-selling platform. It is built to provide authentic Sanskrit and Vedic education
> through modern technology while preserving traditional values.

---

## Architectural consequences

### C-01 — The subject list has grown from three to five

Section 1 (V1) named Sanskrit, Bhagavad Gītā, and Krishna Yajurveda. **Advaita Vedanta** and
**Stotras and Sūktas** are new. These are not variations on one template — they have
structurally different shapes:

| Subject | Shape | Primary demand on the platform |
|---|---|---|
| Sanskrit | Graded language acquisition | Grammar drills, written Abhyāsa, Devanagari input |
| Krishna Yajurveda | Recitation lineage | Vedic accents, audio, pronunciation correction, pāṭha levels |
| Bhagavad Gītā | Text study, verse by verse | Verse display, translation layers, progress against the text |
| Advaita Vedanta | Prakaraṇa granthas + commentary | Sequential text study, conceptual assessment |
| Stotras & Sūktas | Recitation-first, often standalone | Audio-heavy, shorter cycles, possibly non-graded |

**Learning Paths must hold five differently-shaped subject areas, not one template repeated
five times.** Carried into Section 5 (Course Structure).

### C-02 — Homework and Abhyāsa are listed as separate items

The Acharya's philosophy list reads "Abhyāsa (Practice)" **and** "Homework" as distinct entries.
Earlier scope treated Abhyāsa *as* homework. Needs clarification in Section 5 or 6 — is daily
self-practice (abhyāsa) tracked separately from assigned work (homework)? If so they are two
different objects in the data model, not one.

### C-03 — The profile is positioning, not yet evidence

Per D-04, **paramparā and training is the highest-weighted trust signal on the site.** The
supplied profile asserts "traditional Sanskrit and Vedic teacher" but contains no verifiable
specifics. The audiences that most need those specifics are precisely the ranked top two from
V4: parents entrusting a child, and international students with no community through which to
verify the Acharya independently.

**Requested from the Acharya — facts only, no marketing:**

1. **Guru(s)** — under whom he studied, and their guru if known. This *is* the paramparā.
2. **Place and duration** — which pāṭhaśālā / gurukula / institution, and for how many years.
3. **Qualifications and titles** — Vidwan, Śāstrī, Ācārya, degrees, examinations passed.
4. **Śākhā of Krishna Yajurveda** (Taittirīya?) and **level of recitation attained** —
   saṁhitā, pada, krama, jaṭā, ghana. *The single most authoritative fact available to
   publish: legible instantly to anyone inside the tradition, and unclaimable by anyone
   who has not done the work.*
5. **Advaita sampradāya** — lineage, and which texts studied formally.
6. **Years teaching, and approximate number of students taught to date.**
7. Anything public — recitations performed, temple or maṭha association, publications,
   recognition.

**Standing rule: no lineage, title, or credential will be invented or inferred.** These pages
carry only what the Acharya supplies.

---

## Still open

- **D-02a** — Admissions as a sixth nav item, or CTA as a persistent button outside the nav?
- **D-02b** — Keep Testimonials, or distribute student voices into the pages?
- **C-02** — Abhyāsa vs. Homework: one concept or two?
- **C-03** — the seven evidence items above.
- **Section 2 (User Roles)** — R1–R8 unanswered; the Student Portal cannot proceed.
- **V6** — the 75–100 active-student target still needs confirming as the Acharya's own figure.
- **Existing site content** — `vishweshwarasanskrit.com` blocked by network egress policy.
