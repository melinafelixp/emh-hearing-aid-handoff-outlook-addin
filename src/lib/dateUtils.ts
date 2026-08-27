// Date handling for the two-deployment campaign structure.
// Dates are stored/passed as "yyyy-mm-dd" strings (native <input type="date"> format)
// and parsed as local dates (not UTC) so there's no off-by-one-day risk near midnight.

const DAY_MS = 24 * 60 * 60 * 1000;
const DEPLOYMENT_GAP_DAYS = 14;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Parse a "yyyy-mm-dd" string into a local Date at midnight (no timezone drift). */
export function parseLocalDate(isoDate: string): Date | null {
  if (!isoDate) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  // Guard against JS's auto-rollover for invalid dates (e.g. Feb 30)
  if (date.getFullYear() !== Number(y) || date.getMonth() !== Number(m) - 1 || date.getDate() !== Number(d)) {
    return null;
  }
  return date;
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Deployment #2 = Deployment #1 + 14 days, using real date arithmetic
 * (Date's setDate correctly rolls across month/year boundaries and leap years —
 * we never do manual "add 14 to the day number" math).
 */
export function calculateSecondDeploymentDate(firstDeploymentIso: string): string {
  const first = parseLocalDate(firstDeploymentIso);
  if (!first) return "";
  const second = new Date(first.getTime());
  second.setDate(second.getDate() + DEPLOYMENT_GAP_DAYS);
  return toIsoDate(second);
}

/** "August 26, 2026" */
export function formatLongDate(isoDate: string): string {
  const date = parseLocalDate(isoDate);
  if (!date) return "";
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/** "8/26" — used for the compact email output */
export function formatCompactDate(isoDate: string): string {
  const date = parseLocalDate(isoDate);
  if (!date) return "";
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/** "8/26 & 9/9" */
export function formatDeploymentDatesCompact(firstIso: string, secondIso: string): string {
  if (!firstIso || !secondIso) return "";
  return `${formatCompactDate(firstIso)} & ${formatCompactDate(secondIso)}`;
}

/** Full month name derived from deployment #1 — used for the Outlook subject line. */
export function getDeploymentMonthName(firstDeploymentIso: string): string {
  const date = parseLocalDate(firstDeploymentIso);
  if (!date) return "";
  return MONTH_NAMES[date.getMonth()];
}
