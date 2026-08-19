import { TBaseResponse, TPaginationResponse } from "@/types";

export interface IGetPaymentsResponse
  extends TBaseResponse<IGetPaymentsResponseData> {}

export interface IGetPaymentsResponseData
  extends TPaginationResponse<IPaymentItems> {}

export interface IPaymentItems {
  idPayment: number;
  idAppointment: number | null;
  idPatientTreatment: number | null;
  amount: number;
  paidAt: string;
  idPaymentMethod: number;
  paymentMethod: string;
  notes: string | null;
  patient: IPaymentPatient;
  appointment: IPaymentAppointment | null;
  patientTreatment: IPaymentPatientTreatment | null;
}

interface IPaymentPatient {
  idPatient: number;
  identificationType: string;
  identificationNumber: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
}


interface IPaymentAppointment {
  idAppointment: number;
  idService: number;
  serviceName: string;
  idAppointmentStatus: number;
  appointmentStatus: string;
  startAt: string;
  endAt: string;
  professionalName: string;
  professionalSurname: string;
}


interface IPaymentPatientTreatment {
  idPatientTreatment: number;
  idTreatment: number;
  treatmentName: string;
  agreedPrice: number | null;
  idPatientTreatmentStatus: number;
  patientTreatmentStatus: string;
  startAt: string;
  endAt: string | null;
}
