export interface IPostCreateClinicalRecordFormRequest {
  idPatient: number;
  idAppointment?: number | null;
  idPatientTreatment?: number | null;
  idService?: number | null;
  recordedAt: string;
  reason: string;
  diagnosis?: string | null;
  evolution?: string | null;
  notes?: string | null;
}
