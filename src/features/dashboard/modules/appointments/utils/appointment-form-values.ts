import { formatDate } from "@/utils";
import {
  buildAppointmentFormDefaults,
  emptyAppointmentProcedure,
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

  const hasTreatment = (event.idPatientTreatment ?? 0) > 0;

  return {
    idPatient: event.idPatient,
    idUser: event.idUser,
    procedures:
      event.procedures.length > 0
        ? event.procedures.map((procedure) => ({
            idProcedure: procedure.idProcedure,
            price: hasTreatment ? 0 : procedure.price,
            notes: procedure.notes ?? "",
          }))
        : [emptyAppointmentProcedure()],
    idPatientTreatment: event.idPatientTreatment ?? null,
    idAppointmentStatus: Number(event.calendarId) || 0,
    startAt: formatDate(event.start, "yyyy-MM-dd'T'HH:mm"),
    endAt: formatDate(event.end, "yyyy-MM-dd'T'HH:mm"),
    notes: event.description ?? "",
  };
};
