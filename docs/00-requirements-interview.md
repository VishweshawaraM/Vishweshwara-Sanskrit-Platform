# Vishweshwara Sanskrit — Requirements Interview (Round 1)

**Status:** Open — awaiting answers
**Purpose:** Capture every decision needed before a single line of code is written.
**Scope lock (V1):** Public Website · Student Portal · Teacher Dashboard (single teacher) ·
Student Management · Zoom Integration · Abhyāsa (Homework) · Avalokanam (Assessment) · Certificates.
**Explicitly excluded from V1:** payments, cart, marketplace, community, mobile app, AI chatbot, multi-teacher.

How to answer: reply with the question number and your answer. Short answers are fine.
"Don't know yet" is a valid answer — it becomes a tracked open question, not a silent assumption.

---

## Legend

- 🔴 **BLOCKING** — the data model or architecture cannot be drawn until this is answered.
- 🟡 **SHAPING** — changes screens/workflows, but work can start around it.
- 🟢 **DEFERRABLE** — can be answered during build.

---

## A. The Teaching System Itself (most important section)

The platform must model *your* Gurukula, not a generic LMS. These questions define the core domain.

- **A1** 🔴 Describe one complete student journey end to end, in your own words: first contact →
  enrolled → studying → assessed → certified → what next? Narrative, not bullet points.
- **A2** 🔴 What is the top-level unit a student joins? A *course*, a *batch/cohort*, a *level*,
  a *paramparā track*, or something else? What do you actually call it?
- **A3** 🔴 What is the hierarchy below that unit? (e.g. Track → Level → Module → Session/Class?)
  Give the real names, in Sanskrit and English.
- **A4** 🔴 Is teaching **cohort-based** (fixed batch, fixed calendar, everyone moves together),
  **self-paced**, or **hybrid**?
- **A5** 🔴 Can one student be enrolled in more than one unit at the same time?
- **A6** 🟡 Is there a fixed syllabus per level, or does the syllabus evolve as you teach?
- **A7** 🟡 What are the actual levels/courses you will run in V1? Name them. How many students each?
- **A8** 🟡 Is there a prerequisite chain (must finish Level 1 to enter Level 2)? Enforced by the
  system, or by your judgment?
- **A9** 🔴 What does "completion" of a level mean? Attendance threshold? Assessment pass?
  Your personal approval? A combination?
- **A10** 🟡 Are there texts/granthas being studied (e.g. specific ślokas, sūtras, chapters)?
  Should the platform track progress *against the text* (e.g. "we are at Sūtra 1.2.14")?
- **A11** 🟡 Is there anything ritual/traditional the software must respect —
  auspicious start dates, guru-śiṣya protocol, ārambha/samāpana ceremonies, pañcāṅga awareness?
- **A12** 🟢 Do you use a Sanskrit vocabulary for platform actions (Abhyāsa, Avalokanam already)?
  Give me the full glossary you want used in the UI.

---

## B. Users, Roles, Access

- **B1** 🔴 Confirm the complete role list for V1. Is it exactly: Teacher (you) + Student?
  Or is there also an **Admin/Assistant** who does data entry, and a **Parent/Guardian**?
- **B2** 🔴 Are any students minors? If yes, does a parent need their own login, or only email copies?
- **B3** 🔴 How do students get accounts? (a) You create them manually, (b) they self-register and
  you approve, (c) invite link/code, (d) open self-registration.
- **B4** 🔴 Login method: email + password, magic link (passwordless email), Google sign-in,
  phone/OTP, or a combination? (Phone/OTP matters a lot if students are in India.)
- **B5** 🟡 Can a student ever be **suspended / paused / on leave** rather than removed?
  Do they keep portal access while paused?
- **B6** 🟡 What happens to a graduated student's access — permanent read-only access to their
  materials and certificate, or access ends?
- **B7** 🟢 Do you need to log in "as" a student to see what they see (impersonation for support)?

---

## C. Student Management (Teacher-side)

- **C1** 🔴 What fields do you need on a student record? Please list everything you actually care
  about: legal name, name in Devanagari, preferred name, gotra/sampradāya, country, timezone,
  age, occupation, prior Sanskrit exposure, referral source, notes?
- **C2** 🔴 Do you need **private teacher notes** on a student that the student can never see?
- **C3** 🟡 Do you need to record **attendance** per class? Manually marked by you, auto-pulled
  from Zoom, or both with your override?
