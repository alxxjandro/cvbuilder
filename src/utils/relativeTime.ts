/**
 * Formats a past timestamp as a short, uppercase "edited" label such as
 * `"EDITED 2D AGO"` or `"EDITED JUST NOW"`, suitable for the mono meta lines.
 *
 * @param timestamp - Epoch milliseconds of the last edit.
 * @param now - Reference time in epoch milliseconds, defaulting to the present.
 * @returns The formatted relative label.
 */
export function formatEdited(
  timestamp: number,
  now: number = Date.now(),
): string {
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months >= 1) return `EDITED ${months}MO AGO`;
  if (weeks >= 1) return `EDITED ${weeks}W AGO`;
  if (days >= 1) return `EDITED ${days}D AGO`;
  if (hours >= 1) return `EDITED ${hours}H AGO`;
  if (minutes >= 1) return `EDITED ${minutes}M AGO`;
  return "EDITED JUST NOW";
}
