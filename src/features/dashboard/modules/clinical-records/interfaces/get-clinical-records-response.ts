import { TBaseResponse, TPaginationResponse } from "@/types";

export interface IGetClinicalRecordsResponse
  extends TBaseResponse<IGetClinicalRecordsResponseData> {}

export interface IGetClinicalRecordsResponseData
  extends TPaginationResponse<IClinicalRecordItems> {}

export interface IClinicalRecordItems {
  idClinicalRecord: number;
  idAppointment: number | null;
  idPatientTreatment: number | null;
  idProcedure: number | null;
  procedureName: string | null;
  recordedAt: string;
  reason: string;
  diagnosis: string | null;
  evolution: string | null;
  notes: string | null;
  patient: IClinicalRecordPatient;
  createdBy: IClinicalRecordCreatedBy;
  appointment: IClinicalRecordAppointment | null;
  patientTreatment: IClinicalRecordPatientTreatment | null;
}

export interface IClinicalRecordPatient {
  idPatient: number;
  identificationType: string;
  identificationNumber: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
}

export interface IClinicalRecordCreatedBy {
  idUser: number;
  name: string;
  surname: string;
}

export interface IClinicalRecordAppointment {
  idAppointment: number;
  procedureNames: string;
  idAppointmentStatus: number;
  appointmentStatus: string;
  startAt: string;
  endAt: string;
  professionalName: string;
  professionalSurname: string;
}

export interface IClinicalRecordPatientTreatment {
  idPatientTreatment: number;
  idTreatment: number;
  treatmentName: string;
  agreedPrice: number | null;
  idPatientTreatmentStatus: number;
  patientTreatmentStatus: string;
  startAt: string;
  endAt: string | null;
}
