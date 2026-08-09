import { randomBytes } from "node:crypto";

/**
 * Certificate public IDs: opaque, non-sequential, permanent (docs/07 §7).
 *
 * Crockford base32 without vowels or lookalikes (0/O, 1/I/L), grouped for
 * reading aloud over a phone to a registrar: VS-XXXX-XXXX-XXXX.
 * 12 chars × 5 bits = 60 bits — collision-free at any realistic scale.
 */
const ALPHABET = "23456789BCDFGHJKMNPQRSTVWXZ";

export function newCertificateId(): string {
  const bytes = randomBytes(12);
  let out = "";
  for (let i = 0; i < 12; i++) {
    out += ALPHABET[bytes[i]! % ALPHABET.length];
    if (i === 3 || i === 7) out += "-";
  }
  return `VS-${out}`;
}
