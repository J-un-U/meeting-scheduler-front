import dayjs from "dayjs";

export function useCalendar(month: dayjs.Dayjs) {
  const start = month.startOf("month").startOf("week");
  const end = month.endOf("month").endOf("week");

  const days: dayjs.Dayjs[] = [];
  let date = start;

  while (date.isBefore(end) || date.isSame(end, "day")) {
    days.push(date);
    date = date.add(1, "day");
  }

  return days;
}