# Information Architecture — Vishweshwara Sanskrit V1

**Version:** 0.1 DRAFT

Two distinct surfaces sharing one design language:
**the public site** (static, indexable, no login) and **the application** (authenticated).

---

## Part 1 — Public site

### URL map

```
/                                Home
/about                           The Acharya — lineage, training, credentials
/paths                           Learning Paths — overview of all five
/paths/sanskrit                  Sanskrit — 6 stages
/paths/bhagavad-gita             Bhagavad Gītā — 5 stages
/paths/krishna-yajurveda         Krishna Yajurveda — 5 stages
/paths/advaita-vedanta           Advaita Vedānta
/paths/stotras-and-suktas        Stotras & Sūktas
/gurukula                        Digital Gurukula — how learning actually works
/writings                        The knowledge archive — index
/writings/<slug>                 An individual writing
/texts/<text-slug>               Writings grouped by text (Gītā, Rudram, …)
/admissions                      Who this is for, the process, and the request form
/admissions/request              The orientation request form
/admissions/thank-you            Confirmation
/verify                          Certificate verification — enter an ID
/verify/<certificate-id>         A specific certificate — PERMANENT, must never break
/contact                         Contact
/terms  /privacy                 Legal
/sitemap.xml  /robots.txt  /llms.txt
```

### Navigation

Primary, per the Acharya's ruling — English labels, Sanskrit taught inside the pages:

`Home · About · Learning Paths · Digital Gurukula · Testimonials · Contact`

🔴 **D-02a** — Admissions has no nav home. Recommended: a persistent **Request an Orientation**
button sitting outside the nav, so the nav stays at six and the CTA is always visible.
🔴 **D-02b** — Testimonials as a top-level item reads coaching-institute. Recommended:
rename **Student Voices**, or distribute into About and Digital Gurukula.

Footer: Writings · Verify a Certificate · Admissions · Contact · Terms · Privacy.

### Page structures

**Home** — the institution in one screen, then depth below.
Statement of what this is → the Acharya, with photograph and the seven-year lineage in one
sentence → the five paths → how learning works, briefly → one or two student voices →
a single quiet CTA. No carousel, no counters, no logos-of-companies strip.

**About** — the highest-trust page. A *lineage document, not a bio*.
Who he is → the seven years at Veda Vijnana Gurukulam → the dīkṣānta, with the certificate
shown → academic qualifications as a plain table → what he teaches and why → the paramparā he
stands in. Facts, dated, checkable. `Person` structured data.

**A Learning Path page** — the strongest conversion asset, because it is honest about difficulty.
Philosophy → the staged journey as a table → each stage expanded with its syllabus → duration
where known → methodology → "why this is different" → what a student can do at the end →
who this path is *not* for → request orientation. Mirrors the structure of the Acharya's own
curriculum documents. `Course` structured data.

**Digital Gurukula** — the method: the teaching cycle, what a session is actually like, Abhyāsa,
pronunciation correction, Avalokanam, progression, certification. This page does the qualifying:
a reader should finish it knowing this is demanding.

**Writings** — organised **by text first**, then chronologically. Text pages (`/texts/bhagavad-gita`)
accumulate every writing touching that text, becoming the durable, citable asset.

**Admissions** — who this is for, who it is not for, the process end to end (request → orientation
→ recommendation → enrollment), what is expected of a student, then the form. **No fees.**
`FAQPage` structured data.

**Verify** — deliberately plain and fast. Valid: holder name, path and stage completed, issue
date in both calendars, issuing institution. Invalid or revoked: said plainly. No login, no
tracking, permanent.

### Structured data

`EducationalOrganization` (site-wide) · `Person` (About) · `Course` (each path) ·
`FAQPage` (Admissions) · `Article` (each writing) · `BreadcrumbList`.
Plus `/llms.txt` — a factual description of the institution, the Acharya's verifiable
credentials, the five paths, and how admission works.

---

## Part 2 — The application

```
/portal                          Student home
/portal/sessions                 Upcoming and past sessions
/portal/sessions/<id>            One session — join, notes, recording
/portal/work                     Assigned work — outstanding and completed
/portal/work/<id>                One assignment — brief, submit, feedback
/portal/abhyasa                  Daily practice log
/portal/progress                 Position in each enrolled path
/portal/avalokanam               Assessments and declared results
/portal/avalokanam/<id>          One assessment
/portal/certificates             Certificates earned
/portal/profile                  Profile, timezone, notification preferences

/parent                          Parent home — children summary
/parent/<student-id>             One child: attendance, progress, results, certificates

/acharya                         Teacher dashboard — the morning screen
/acharya/schedule                Calendar; series management
/acharya/sessions/<id>           Run a session — attendance, notes, assign work
/acharya/students                Student list and filters
/acharya/students/<id>           One student — full record, private notes, history
/acharya/review                  Submission review queue — the highest-traffic screen
/acharya/review/<id>             Review one submission
/acharya/assignments             Assignments set
/acharya/avalokanam              Assessments — author, record, declare
/acharya/applications            Admission requests
/acharya/certificates            Issue, view, revoke
/acharya/curriculum              Paths, stages, syllabus items
/acharya/settings                Institution settings, Zoom connection, templates
```

### The two screens that matter most

**`/acharya` — the morning screen.** Today's sessions in order with join links · submissions
awaiting review, oldest first, with a count · applications awaiting decision · students flagged
as needing attention · results awaiting declaration. Nothing else. If a screen earns being opened
every day, it must not be a dashboard of charts.

**`/acharya/review` — the review queue.** Where the Acharya will spend most of their time. Must
be keyboard-driven, one submission at a time, with audio playback and audio recording in place,
and a next-without-leaving flow. At 100 students this screen is the difference between a
sustainable practice and an unsustainable one.

**`/portal` — the student home.** Answers three questions above the fold: when is my next class
(in *my* timezone), what do I owe, where am I. Everything else is below.

---

## Part 3 — Permanence

Certificate verification URLs are **permanent addresses**. A link issued in 2026 may be checked
by a registrar in 2045. `/verify/<id>` must survive every redesign, migration, and framework
change. This constrains routing before implementation begins, and the certificate ID must be
opaque, non-sequential, and never reused.

Writings URLs are likewise permanent — the archive's value is cumulative and depends on
citations not rotting.
