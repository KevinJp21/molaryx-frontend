export interface IPutUpdatePatientTreatmentFormRequest {
  idPatientTreatment: number;
  agreedPrice?: number | null;
  idPaymentFrequency?: number | null;
  periodicAmount?: number | null;
  startAt?: string;
  idTreatmentStatus?: number;
  notes?: string | null;
}
