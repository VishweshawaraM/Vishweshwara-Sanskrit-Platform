import { test } from "node:test";
import assert from "node:assert/strict";

import { hashPassword, verifyPassword } from "./password.ts";

test("round-trips a password", () => {
  const hash = hashPassword("gaNeshAya namaH");
  assert.ok(verifyPassword("gaNeshAya namaH", hash));
});

test("rejects a wrong password", () => {
  const hash = hashPassword("correct");
  assert.equal(verifyPassword("incorrect", hash), false);
});

test("rejects malformed stored values without throwing", () => {
  assert.equal(verifyPassword("anything", "not-a-hash"), false);
  assert.equal(verifyPassword("anything", ""), false);
});

test("salts: same password, different hashes", () => {
  assert.notEqual(hashPassword("same"), hashPassword("same"));
});
