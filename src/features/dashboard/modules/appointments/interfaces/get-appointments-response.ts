import { TBaseResponse } from "@/types";

export type IGetAppointmentsResponse = TBaseResponse<IGetAppointmentsResponseData[]>;

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
    idPatientTreatment?: number | null;
    patientTreatmentName?: string | null;
    price?: number | null;
    idAppointmentStatus: number;
    appointmentStatus?: string | null;
    appointmentStatusName?: string | null;
    startAt: string;
    endAt: string;
    notes: string |null;
};