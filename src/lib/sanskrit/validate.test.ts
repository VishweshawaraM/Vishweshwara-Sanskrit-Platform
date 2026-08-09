import { test } from "node:test";
import assert from "node:assert/strict";

import {
  toNFC,
  containsVedicAccent,
  validateDevanagari,
  assertValidDevanagari,
} from "./validate.ts";

test("accepts correct Devanagari confirmed by the Acharya", () => {
  assert.equal(validateDevanagari("वाक्यनिर्माणम्").ok, true);
  assert.equal(validateDevanagari("संस्कृताध्ययनपरम्परा").ok, true);
  assert.equal(validateDevanagari("श्रीरुद्रम्").ok, true);
  assert.equal(validateDevanagari("महानारायणोपनिषद्").ok, true);
});

test("word-final virama is legitimate, not corruption", () => {
  // वाक्यनिर्माणम् correctly ends in म् — must not be flagged.
  assert.equal(validateDevanagari("वाक्यनिर्माणम्").ok, true);
});

test("catches the leading-matra corruption seen in the source PDFs", () => {
  // From the Yajurveda curriculum: ैदकअनुष्ठानमन्त्राः
  const result = validateDevanagari("ैदकअनुष्ठानमन्त्राः");
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((i) => i.code === "leading_matra"));
});

test("catches a matra following a virama", () => {
  const result = validateDevanagari("क्ा");
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((i) => i.code === "matra_after_virama"));
});

test("catches two adjacent vowel signs", () => {
  const result = validateDevanagari("कै" + "ा");
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((i) => i.code === "double_matra"));
});

test("detects vedic accents", () => {
  assert.equal(containsVedicAccent("अ॒ग्निमी॑ळे"), true);
  assert.equal(containsVedicAccent("वाक्यनिर्माणम्"), false);
});

test("normalizes to NFC", () => {
  const decomposed = "क़".normalize("NFD");
  assert.equal(toNFC(decomposed), decomposed.normalize("NFC"));
});

test("assertValidDevanagari throws with context", () => {
  assert.throws(
    () => assertValidDevanagari("ैदक", "stage.name_devanagari"),
    /stage\.name_devanagari/,
  );
});
