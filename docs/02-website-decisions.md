# Website Architecture — Decisions Log

Status: **decisions ratified by the Acharya unless marked OPEN.**
No code until the full requirements set (PRD, IA, DB, folder structure, roadmap) is approved.

---

## D-01 — The website has three jobs, in order

1. **Build trust** — the visitor must conclude "this Acharya is authentic."
2. **Educate** — a visitor who never enrolls should still leave understanding Sanskrit,
   Veda, and the teaching philosophy better than when they arrived.
3. **Convert** — only after trust and understanding, invite a request for orientation.

*Ratified by the Acharya, overriding an earlier conversion-only framing.*

**Consequence:** the knowledge/writings archive is a **primary pillar of the site, not a footer
link.** It is the asset that appreciates over time and the strongest lever for AI/answer-engine
citation. Marketing pages decay; a text archive does not.

## D-02 — Navigation is English; Sanskrit lives inside the pages

Visitors come from India, the US, Europe, and Australia. Sanskrit navigation increases friction
for the majority and flatters the institution at the visitor's expense.

**Primary nav:** Home · About · Learning Paths · Digital Gurukula · Testimonials · Contact

Sanskrit is introduced *within* pages, with gloss, so the vocabulary is taught rather than
assumed: Abhyāsa (Practice), Avalokanam (Assessment), Praveśa (Admission).

**Assumed split — needs confirmation:** About = the Acharya and the institution.
Digital Gurukula = how learning actually works (the method and cycle).

> 🔶 OPEN D-02a — **No Admissions destination exists.** "Request an Orientation" has nowhere
> to land; Contact would flatten the most considered decision on the site into a contact form.
> Options: add **Admissions** as a sixth nav item, or keep five and place the CTA as a
> persistent button outside the nav.

> 🔶 OPEN D-02b — **"Testimonials" as a primary nav item reads coaching-institute.** Harvard
> and Oxford have no such tab; institutions distribute evidence rather than centralising praise.
> Options: fold student voices into About and Digital Gurukula, or retain the page renamed
> **Student Voices**.

## D-03 — Palette: parchment, charcoal, maroon, gold accent

**Ratified.** An earlier "dark and gold" direction was rejected on two grounds:

1. **Category error.** Dark-and-gold is the language of luxury commerce (watches, crypto,
   premium coaching funnels) — the exact category this institution is not. Three of the four
   stated references (Harvard, Notion, heritage institutions) are light-ground.
2. **Technical.** Krishna Yajurveda requires **vedic accent marks** (udātta, anudātta, svarita)
   plus IAST diacritics. These are hairline strokes above and below the glyph. Light-on-dark
   text blooms optically, thickening fine marks and merging them with the base glyph — worse
   on low-brightness phone screens. A dark reading ground degrades the most important content
   on the site.

**Final palette:**
- Warm ivory / parchment — reading ground
- Deep charcoal — text
- Maroon — institutional colour (carries both the Oxford/Harvard register and kāṣāya/kumkuma)
- Gold — accent only: rules, seals, certificate. **Never a gradient, never a button fill.**

Reference set: Harvard, Oxford, manuscripts, palm leaf, temple inscriptions.
Anti-reference set: Rolex, crypto, coaching institutes, luxury watches.

## D-04 — Conversion model: qualify, don't maximise

Per V4 and V7. The site is a **qualifying instrument**, not a funnel.

- Single sitewide CTA: **"Request an Orientation"** — *request* signals selectivity accurately.
- The request form is a **filter**: why you want to study, prior study, weekly hours available,
  ability to attend live at a fixed time. It should be answerable only by a serious person.
- **No fee is ever displayed.** Guru Dakṣiṇā is a personal conversation (V7); a price on the
  page would contradict the model.
- Trust weighting, highest first: paramparā and training → method explained in depth →
  student outcomes in their own words → verifiable certificates → visual polish. **Polish is
  last and cannot substitute for the others.**

## D-05 — Designed to last to 2045

The governing principle: Apple's longevity comes not from minimalism but from deciding what the
product *is* and removing everything else. **Here the product is the relationship between
Acharya and śiṣya.** The site makes that relationship visible; everything else gets out of the way.

**Refused by name** (each is a timestamp): gradients and mesh backgrounds · glassmorphism ·
scroll-triggered animation and parallax · hero video · rounded-everything · corporate flat
illustration · stock photography · feature-icon rows · this decade's geometric sans ·
framework default styling.

