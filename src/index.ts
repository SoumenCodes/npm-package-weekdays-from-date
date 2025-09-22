function getWeekday(dateStr: string): string {
  // Replace all possible separators (-, /, .) with a dot
  const normalized = dateStr.replace(/[-/]/g, ".");
  const [day, month, year] = normalized.split(".");
  const date = new Date(`${year}-${month}-${day}`);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekdays[date.getDay()];
}

export default getWeekday;
