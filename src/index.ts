// src/index.ts
export type WeekFormat = "names" | "objects";
export type WeekStart = "mon" | "sun";

export interface WeekDayObject {
  name: string;
  date: string; // YYYY-MM-DD
  jsDate: Date;
}

const SHORT_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Parse date strings into Date object
 * Supports:
 * - dd.mm.yyyy, dd-mm-yyyy, dd/mm/yyyy
 * - yyyy-mm-dd (ISO)
 * - Date object
 */
export function parseDate(input: string | Date): Date {
  if (input instanceof Date) {
    return new Date(input.getFullYear(), input.getMonth(), input.getDate());
  }

  if (typeof input !== "string") {
    throw new Error("Unsupported date input type. Use string or Date.");
  }

  const str = input.trim();

  // ISO yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  // dd-mm-yyyy / dd.mm.yyyy / dd/mm/yyyy
  const parts = str.split(/[.\-\/]/).map(Number);
  if (parts.length === 3) {
    let day: number, month: number, year: number;
    if (parts[0] > 31) {
      // yyyy-mm-dd disguised
      year = parts[0];
      month = parts[1];
      day = parts[2];
    } else {
      day = parts[0];
      month = parts[1];
      year = parts[2];
    }
    return new Date(year, month - 1, day);
  }

  const fallback = new Date(str);
  if (!isNaN(fallback.getTime())) return fallback;

  throw new Error("Invalid date format: " + input);
}

function shortNameOf(date: Date): string {
  return SHORT_NAMES[date.getDay()];
}

/** Get single weekday name */
export function getWeekday(input: string | Date): string {
  return shortNameOf(parseDate(input));
}

/**
 * Get all weekdays of the week containing the date
 */
export function getWeekDaysOfWeek(
  input: string | Date,
  options: { start?: WeekStart; format?: WeekFormat } = {}
): string[] | WeekDayObject[] {
  const { start = "mon", format = "names" } = options;
  const date = parseDate(input);

  const dayIndex = date.getDay();
  const offsetToStart = start === "mon" ? (dayIndex + 6) % 7 : dayIndex;
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - offsetToStart);

  const results: (string | WeekDayObject)[] = [];
  for (let i = 0; i < 7; i++) {
    const dt = new Date(startDate);
    dt.setDate(startDate.getDate() + i);
    const name = shortNameOf(dt);

    if (format === "names") {
      results.push(name);
    } else {
      const yyyy = dt.getFullYear();
      const mm = String(dt.getMonth() + 1).padStart(2, "0");
      const dd = String(dt.getDate()).padStart(2, "0");
      results.push({
        name,
        date: `${yyyy}-${mm}-${dd}`,
        jsDate: dt,
      });
    }
  }
  return results;
}
