export interface IPostAppointmentFormRequest {
    idPatient: number;
    idUser: number;
    idService: number;
    idPatientTreatment?: number | null;
    price?: number | null;
    startAt: string;
    endAt: string;
    notes?: string;
}