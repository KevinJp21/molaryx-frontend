import { TBaseResponse, TPaginationResponse } from "@/types";

export interface IGetPatientTreatmentsResponse
  extends TBaseResponse<IGetPatientTreatmentsResponseData> {}

export interface IGetPatientTreatmentsResponseData
  extends TPaginationResponse<IPatientTreatmentItems> {}

export interface IPatientTreatmentItems {
  idPatientTreatment: number;
  idPatient: number;
  patientName: string;
  patientSurname: string;
  idTreatment: number;
  treatmentName: string;
  agreedPrice: number | null;
  idPaymentFrequency: number | null;
  paymentFrequency: string | null;
  periodicAmount: number | null;
  startAt: string;
  endAt: string | null;
  idPatientTreatmentStatus: number; 
  patientTreatmentStatus: string;
  notes: string | null;
}
