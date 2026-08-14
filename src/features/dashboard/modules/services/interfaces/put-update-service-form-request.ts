import { IPostCreateServiceFormRequest } from ".";

export interface IPutUpdateServiceFormRequest extends IPostCreateServiceFormRequest {
    idService: number;
    isActive: boolean;

}