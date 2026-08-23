export interface IAppointmentProcedureItem {
    idProcedure: number;
    price: number;
    notes?: string | null;
}

export interface IPostAppointmentFormRequest {
    idPatient: number;
    idUser: number;
    procedures: IAppointmentProcedureItem[];
    idPatientTreatment?: number | null;
    startAt: string;
    endAt: string;
    notes?: string;
}
