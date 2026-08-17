import { formatDate } from "@/utils";
import {
  buildAppointmentFormDefaults,
  type TAppointmentForm,
} from "../schemas";
import type { TAppointmentCalendarEvent } from "../types";

export const fullName = (...parts: Array<string | null | undefined>) =>
  parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

export const toAppointmentFormValues = (
  event: TAppointmentCalendarEvent | null,
  initialDate?: Date,
): TAppointmentForm => {
  if (!event) return buildAppointmentFormDefaults(initialDate);

  return {
    idPatient: event.idPatient,
    idUser: event.idUser,
    idService: event.idService,
    idAppointmentStatus: Number(event.calendarId) || 0,
    startAt: formatDate(event.start, "yyyy-MM-dd'T'HH:mm"),
    endAt: formatDate(event.end, "yyyy-MM-dd'T'HH:mm"),
    notes: event.description ?? "",
  };
};
