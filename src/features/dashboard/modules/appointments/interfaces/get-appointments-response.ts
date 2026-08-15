import { TBaseResponse } from "@/types";

export interface IGetAppointmentsResponse extends TBaseResponse<IGetAppointmentsResponseData[]> {}

export interface IGetAppointmentsResponseData {
    idAppointment: number;
    idPatient: number;
    patientName: string;
    patientSurname: string;
    idProfessional: number;
    idUser: number;
    professionalName: string;
    professionalSurname: string;
    idService: number;
    serviceName: string;
    idAppointmentStatus: number;
    appointmentStatusName: string;
    startAt: string;
    endAt: string;
    notes: string |null;
};