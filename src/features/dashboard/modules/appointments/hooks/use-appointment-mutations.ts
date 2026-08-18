"use client";

import { toast } from "sonner";
import { colombiaToUtcIso } from "@/utils";
import { useAppDispatch } from "@/store";
import {
  putUpdateAppointment,
  resetPutUpdateAppointment,
} from "@/store/appointments/appointments-slice";
import { APPOINTMENT_STATUS } from "../consts/appointment-status";
import type { TAppointmentCalendarEvent } from "../types";

type Params = {
  applyOverride: (
    event: TAppointmentCalendarEvent,
    start: Date,
    end: Date,
  ) => void;
  clearOverride: (eventId: string) => void;
  refreshAppointments: () => void;
};

export const useAppointmentMutations = ({
  applyOverride,
  clearOverride,
  refreshAppointments,
}: Params) => {
  const dispatch = useAppDispatch();

  /** Optimistic UI + persistencia en API para drag/resize. */
  const syncAppointmentSchedule = async (
    event: TAppointmentCalendarEvent,
    start: Date,
    end: Date,
    successMessage: string,
  ) => {
    applyOverride(event, start, end);

    const result = await dispatch(
      putUpdateAppointment({
        idAppointment: Number(event.id),
        idAppointmentStatus: Number(event.calendarId),
        idPatient: event.idPatient,
        idUser: event.idUser,
        idService: event.idService,
        idPatientTreatment: event.idPatientTreatment,
        startAt: colombiaToUtcIso(start),
        endAt: colombiaToUtcIso(end),
        notes: event.description || undefined,
      }),
    );

    if (
      putUpdateAppointment.fulfilled.match(result) &&
      result.payload.success
    ) {
      toast.success(successMessage);
      dispatch(resetPutUpdateAppointment());
      refreshAppointments();
      return;
    }

    clearOverride(event.id);
    const message = putUpdateAppointment.fulfilled.match(result)
      ? result.payload.message
      : "No se pudo actualizar la cita";
    const description = putUpdateAppointment.fulfilled.match(result)
      ? result.payload.error
      : undefined;
    toast.error(message, { description });
    dispatch(resetPutUpdateAppointment());
  };

  /** "Eliminar" en UI: marca la cita como cancelada. */
  const cancelAppointment = async (event: TAppointmentCalendarEvent) => {
    const result = await dispatch(
      putUpdateAppointment({
        idAppointment: Number(event.id),
        idAppointmentStatus: APPOINTMENT_STATUS.CANCELLED,
        idPatient: event.idPatient,
        idUser: event.idUser,
        idService: event.idService,
        idPatientTreatment: event.idPatientTreatment,
        startAt: colombiaToUtcIso(event.start),
        endAt: colombiaToUtcIso(event.end),
        notes: event.description || undefined,
      }),
    );

    if (
      putUpdateAppointment.fulfilled.match(result) &&
      result.payload.success
    ) {
      toast.success(result.payload.message || "Cita cancelada");
      dispatch(resetPutUpdateAppointment());
      refreshAppointments();
      return true;
    }

    const message = putUpdateAppointment.fulfilled.match(result)
      ? result.payload.message
      : "No se pudo cancelar la cita";
    const description = putUpdateAppointment.fulfilled.match(result)
      ? result.payload.error
      : undefined;
    toast.error(message, { description });
    dispatch(resetPutUpdateAppointment());
    return false;
  };

  return {
    syncAppointmentSchedule,
    cancelAppointment,
  };
};
