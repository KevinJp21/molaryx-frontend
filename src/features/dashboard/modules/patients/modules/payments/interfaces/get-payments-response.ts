import { TBaseResponse, TPaginationResponse } from "@/types";

export interface IGetPaymentsResponse
  extends TBaseResponse<IGetPaymentsResponseData> {}

export interface IGetPaymentsResponseData
  extends TPaginationResponse<IPaymentItems> {}

export interface IPaymentItems {
  idPayment: number;
  idPatient: number;
  idAppointment: number | null;
  idPatientTreatment: number | null;
  amount: number;
  paidAt: string;
  idPaymentMethod: number;
  paymentMethod: string;
  notes: string | null;
}
