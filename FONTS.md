# Fonts — the Phase 0 open item

Typography is the single most likely cause of a blown performance budget on this
project, and the single biggest determinant of whether the site reads as an
institution. Both faces below are **placeholders** until licensing is settled.

## What is needed

### Latin serif

A face that is already old, or a rigorous revival of one (docs/02 D-05).
Candidates: Garamond · Caslon · Baskerville · Sabon · Minion · Lyon · Tiempos.

Requirement: **complete IAST diacritic coverage** — ā ī ū ṛ ṝ ḷ ḹ ṅ ñ ṭ ḍ ṇ ś ṣ ṁ ḥ.
Many otherwise excellent faces lack the underdot and macron combinations, and
browser synthesis of them looks visibly wrong at display sizes.

### Devanagari

Must be beautiful **and** carry vedic accents. Two serious candidates:

| Face | Notes |
|---|---|
| **Murty Sanskrit** | Drawn by John Hudson for the Murty Classical Library, for exactly this purpose. Licensing must be checked — it may not be freely redistributable. |
| **Shobhika** | Designed for scholarly Sanskrit with vedic mark support. Open licence. The safe default. |

Required codepoints beyond the base block:
`U+0951` udātta · `U+0952` anudātta · `U+1CD0–U+1CFF` Vedic Extensions ·
`U+A8E0–U+A8FF` Devanagari Extended.

**Include these in the subset even where no current text uses them.** Yajurveda
content will, and re-subsetting after launch means re-verifying every page.

## Pairing

Not a dropdown choice. Matching Devanagari to a Latin serif requires aligning
stroke weight, x-height against the shirorekha, and baseline. Devanagari needs
line height ≈ 1.8–2.0 because accents sit both above and below the glyph — this
is already set in `globals.css` as `.deva` and `.deva-accented`.

## Loading strategy — non-negotiable

Accent-complete Devanagari fonts are large. To hold LCP < 1.5s and CLS ≈ 0:

1. **Subset** to the actual glyph range. Use `scripts/subset-fonts.mjs` (to be
   written) over `fonttools pyftsubset`.
2. **WOFF2 only.**
3. **Self-host** from `/public/fonts`. Never a font CDN — it costs a DNS lookup,
   a connection, and a privacy problem.
4. **`font-display: swap`** with a metric-matched fallback so nothing shifts.
5. **`<link rel="preload">`** on any page with Sanskrit above the fold.
6. Immutable cache headers — already configured in `next.config.ts`.

## Until then

`globals.css` names `"Vishweshwara Serif"` and `"Vishweshwara Devanagari"` as the
first families in each stack, with system fallbacks behind them. Dropping the
licensed files into `/public/fonts` and adding the `@font-face` rules is then the
only change required — no component touches this.

## Verification

The Phase 0 exit criterion is that `/` renders accented Devanagari correctly **on
a real low-end Android device**, not only in a desktop browser. Accent
positioning is where cheap renderers fail.