- **C4** 🟡 What is the *one screen* you want to open every morning? What must it show?
- **C5** 🟡 What student list views/filters matter? (by level, by batch, by at-risk, by pending
  homework, by attendance %?)
- **C6** 🟡 Define "at-risk"/"needs attention" in your terms. Missed N classes? No homework in
  N weeks? This becomes an automatic flag.
- **C7** 🟢 Do you need bulk import of existing students (CSV/Excel from your current records)?
  How many existing students do you need migrated on day one?
- **C8** 🟢 Do you need export (CSV/PDF) of student data or reports? For what purpose?

---

## D. Enrollment Lifecycle (no payments in V1 — so how?)

- **D1** 🔴 With no payment gateway, how does someone actually become a student? Application form
  → your review → approval? Or you enroll them directly after an offline conversation?
- **D2** 🔴 Do you want an **application/admission form** on the public site, with a review queue
  in your dashboard (accept / reject / waitlist)?
- **D3** 🟡 If fees exist but are collected offline (UPI/bank transfer), do you want to *record*
  payment status manually (paid / pending / waived / scholarship) without any gateway?
  This is bookkeeping, not a payment integration — confirm whether you want it.
- **D4** 🟡 Is there an **interview / trial class** step before admission?
- **D5** 🟡 Is there a cap on batch size? Waitlist behavior when full?
- **D6** 🟢 Do you need an enrollment/admission letter or welcome email generated automatically?

---

## E. Scheduling & Zoom Integration

- **E1** 🔴 Are classes **recurring on a fixed weekly schedule**, or scheduled ad hoc?
- **E2** 🔴 Which Zoom account type do you have — Free, Pro, Business? (Determines whether the
  Server-to-Server OAuth app and cloud recording APIs are available.)
- **E3** 🔴 Should the platform **create** Zoom meetings automatically when you schedule a class,
  or will you paste in a link you created manually in Zoom?
- **E4** 🔴 One **recurring meeting link per batch**, or a **unique meeting per session**?
- **E5** 🔴 Timezones: where are your students? Must every student see times in their own timezone?
  What is your home timezone (IST?)?
- **E6** 🟡 Do you record classes? If yes: where do recordings live (Zoom cloud, Google Drive,
  YouTube unlisted, self-hosted)? Who can watch, and for how long?
- **E7** 🟡 Should absent students automatically get recording access, or all students always?
- **E8** 🟡 Do you want automatic attendance from Zoom participant reports? Note: Zoom name
  matching is unreliable — are you OK with a "review and confirm" step?
- **E9** 🟡 Class reminders: how far in advance, via what channel (email, WhatsApp, SMS, in-portal)?
- **E10** 🟡 How do you handle a **cancelled or rescheduled** class? Who gets told, how?
- **E11** 🟢 Do you need a makeup-class concept?
- **E12** 🟢 Do you hold **1:1 sessions** in addition to group classes? Do students book slots,
  or do you assign them?

---

## F. Abhyāsa (Homework)

- **F1** 🔴 What form does homework take? Written answers, recitation audio, video of chanting,
  uploaded photo of handwritten Devanagari, typed Devanagari, multiple choice, or several of these?
- **F2** 🔴 Is homework assigned **per class session**, **per week**, or **per module**?
- **F3** 🔴 Is homework assigned to the **whole batch** or can it be **per individual student**?
- **F4** 🔴 Are there due dates? What happens after the due date — hard lock, late submission
  allowed and flagged, or no enforcement?
- **F5** 🟡 Can a student resubmit after your feedback? Unlimited revisions or capped?
- **F6** 🔴 How do you grade? Marks out of N, a letter/grade band, a Sanskrit qualitative scale
  (e.g. उत्तम / मध्यम / साधारण), pass-fail, or only written feedback with no score?
- **F7** 🟡 Do you want to give **audio feedback** (record your voice correcting pronunciation)?
  This is very common in recitation teaching and affects storage design.
- **F8** 🟡 Do you want to annotate a student's uploaded file (mark up their Devanagari writing)?
- **F9** 🟡 Should students see each other's submissions? (Default no — confirm.)
- **F10** 🟡 What is your realistic grading volume — how many submissions per week? This determines
  whether grading needs a fast keyboard-driven queue.
- **F11** 🟢 Max file size and file types for uploads? Any student on slow/mobile connections?

---

## G. Avalokanam (Assessment)

