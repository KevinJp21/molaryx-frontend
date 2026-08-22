export interface IPutUpdatePatientTreatmentFormRequest {
  idPatientTreatment: number;
  agreedPrice?: number | null;
  idPaymentFrequency?: number | null;
  periodicAmount?: number | null;
  startAt?: string;
  idPatientTreatmentStatus?: number;
  notes?: string | null;
}
