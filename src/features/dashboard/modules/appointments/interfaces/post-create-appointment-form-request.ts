export interface IPostAppointmentFormRequest {
    idPatient: number;
    idUser: number;
    idService: number;
    idPatientTreatment?: number | null;
    startAt: string;
    endAt: string;
    notes?: string;
}