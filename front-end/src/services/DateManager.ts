/* For applications, the backend uses date as a dynamoDB sort key, which has to be a string,
 * so we need to display dates and get day/month/year from strings.
 */

/**
 * For links, although that uses a traditional Date variable type at the backend,
 * .NET appears to use a different date format that makes functions like Date.getDate() return undefined,
 * so we might need to use a string for application dates as well.
 */

//Convert a number to a short form of a month like 0 as Jan, 1 as Feb, 2 as Mar, etc.
export function getShortNameOfMonthFromNumber(dateVal: number) {
  const dates = [
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
  ];

  return dates[dateVal];
}

//Convert a date to a short form of a month like 0 as Jan, 1 as Feb, 2 as Mar, etc.
export function getShortNameOfMonthFromDate(date: Date | string) {
  const dates = [
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
  ];

  if (typeof date === "string" || !date.getDate()) {
    const month = date.toString().split("-")[1];
    return dates[parseInt(month)-1];
  }

  return dates[date.getDate()];
}

export function addTh(day: number) {
  if (day === 1) return day.toString() + "st";
  if (day === 21) return day.toString() + "st";
  if (day === 31) return day.toString() + "st";

  if (day === 2) return day.toString() + "nd";
  if (day === 22) return day.toString() + "nd";

  return day.toString() + "th";
}

//Check if a date matches today, for cases like the "clicked" check mark appearing next to a link
export function checkIfDateIsTodaysDate(
  dateToDisplay: Date | undefined
): boolean {
  if (!dateToDisplay) return false;

  const currentDate = new Date(Date.now());
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1; //0 counts as January
  const currentYear = currentDate.getFullYear();

  if (dateToDisplay?.toString().includes("T")) {
    const dateOnly = dateToDisplay?.toString().split("T")[0];

    const dateArray = dateOnly?.toString().split("-");

    return (
      parseInt(dateArray[0]) === currentYear &&
      parseInt(dateArray[1]) === currentMonth &&
      parseInt(dateArray[2]) === currentDay
    );
  }

  return false;
}

//Get more user friendly text for when a link was last clicked
export function getLastClickedText(dateToDisplay: Date | undefined) {
  if (!dateToDisplay) return "";

  const dateAndTime = dateToDisplay?.toString().split("T");
  if (dateAndTime && dateAndTime?.length > 1) {
    const dateStr = dateAndTime[0] || "";
    const time = dateAndTime[1] || "";

    const date = new Date(dateStr);

    return `Last Clicked on ${getShortNameOfMonthFromNumber(
      date.getMonth()
    )} ${addTh(date.getDate())} at ${time}`;
  }
  return `Last Clicked ${dateToDisplay}`;
}