**Also refused** (cheapening devices): modals · popups · exit-intent · chat bubble ·
social-proof counters · countdowns · newsletter interruptions.

**Typography.** Latin: a face already old, or a serious revival — Garamond, Caslon, Baskerville,
Sabon, Minion; or Lyon/Tiempos for a contemporary face on classical bones. Devanagari: must be
beautiful *and* support vedic accents — leading candidates **Murty Sanskrit** (John Hudson, for
the Murty Classical Library) and **Shobhika** (scholarly Sanskrit, vedic marks). Pairing requires
matching stroke weight, x-height against the shirorekha, and baseline; Devanagari needs line
height ≈ 1.8–2.0 because accents sit both above and below. One modular scale, few sizes.
Latin measure 60–70 characters.

**Space.** Margins taken from book typography, not web convention. Emptiness signals value more
effectively than decoration.

**Imagery.** Photograph reality — actual manuscripts, palm leaf, texts, hands, teaching space,
consenting students. Few, large, never decorative. **No AI art, no temple stock, no gold Om
symbols, no deity clipart.** If a true photograph is unavailable, use nothing.

**Architecture for longevity:**
- Organise the knowledge archive **by text, not by course packaging** — course structures will
  be revised many times; the Gītā will not.
- **URLs are permanent addresses.** A certificate verification link issued in 2026 may be checked
  by a registrar in 2045 and must never break. This constrains routing and must be settled
  before implementation.
- The site must be **readable without JavaScript**; content meant to outlive its framework cannot
  depend on one.
- Content stored in a durable plain format with **no presentation baked in**, so a future
  redesign is a redesign and not a migration.
- The About page is a **lineage document**, not a bio. Bios date; lineage does not.

**Performance budget** (the luxury signal that cannot be faked): LCP < 1.5s on 4G · CLS ≈ 0 ·
no layout shift from Devanagari font loading (subsetting + `font-display` strategy required —
accent-complete Devanagari fonts are heavy) · < 100KB JS on marketing pages.

## D-06 — Search strategy: SEO, AEO, GEO

**SEO.** Do not compete for "learn Sanskrit online" — a content-farm war, and the wrong students.
Compete on precision and intent: *Krishna Yajurveda online with a traditional Acharya*,
*Bhagavad Gītā study with pronunciation correction*, *live Sanskrit classes guru-śiṣya*.
The existing domain's authority is **migrated, never abandoned**.

**AEO.** Structured data: `EducationalOrganization`, `Person` (credentials and lineage),
`Course` per level, `FAQPage` on admission. Real questions answered in plain language on the
page — not hidden in accordions, which harm extraction.

**GEO.** Target being *the cited answer* when someone asks an AI where to learn Krishna
Yajurveda properly. Requires: clean semantic HTML · factual, quotable self-description ·
consistent entity facts across every mention of the Acharya on the web · genuine depth on texts
and method (depth is what gets cited) · an `llms.txt` describing the institution. Almost nobody
in traditional Sanskrit education is doing this — it is an available and durable advantage.

## D-07 — The highest-leverage work is the writing

The most timeless element of the site will not be the typography, palette, or grid — it will be
the **words**. A beautifully designed site with thin text ages badly within five years; a plainly
designed site with excellent writing is still read in fifty.

Priority work item: the Acharya's own account of **the method, the paramparā, and the reasons for
teaching**, written well enough to still be worth reading in 2045.

---

## Blocked / awaiting the Acharya

- **D-02a**, **D-02b** above.
- **Existing site content** — `vishweshwarasanskrit.com` is blocked by this environment's network
  egress policy. Needs pasting, screenshots, or a domain allowlist.
- **Bio, training, paramparā in the Acharya's own words** — the highest-trust page on the site.
  A lineage will not be invented.
- **Course names and level structure** (Section 5) — required for Learning Paths.
- **Brand assets** — logo, existing colours, fonts, photographs; or confirmation none exist.
- **Domain strategy** — new platform at the root vs. a portal subdomain, with SEO consequences.
  Parked for Section 10. The current site must not be taken down meanwhile.
- **Section 2 (User Roles)** — R1–R8 unanswered; the portal cannot proceed without it.
- **V6 scale target** — the 75–100 figure arrived as a draft and needs confirming.
