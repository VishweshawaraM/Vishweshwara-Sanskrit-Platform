/**
 * Devanagari integrity validation.
 *
 * WHY THIS EXISTS
 * The Acharya's own curriculum PDFs arrived with corrupted Devanagari — conjuncts
 * broken, matras detached and floating to the front of words (`ैदकअनुष्ठान` for
 * `वैदिकानुष्ठान`, `वाक्यनिार्माण्` for `वाक्यनिर्माणम्`). That corruption is invisible
 * to anyone who does not read the script, and it would have been published.
 *
 * Nothing enters the database unvalidated. See docs/12-devanagari-reference.md §8.
 */

/** Dependent vowel signs (mātrās). A word may never begin with one. */
const MATRA = /[ऺ-ौॎॏॕ-ॗॢॣ]/;
const VIRAMA = "्";

/** Combining marks that attach to a preceding base character. */
const COMBINING =
  /[ऀ-ःऺ-्ॎ-ॗॢॣ॑-॔]/;

/** Vedic accent marks — udātta, anudātta, and the Vedic Extensions block. */
const VEDIC_ACCENT = /[॒॑᳐-᳿]/;

const DEVANAGARI_RANGE = /[ऀ-ॿ᳐-᳿꣠-ꣿ]/;

export type SanskritIssue = {
  code:
    | "leading_matra"
    | "double_matra"
    | "matra_after_virama"
    | "leading_combining_mark"
    | "double_virama"
    | "not_normalized"
    | "empty";
  message: string;
  /** Index into the input string, where determinable. */
  at?: number;
};

export type ValidationResult = {
  ok: boolean;
  issues: SanskritIssue[];
};

/**
 * Unicode NFC. Devanagari MUST be stored normalized — otherwise two visually
 * identical strings compare unequal and search silently misses them.
 */
export function toNFC(input: string): string {
  return input.normalize("NFC");
}

export function containsDevanagari(input: string): boolean {
  return DEVANAGARI_RANGE.test(input);
}

export function containsVedicAccent(input: string): boolean {
  return VEDIC_ACCENT.test(input);
}

/**
 * Validate a Devanagari string for the corruption patterns observed in real
 * source documents. Returns every issue found rather than the first.
 */
export function validateDevanagari(input: string): ValidationResult {
  const issues: SanskritIssue[] = [];

  if (input.length === 0) {
    return { ok: false, issues: [{ code: "empty", message: "String is empty." }] };
  }

  if (input.normalize("NFC") !== input) {
    issues.push({
      code: "not_normalized",
      message: "String is not in Unicode NFC. Call toNFC() before storing.",
    });
  }

  const chars = Array.from(input);

  for (const [i, ch] of chars.entries()) {
    const prev = i > 0 ? chars[i - 1] : undefined;
    const atWordStart = prev === undefined || /[\s।॥]/.test(prev);

    if (atWordStart && MATRA.test(ch)) {
      issues.push({
        code: "leading_matra",
        message: `A word begins with the vowel sign ${describe(ch)}. A mātrā must attach to a preceding consonant — this is the signature of PDF conjunct corruption.`,
        at: i,
      });
      continue;
    }

    if (atWordStart && COMBINING.test(ch)) {
      issues.push({
        code: "leading_combining_mark",
        message: `A word begins with the combining mark ${describe(ch)}, which has no base character.`,
        at: i,
      });
      continue;
    }

    if (prev !== undefined && MATRA.test(ch) && MATRA.test(prev)) {
      issues.push({
        code: "double_matra",
        message: `Two adjacent vowel signs (${describe(prev)} then ${describe(ch)}). A syllable carries at most one.`,
        at: i,
      });
    }

    if (prev === VIRAMA && MATRA.test(ch)) {
      issues.push({
        code: "matra_after_virama",
        message: `A vowel sign follows a virāma at index ${i}. A virāma removes the inherent vowel; nothing may follow it but a consonant.`,
        at: i,
      });
    }

    if (prev === VIRAMA && ch === VIRAMA) {
      issues.push({
        code: "double_virama",
        message: `Two consecutive virāmas at index ${i}.`,
        at: i,
      });
    }
  }

  return { ok: issues.length === 0, issues };
}

/**
 * Validate and normalize in one step. Throws on corruption — call this at every
 * ingest boundary so bad text can never reach the database.
 */
export function assertValidDevanagari(input: string, context?: string): string {
  const normalized = toNFC(input);
  const { ok, issues } = validateDevanagari(normalized);

  if (!ok) {
    const where = context ? ` in ${context}` : "";
    const detail = issues.map((i) => `  • ${i.message}`).join("\n");
    throw new Error(`Invalid Devanagari${where}:\n${detail}`);
  }

  return normalized;
}

function describe(ch: string): string {
  const cp = ch.codePointAt(0);
  const hex = cp?.toString(16).toUpperCase().padStart(4, "0") ?? "????";
  return `U+${hex}`;
}
