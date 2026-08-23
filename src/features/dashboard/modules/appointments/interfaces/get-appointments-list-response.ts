import { TBaseResponse, TPaginationResponse } from "@/types";
import type { IAppointmentProcedure } from "./get-appointments-response";

export interface IGetAppointmentsListResponse
  extends TBaseResponse<IGetAppointmentsListResponseData> {}

export interface IGetAppointmentsListResponseData
  extends TPaginationResponse<IAppointmentListItems> {}

export interface IAppointmentListItems {
  idAppointment: number;
  idPatient: number;
  patientName: string;
  patientSurname: string;
  idProfessional: number;
  idUser: number;
  professionalName: string;
  professionalSurname: string;
  procedures: IAppointmentProcedure[];
  totalPrice: number;
  idPatientTreatment?: number | null;
  patientTreatmentName?: string | null;
  idAppointmentStatus: number;
  appointmentStatus: string;
  startAt: string;
  endAt: string;
  notes: string | null;
}
