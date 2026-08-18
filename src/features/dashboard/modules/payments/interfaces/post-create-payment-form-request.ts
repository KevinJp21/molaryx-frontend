export interface IPostCreatePaymentFormRequest {
  idPatient: number;
  idAppointment?: number | null;
  idPatientTreatment?: number | null;
  amount: number;
  paidAt: string;
  idPaymentMethod: number;
  notes?: string | null;
}
