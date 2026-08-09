import { test } from "node:test";
import assert from "node:assert/strict";

import { validateDevanagari } from "../../lib/sanskrit/validate.ts";
import { curriculum } from "./curriculum.ts";

test("every Devanagari string in the curriculum is valid", () => {
  for (const p of curriculum) {
    if (p.devanagari) {
      assert.ok(validateDevanagari(p.devanagari).ok, `path ${p.slug}`);
    }
    for (const s of p.stages) {
      assert.ok(validateDevanagari(s.devanagari).ok, `${p.slug} stage ${s.number}`);
      for (const item of s.items ?? []) {
        if (item.devanagari) {
          assert.ok(validateDevanagari(item.devanagari).ok, item.latin);
        }
      }
    }
  }
});

test("stage numbers are contiguous from 1", () => {
  for (const p of curriculum) {
    const numbers = p.stages.map((s) => s.number);
    assert.deepEqual(numbers, numbers.map((_, i) => i + 1), p.slug);
  }
});

test("paths without stages are unpublished", () => {
  for (const p of curriculum) {
    if (p.stages.length === 0) assert.equal(p.published, false, p.slug);
  }
});
