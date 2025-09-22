const { getWeekday, getWeekDaysOfWeek } = require("./index");

// console.log("Single weekday:");
console.log(getWeekday("22.09.2025")); // => e.g. 'Fri'

// console.log("\nWeek (names):");
// console.log(getWeekDaysOfWeek("22-08-2025")); // => ['Mon','Tue','Wed',...,'Sun']

// console.log("\nWeek (objects):");
// console.log(getWeekDaysOfWeek("22/08/2025", { format: "objects" }));
/*
[
  { name: 'Mon', date: '2025-08-18', jsDate: [Date] },
  ...
]
*/
