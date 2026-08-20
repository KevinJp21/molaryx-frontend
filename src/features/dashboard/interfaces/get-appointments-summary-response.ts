import { TBaseResponse } from "@/types";
export interface IGetAppointmentsSummaryResponse extends TBaseResponse<IGetAppointmentsSummaryResponseData> {}

export interface IGetAppointmentsSummaryResponseData {
    todayCount: number;
    byStatus: IByStatus[];
    topServices: ITopServices[];
    upcoming: IUpcoming[];
};

interface IByStatus {
    idAppointmentStatus: number;
    appointmentStatus: string;
    count: number;
};

interface ITopServices {
    idService: number;
    serviceName: string;
    count: number;
};

interface IUpcoming {
    idAppointment: number;
    startAt: string;
    endAt: string;
    patientName: string;
    patientSurname: string;
    serviceName: string;
    professionalName: string;
    professionalSurname: string;
    idAppointmentStatus: string;
    appointmentStatus: string;
};