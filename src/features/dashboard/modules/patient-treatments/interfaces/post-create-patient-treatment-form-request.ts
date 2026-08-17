export interface IPostCreatePatientTreatmentFormRequest {
  idPatient: string;
  idTreatment: number;
  agreedPrice?: number | null;
  idPaymentFrequency?: number | null;
  periodicAmount?: number | null;
  startAt: string;
  notes?: string | null;
}
