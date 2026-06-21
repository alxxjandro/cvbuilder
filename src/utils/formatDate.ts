/**
 * Abbreviated month names indexed 0-11 (Jan = 0).
 */
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/**
 * Matches the leading `YYYY-MM-DD` of an ISO date string.
 */
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})/;

/**
 * Formats a date string as `"YYYY Mon"` (e.g. `"2024 Jun"`).
 *
 * ISO `YYYY-MM-DD` values are parsed by their components to avoid timezone
 * drift (a naive `new Date()` can roll `2024-01-01` back to December in
 * negative UTC offsets). Empty or unparseable input yields an empty string.
 *
 * @param value - A date string, typically an ISO `YYYY-MM-DD`.
 * @returns The formatted date, or `""` when the input is empty or invalid.
 */
export function formatDate(value: string): string {
  if (!value) return "";

  const iso = ISO_DATE.exec(value);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    if (month < 1 || month > 12) return "";
    return `${year} ${MONTHS[month - 1]}`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()} ${MONTHS[date.getMonth()]}`;
}

/**
 * Formats a start/end date range as `"YYYY Mon – YYYY Mon"`.
 *
 * @param from - The start date string.
 * @param to - The end date string (ignored when `current` is `true`).
 * @param current - When `true`, the end is rendered as `"Present"`.
 * @returns The formatted range, just the start when there is no end, or `""`
 *   when neither date is available.
 */
export function formatDateRange(
  from: string,
  to: string,
  current: boolean,
): string {
  const start = formatDate(from);
  const end = current ? "Present" : formatDate(to);

  if (!start && !end) return "";
  if (!start) return end;
  if (!end) return start;
  return `${start} – ${end}`;
}
