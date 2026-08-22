import { IPostAppointmentFormRequest } from "./post-create-appointment-form-request";

export interface IPutUpdateAppointmentFormRequest extends IPostAppointmentFormRequest {
    idAppointment: number;
    idAppointmentStatus: number;
}
