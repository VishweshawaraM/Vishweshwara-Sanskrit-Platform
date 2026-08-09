#!/usr/bin/env node
/**
 * Font subsetting.
 *
 * Accent-complete Devanagari is heavy. Subsetting is what keeps LCP under 1.5s
 * (docs/08 §4). Run this whenever a font is added or replaced:
 *
 *   npm run fonts
 *
 * Requires: python3 with fonttools and brotli  →  pip install fonttools brotli
 *
 * SWAPPING IN SHOBHIKA: drop Shobhika-Regular.otf and Shobhika-Bold.otf into
 * assets/fonts/, change `source` on the devanagari entries below, and re-run.
 * Nothing else in the codebase changes.
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, statSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const OUT = resolve("public/fonts");

/**
 * Unicode ranges.
 *
 * Devanagari includes the Vedic Extensions block and ZWJ/ZWNJ even though no
 * current content uses them — Yajurveda material will, and re-subsetting after
 * launch means re-verifying every page (FONTS.md).
 */
const RANGES = {
  latin: [
    "U+0020-007E", // Basic Latin
    "U+00A0-00FF", // Latin-1 Supplement
    "U+0100-017F", // Latin Extended-A
    "U+1E00-1EFF", // Latin Extended Additional — IAST lives here
    "U+2000-206F", // General punctuation
    "U+2212",
  ].join(","),

  devanagari: [
    "U+0900-097F", // Devanagari
    "U+A8E0-A8FF", // Devanagari Extended
    "U+1CD0-1CFF", // Vedic Extensions
    "U+200C-200D", // ZWNJ / ZWJ — required for correct conjunct control
    "U+0020",
  ].join(","),
};

const FONTS = [
  {
    out: "vishweshwara-serif-400.woff2",
    // IAST diacritics live in Latin Extended Additional, which fontsource ships
    // only in latin-ext. Both files are merged before subsetting.
    source: [
      "node_modules/@fontsource/eb-garamond/files/eb-garamond-latin-400-normal.woff2",
      "node_modules/@fontsource/eb-garamond/files/eb-garamond-latin-ext-400-normal.woff2",
    ],
    range: RANGES.latin,
  },
  {
    out: "vishweshwara-serif-600.woff2",
    source: [
      "node_modules/@fontsource/eb-garamond/files/eb-garamond-latin-600-normal.woff2",
      "node_modules/@fontsource/eb-garamond/files/eb-garamond-latin-ext-600-normal.woff2",
    ],
    range: RANGES.latin,
  },
  {
    out: "vishweshwara-devanagari-400.woff2",
    source: [
      "node_modules/@fontsource/noto-serif-devanagari/files/noto-serif-devanagari-devanagari-400-normal.woff2",
    ],
    range: RANGES.devanagari,
  },
  {
    out: "vishweshwara-devanagari-600.woff2",
    source: [
      "node_modules/@fontsource/noto-serif-devanagari/files/noto-serif-devanagari-devanagari-600-normal.woff2",
    ],
    range: RANGES.devanagari,
  },
];

mkdirSync(OUT, { recursive: true });

let total = 0;
const merged = [];

for (const font of FONTS) {
  const missing = font.source.filter((s) => !existsSync(s));
  if (missing.length > 0) {
    console.error(`  MISSING  ${missing.join(", ")}`);
    process.exitCode = 1;
    continue;
  }

  const before = font.source.reduce((n, s) => n + statSync(s).size, 0);
  const target = resolve(OUT, font.out);

  // Merge multi-file sources into one face before subsetting.
  let input = font.source[0];
  if (font.source.length > 1) {
    input = resolve(OUT, `.merged-${font.out}.ttf`);
    execFileSync("pyftmerge", [...font.source, `--output-file=${input}`], {
      stdio: "inherit",
    });
    merged.push(input);
  }

  execFileSync(
    "pyftsubset",
    [
      input,
      `--unicodes=${font.range}`,
      // Every OpenType layout feature is retained. Devanagari conjuncts,
      // matra reordering, and accent positioning all depend on GSUB/GPOS —
      // dropping them silently breaks the script.
      "--layout-features=*",
      "--flavor=woff2",
      "--desubroutinize",
      "--no-hinting",
      "--drop-tables+=DSIG",
      `--output-file=${target}`,
    ],
    { stdio: "inherit" },
  );

  const after = statSync(target).size;
  total += after;

  const saved = Math.round((1 - after / before) * 100);
  console.log(
    `  ${font.out.padEnd(36)} ${kb(before)} → ${kb(after)}  (−${saved}%)`,
  );
}

for (const f of merged) rmSync(f, { force: true });

console.log(`\n  Total shipped: ${kb(total)}`);

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)}kB`.padStart(8);
}
