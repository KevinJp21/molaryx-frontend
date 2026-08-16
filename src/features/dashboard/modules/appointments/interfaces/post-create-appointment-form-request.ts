export interface IPostAppointmentFormRequest {
    idPatient: number;
    idUser: number;
    idService: number;
    startAt: string;
    endAt: string;
    notes?: string;
}