export interface IPostCreatePatientTreatmentFormRequest {
  idPatient: number;
  idTreatment: number;
  agreedPrice?: number | null;
  idPaymentFrequency?: number | null;
  periodicAmount?: number | null;
  startAt: string;
  notes?: string | null;
}