- **G1** 🔴 How is Avalokanam different from Abhyāsa in *your* system? Formal exam vs. daily
  practice? Periodic review? Oral examination? Define it precisely.
- **G2** 🔴 What is the format? Written test, oral/viva over Zoom, recitation test, or a
  combination of components?
- **G3** 🔴 Is it **timed**? Does it need a proctored/locked-down window, or is trust assumed?
- **G4** 🔴 Who authors the questions — only you, in advance? Is there a reusable question bank?
- **G5** 🟡 Question types needed: MCQ, short answer, long answer, audio recitation upload,
  sandhi/vigraha exercises, translation, fill-in-the-blank with Devanagari?
- **G6** 🟡 Auto-graded questions (MCQ) vs. manually graded — do you want both?
- **G7** 🔴 What is the pass criterion, and who decides — the score, or your final judgment?
- **G8** 🟡 How often does Avalokanam happen? End of level only, monthly, quarterly?
- **G9** 🟡 Can a student **retake** a failed Avalokanam? How many attempts? Waiting period?
- **G10** 🟡 Does the student see the correct answers / model answers after submitting?
- **G11** 🟡 Is there a **result declaration** moment (results hidden until you publish them)?
- **G12** 🟢 Do you need a grade sheet / marksheet document separate from the certificate?

---

## H. Certificates

- **H1** 🔴 What certificates exist? Completion, merit/distinction, participation, level-wise?
- **H2** 🔴 Who triggers issuance — automatic on passing, or always your manual approval?
- **H3** 🔴 What appears on the certificate? Exact wording, student name (Devanagari or Latin or
  both?), level name, dates, marks/grade, your name and title, institution name, seal, signature.
- **H4** 🔴 Do you already have a certificate **design**, or does it need to be designed?
  Do you have the logo, seal, and signature as image files?
- **H5** 🔴 Do you need **public verification** — a unique certificate ID and a public URL
  (`/verify/<id>`) so an employer or university can confirm authenticity? (Strongly recommended
  for institutional credibility — confirm yes/no.)
- **H6** 🟡 Output format: downloadable PDF, printable, shareable image, LinkedIn-friendly?
- **H7** 🟡 Can a certificate be **revoked** or reissued (name correction)? Should the verification
  page show revocation?
- **H8** 🟢 Bilingual certificate (Sanskrit + English) on one sheet or two versions?
- **H9** 🟢 Do you need a signed register/ledger of all certificates issued, for your records?

---

## I. Public Website

- **I1** 🔴 What is the single primary action a first-time visitor should take? Apply? Enquire?
  Read? Book a trial? There can only be one primary.
- **I2** 🔴 List the pages you want in V1. (e.g. Home, About the Guru, Paramparā/Lineage, Courses,
  Method of Teaching, Admissions, Testimonials, Blog/Writings, Contact.)
- **I3** 🔴 Who is the audience — Indian students, global diaspora, Western academics, children,
  working professionals, sannyāsīs/practitioners? Rank them.
- **I4** 🔴 Language of the public site: English only, English + Sanskrit, English + Hindi,
  full multilingual? Is Devanagari used decoratively or as real content?
- **I5** 🟡 Do you have brand assets — logo, colors, typography, photographs of yourself?
  Or does brand identity need to be created?
- **I6** 🟡 Do you want a **blog / writings** section that you author yourself? How often will you
  post? Does it need a rich editor with Devanagari support?
- **I7** 🟡 Do you need a CMS so you can edit page text yourself without me, or is content
  hard-coded and changed by a developer?
- **I8** 🟡 SEO: what should someone Google to find you? Any existing domain, existing site,
  existing traffic to preserve? Do you own the domain already? What is it?
- **I9** 🟡 Testimonials, student stories, photos — do you have consent to publish student names
  and images?
- **I10** 🟢 Analytics: do you want visitor analytics? Privacy-respecting (Plausible/Umami) or
  Google Analytics?
- **I11** 🟢 Newsletter/email capture on the public site — yes or no? Which provider?

---

## J. Sanskrit & Linguistic Requirements (usually mishandled — I want this explicit)

- **J1** 🔴 Which scripts must be supported: Devanagari, IAST diacritics (ā ī ū ṛ ṝ ḷ ṅ ñ ṭ ḍ ṇ ś ṣ),
  Harvard-Kyoto, ITRANS, Telugu/Kannada/Tamil/Grantha?
