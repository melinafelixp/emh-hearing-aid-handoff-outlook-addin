/**
 * Parses a pasted/typed ZIP code blob (comma-separated, newline-separated, or a
 * single value) into a clean list of ZIP strings. Leading zeros are preserved
 * because these are always treated as strings, never numbers.
 */
export function parseZipInput(raw: string): string[] {
  return raw
    .split(/[\s,]+/)
    .map((z) => z.trim())
    .filter((z) => z.length > 0);
}

export function addZipsToList(existing: string[], raw: string): string[] {
  const parsed = parseZipInput(raw);
  const merged = [...existing];
  for (const zip of parsed) {
    if (!merged.includes(zip)) merged.push(zip);
  }
  return merged;
}
