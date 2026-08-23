import { toColombiaDate } from "@/utils";
import {
  getAppointmentStatusColor,
  getAppointmentStatusLabel,
} from "../consts/appointment-status";
import { IGetAppointmentsResponseData } from "../interfaces";
import type {
  TAppointmentCalendarEvent,
  TCalendarFilter,
  TCalendarResource,
} from "../types";
import { formatProcedureNames } from "./format-procedure-names";

const fullName = (name?: string | null, surname?: string | null) =>
  `${name ?? ""} ${surname ?? ""}`.trim();

export const mapAppointmentsToEvents = (
  appointments: IGetAppointmentsResponseData[] | undefined,
): TAppointmentCalendarEvent[] => {
  if (!appointments?.length) return [];

  return appointments.map((appointment) => {
    const patientName = fullName(
      appointment.patientName,
      appointment.patientSurname,
    );
    const professionalName = fullName(
      appointment.professionalName,
      appointment.professionalSurname,
    );
    const procedureNames = formatProcedureNames(appointment.procedures);

    return {
      id: String(appointment.idAppointment),
      title: patientName
        ? `${patientName} · ${procedureNames}`
        : procedureNames,
      start: toColombiaDate(appointment.startAt),
      end: toColombiaDate(appointment.endAt),
      description: appointment.notes ?? undefined,
      color: getAppointmentStatusColor(appointment.idAppointmentStatus),
      calendarId: String(appointment.idAppointmentStatus),
      resourceId: String(appointment.idProfessional),
      statusLabel: getAppointmentStatusLabel(
        appointment.idAppointmentStatus,
        appointment.appointmentStatus ?? appointment.appointmentStatusName,
      ),
      idPatient: appointment.idPatient,
      idUser: appointment.idUser,
      procedures: appointment.procedures ?? [],
      totalPrice: appointment.totalPrice ?? 0,
      idPatientTreatment: appointment.idPatientTreatment ?? null,
      patientTreatmentName: appointment.patientTreatmentName ?? null,
      patientName,
      professionalName,
      procedureNames,
    };
  });
};

export const mapAppointmentsToCalendars = (
  appointments: IGetAppointmentsResponseData[] | undefined,
): TCalendarFilter[] => {
  if (!appointments?.length) return [];

  const byStatus = new Map<number, IGetAppointmentsResponseData>();
  for (const appointment of appointments) {
    if (!byStatus.has(appointment.idAppointmentStatus)) {
      byStatus.set(appointment.idAppointmentStatus, appointment);
    }
  }

  return Array.from(byStatus.values())
    .sort((a, b) => a.idAppointmentStatus - b.idAppointmentStatus)
    .map((appointment) => ({
      id: String(appointment.idAppointmentStatus),
      label: getAppointmentStatusLabel(
        appointment.idAppointmentStatus,
        appointment.appointmentStatus ?? appointment.appointmentStatusName,
      ),
      color: getAppointmentStatusColor(appointment.idAppointmentStatus),
      active: true,
    }));
};

export const mapAppointmentsToResources = (
  appointments: IGetAppointmentsResponseData[] | undefined,
): TCalendarResource[] => {
  if (!appointments?.length) return [];

  const byProfessional = new Map<number, IGetAppointmentsResponseData>();
  for (const appointment of appointments) {
    if (!byProfessional.has(appointment.idProfessional)) {
      byProfessional.set(appointment.idProfessional, appointment);
    }
  }

  return Array.from(byProfessional.values())
    .map((appointment) => ({
      id: String(appointment.idProfessional),
      label:
        fullName(
          appointment.professionalName,
          appointment.professionalSurname,
        ) || `Profesional ${appointment.idProfessional}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "es"));
};
