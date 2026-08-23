import type { IAppointmentProcedure } from "./interfaces";

export type TCalendarView = "month" | "week" | "day" | "agenda" | "resource";

export type TAppointmentModalMode = "view" | "edit" | "create";

export type TScheduleOverride = { start: Date; end: Date };

export type TAppointmentCalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  color: string;
  calendarId: string;
  resourceId: string;
  statusLabel: string;
  idPatient: number;
  idUser: number;
  procedures: IAppointmentProcedure[];
  totalPrice: number;
  idPatientTreatment: number | null;
  patientTreatmentName: string | null;
  patientName: string;
  professionalName: string;
  procedureNames: string;
};

export type TCalendarFilter = {
  id: string;
  label: string;
  color?: string;
  active?: boolean;
};

export type TCalendarResource = {
  id: string;
  label: string;
  color?: string;
};
