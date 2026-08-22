import { IPostCreateTreatmentFormRequest } from ".";

export interface IPutUpdateTreatmentFormRequest extends IPostCreateTreatmentFormRequest {
    idTreatment: number;
    isActive: boolean;

}