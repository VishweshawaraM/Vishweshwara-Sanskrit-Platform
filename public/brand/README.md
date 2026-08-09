# Brand assets

## To use the original gold artwork

The Acharya's logo is a gold-gradient raster. It is **not in the repository** —
it was shared as an inline chat image, which cannot be saved as a file.

To install it:

1. Export the artwork as **SVG** if possible, otherwise PNG with a
   **transparent background** (a white background will show as a white box on
   the ink hero and footer).
2. Save as `public/brand/logo.svg` (or `logo.png`) and, if you have it,
   `logo-lockup.svg` for the horizontal version with the wordmark.
3. In `src/components/brand/mark.tsx`, replace the SVG body with an
   `next/image` reference. Every usage — header, footer, hero seal — goes
   through that one component, so nothing else changes.

## Keep the vector for these, regardless

- **Favicon** (16–32px) — the gradient turns to mud at that size
- **Certificate seal** — one-colour foil stamping needs flat paths
- **Anywhere on the ink ground** — the vector inherits `currentColor` and stays
  crisp; a raster cannot recolour

## Sizes worth exporting

| Use | Size |
|---|---|
| Favicon | 32×32, 180×180 (Apple touch) |
| Header | 96×96 @2x |
| Hero seal | 720×720 @2x |
| Open Graph card | 1200×630 |
