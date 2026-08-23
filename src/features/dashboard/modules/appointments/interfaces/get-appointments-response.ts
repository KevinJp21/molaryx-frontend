import { TBaseResponse } from "@/types";

export type IGetAppointmentsResponse = TBaseResponse<IGetAppointmentsResponseData[]>;

export interface IAppointmentProcedure {
    idProcedure: number;
    name: string;
    price: number;
    notes?: string | null;
}

export interface IGetAppointmentsResponseData {
    idAppointment: number;
    idPatient: number;
    patientName: string;
    patientSurname: string;
    idProfessional: number;
    idUser: number;
    professionalName: string;
    professionalSurname: string;
    procedures: IAppointmentProcedure[];
    totalPrice: number;
    idPatientTreatment?: number | null;
    patientTreatmentName?: string | null;
    idAppointmentStatus: number;
    appointmentStatus?: string | null;
    appointmentStatusName?: string | null;
    startAt: string;
    endAt: string;
    notes: string | null;
};
