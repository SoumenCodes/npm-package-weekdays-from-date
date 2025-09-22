import { getWeekday, getWeekDaysOfWeek } from "../src";

console.log("Weekday:", getWeekday("22.09.2025"));
console.log("Week (names):", getWeekDaysOfWeek("22-08-2025"));
console.log(
  "Week (objects):",
  getWeekDaysOfWeek("22/08/2025", { format: "objects" })
);
