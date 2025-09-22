// src/index.ts

/**
 * Returns the weekday for a given date string.
 * Supports formats: dd.mm.yyyy, dd-mm-yyyy, dd/mm/yyyy, yyyy-mm-dd
 */
export default function getWeekday(dateStr: string): string {
  // Normalize separators
  const normalized = dateStr.replace(/[-/]/g, ".");
  const parts = normalized.split(".");
  if (parts.length !== 3) throw new Error("Invalid date format");

  let day: number, month: number, year: number;

  if (parts[0].length === 4) {
    // yyyy.mm.dd
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    day = parseInt(parts[2], 10);
  } else {
    // dd.mm.yyyy
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    year = parseInt(parts[2], 10);
  }

  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) throw new Error("Invalid date");

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekdays[date.getDay()];
}
