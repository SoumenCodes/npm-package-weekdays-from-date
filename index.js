// index.js
"use strict";

/**
 * parseDate(input)
 * Supports:
 *  - Date object
 *  - "dd.mm.yyyy", "dd-mm-yyyy", "dd/mm/yyyy"
 *  - "yyyy-mm-dd" (ISO)
 *  - other Date-parsable strings (fallback)
 */
function parseDate(input) {
  if (!input && input !== 0) throw new Error("No date provided.");

  if (input instanceof Date) {
    const d = new Date(input.getFullYear(), input.getMonth(), input.getDate());
    return d;
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

  // split common separators
  const parts = str
    .split(/[.\-\/]/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 3) {
    let day, month, year;
    // if first part looks like year (4 digits), assume yyyy-mm-dd or yyyy/mm/dd
    if (parts[0].length === 4) {
      year = Number(parts[0]);
      month = Number(parts[1]);
      day = Number(parts[2]);
    } else {
      // assume dd-mm-yyyy (common)
      day = Number(parts[0]);
      month = Number(parts[1]);
      year = Number(parts[2]);
      if (year < 100) year += 2000; // allow "22-08-25"
    }
    const d = new Date(year, month - 1, day);
    if (Number.isNaN(d.getTime()))
      throw new Error("Invalid date after parsing.");
    return d;
  }

  // fallback to Date parser
  const fallback = new Date(str);
  if (!isNaN(fallback.getTime()))
    return new Date(
      fallback.getFullYear(),
      fallback.getMonth(),
      fallback.getDate()
    );

  throw new Error("Unsupported or invalid date format.");
}

const SHORT_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function shortNameOf(date) {
  return SHORT_NAMES[date.getDay()];
}

/**
 * getWeekday(input)
 * Returns short weekday name for the given date.
 */
function getWeekday(input) {
  const d = parseDate(input);
  return shortNameOf(d);
}

/**
 * getWeekDaysOfWeek(input, options)
 * options:
 *  - start: 'mon'|'sun' (default: 'mon')
 *  - format: 'names'|'objects' (default: 'names')
 *
 * If format === 'names' -> returns ['Mon','Tue',...]
 * If format === 'objects' -> returns [{ name: 'Mon', date: '2025-08-18', jsDate: Date }, ...]
 */
function getWeekDaysOfWeek(input, options = {}) {
  const { start = "mon", format = "names" } = options;
  const date = parseDate(input);

  // JS getDay(): 0 (Sun) - 6 (Sat)
  const dayIndex = date.getDay();
  // offset to Monday-based week (0 = Monday)
  const offsetToStart = start === "mon" ? (dayIndex + 6) % 7 : dayIndex;
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - offsetToStart);

  const results = [];
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
        jsDate: new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()),
      });
    }
  }

  return results;
}

module.exports = {
  getWeekday,
  getWeekDaysOfWeek,
};
