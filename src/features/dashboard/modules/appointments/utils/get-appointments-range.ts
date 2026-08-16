import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { colombiaToUtcIso } from "@/utils";
import type { TCalendarView } from "../types";

const WEEK_OPTIONS = { weekStartsOn: 1 as const };

/** Días que muestra la vista agenda a partir de la fecha activa. */
export const AGENDA_RANGE_DAYS = 30;

const toApiDate = (date: Date) => colombiaToUtcIso(date);

export const getAppointmentsRange = (date: Date, view: TCalendarView) => {
  let from: Date;
  let to: Date;

  switch (view) {
    case "day":
    case "resource":
      from = startOfDay(date);
      to = endOfDay(date);
      break;
    case "agenda":
      from = startOfDay(date);
      to = endOfDay(addDays(date, AGENDA_RANGE_DAYS - 1));
      break;
    case "week":
      from = startOfWeek(date, WEEK_OPTIONS);
      to = endOfWeek(date, WEEK_OPTIONS);
      break;
    case "month":
    default:
      from = startOfWeek(startOfMonth(date), WEEK_OPTIONS);
      to = endOfWeek(endOfMonth(date), WEEK_OPTIONS);
      break;
  }

  return {
    From: toApiDate(from),
    To: toApiDate(to),
  };
};
