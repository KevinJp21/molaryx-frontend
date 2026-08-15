export type TCalendarView = "month" | "week" | "day" | "agenda" | "resource";

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
  patientName: string;
  professionalName: string;
  serviceName: string;
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
