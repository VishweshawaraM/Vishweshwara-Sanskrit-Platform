/**
 * Time handling.
 *
 * RULE: every instant is stored in UTC. Timezone is a DISPLAY concern, with one
 * exception — the Acharya's teaching calendar is authoritative in IST, because
 * that is the calendar the day is actually lived in (docs/07 §4).
 *
 * Students span India, Europe, the US, and Australia. A session time shown in
 * the wrong zone is not a cosmetic bug; it is a missed class.
 */

export const ACHARYA_TIMEZONE = "Asia/Kolkata" as const;

export function formatInZone(
  instant: Date,
  timeZone: string,
  options: Intl.DateTimeFormatOptions = {},
): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    dateStyle: "medium",
    timeStyle: "short",
    ...options,
  }).format(instant);
}

/** Resolve the viewer's IANA timezone, falling back to the Acharya's. */
export function detectTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || ACHARYA_TIMEZONE;
  } catch {
    return ACHARYA_TIMEZONE;
  }
}

export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
