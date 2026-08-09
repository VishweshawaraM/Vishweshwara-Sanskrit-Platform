/**
 * Script conversion — IAST ⇄ Devanagari ⇄ Harvard-Kyoto.
 *
 * NOT IMPLEMENTED IN SPRINT 1. The signatures are fixed here so that call sites
 * and the student Devanagari input component can be written against a stable
 * contract, but the transliteration tables are a Phase 5 deliverable
 * (docs/09-roadmap.md).
 *
 * Design constraint recorded now so it is not lost: transliteration is an INPUT
 * aid only. Stored Devanagari is always the verified string the Acharya supplied
 * — it is never generated at display time from Latin. See docs/12 §8 rule 1.
 */

export type Script = "devanagari" | "iast" | "hk";

export interface TransliterateOptions {
  /** Preserve vedic accent marks where the target script can carry them. */
  preserveAccents?: boolean;
}

export function transliterate(
  _text: string,
  _from: Script,
  _to: Script,
  _options: TransliterateOptions = {},
): string {
  throw new Error(
    "transliterate() is not implemented until Phase 5. See docs/09-roadmap.md.",
  );
}
