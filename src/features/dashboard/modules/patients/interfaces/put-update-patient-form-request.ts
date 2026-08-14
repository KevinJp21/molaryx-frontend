import { IPostCreatePatientFormRequest } from "./";

export interface IPutUpdatePatientFormRequest extends IPostCreatePatientFormRequest {
    idPatient: number;
    isActive: boolean;

}