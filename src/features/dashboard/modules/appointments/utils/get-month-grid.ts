import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export const WEEK_STARTS_ON = 1 as const;

export const getMonthGrid = (date: Date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);

  return eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: WEEK_STARTS_ON }),
    end: endOfWeek(monthEnd, { weekStartsOn: WEEK_STARTS_ON }),
  });
};