- **J2** 🔴 Do students need to **type Devanagari** in the portal? If yes, do they have keyboards,
  or does the platform need to provide a transliteration input (type `namaste` → नमस्ते)?
- **J3** 🟡 Must search work across scripts (searching "gita" finds गीता)?
- **J4** 🟡 Do you need a **verse/śloka display component** with proper line breaks, pāda
  divisions, anvaya, padaccheda, translation layers?
- **J5** 🟡 Any font preferences? Devanagari needs a real font choice — do you have one you like?
- **J6** 🟢 Do you need vedic accent marks (svara/udātta-anudātta) rendered correctly?
  This constrains font and encoding choices significantly.
- **J7** 🟢 Audio: do recitation recordings need precise playback controls (slow-down without
  pitch change, A–B loop for repetition practice)?

---

## K. Communication & Notifications

- **K1** 🔴 What channels do you and your students actually use — email, WhatsApp, SMS, Telegram?
  (WhatsApp Business API has real cost and approval implications; I need to know now.)
- **K2** 🔴 Which events must trigger a notification? (class reminder, class cancelled, homework
  assigned, homework graded, assessment published, result declared, certificate issued,
  new application received.)
- **K3** 🟡 Do you want in-portal announcements/notices to a whole batch?
- **K4** 🟡 Can students **message you** through the platform, or do they use WhatsApp/email
  outside it? (This decides whether we build any messaging at all.)
- **K5** 🟢 Do you want a daily/weekly digest email to yourself summarizing pending work?

---

## L. Data, Privacy, Legal, Operations

- **L1** 🔴 Where are you and your students located? (India + which other countries?) This
  determines DPDP Act / GDPR obligations.
- **L2** 🔴 Is there a legal entity behind the Gurukula (trust, sole proprietorship, company),
  and what name goes on certificates and legal pages?
- **L3** 🟡 Data retention: how long do you keep student submissions, recordings, and records?
- **L4** 🟡 Do you need Terms of Service and a Privacy Policy at launch? Do you have them, or
  do they need drafting?
- **L5** 🟡 Backups: what is the worst thing that could be lost? How much data loss is tolerable
  (an hour? a day?)?
- **L6** 🟢 Do you need an audit trail of teacher actions (grade changed, certificate revoked)?

---

## M. Technical Constraints & Delivery

- **M1** 🔴 Do you have a preferred tech stack, or is that my decision? Any existing hosting,
  accounts, or code you want reused?
- **M2** 🔴 What is your monthly budget ceiling for hosting and services (₹ or $)? This decides
  architecture more than anything else.
- **M3** 🔴 Who maintains this after launch — me, another developer, you? Does it need to be
  simple enough for you to operate alone?
- **M4** 🔴 What is your target launch date, and is there a hard external deadline
  (a batch starting, an academic year, a festival date)?
- **M5** 🔴 Expected scale in year one: how many total students, concurrent students in a class,
  total storage for recordings/audio?
- **M6** 🟡 Do you already own a domain? Do you have Google Workspace / an email sending domain?
- **M7** 🟡 Any accessibility requirements? Any students with low bandwidth, older devices,
  or who are visually impaired?
- **M8** 🟡 Mobile: no mobile *app* in V1 — but must the web portal work well on phones?
  What % of students will use a phone as their only device?
- **M9** 🟢 Do you want a staging environment to review before anything goes live?
- **M10** 🟢 How do you want to review progress — working demo each milestone, or written updates?

---

## N. Scope Discipline & Future Seams

- **N1** 🟡 Of the eight V1 modules, if you could only launch **three** on day one, which three?
- **N2** 🟡 Which excluded features are "never" vs. "not yet"? Specifically: will payments,
  community, and multi-teacher arrive in V2? If so I will leave clean seams for them without
  building them.
- **N3** 🟡 What does failure look like? What would make you say six months from now that this
  platform was a mistake?
- **N4** 🟡 Is there an existing tool you use today (Google Classroom, WhatsApp groups,
  spreadsheets, Notion)? What specifically about it is failing you? This is the best possible
  input for design.
- **N5** 🟢 Are there platforms whose feel you admire or despise? Name them.

---

## Answer these first if you want to move fastest

A1, A2, A3, A4, A9 · B1, B3, B4 · D1 · E1, E2, E3, E5 · F1, F6 · G1, G7 ·
H2, H5 · I1, I2 · J1, J2 · K1 · L1 · M1, M2, M4, M5

Everything else can follow.
