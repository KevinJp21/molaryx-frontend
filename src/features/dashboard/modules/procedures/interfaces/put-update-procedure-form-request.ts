import { IPostCreateProcedureFormRequest } from ".";

export interface IPutUpdateProcedureFormRequest extends IPostCreateProcedureFormRequest {
    idProcedure: number;
    isActive: boolean;
}
