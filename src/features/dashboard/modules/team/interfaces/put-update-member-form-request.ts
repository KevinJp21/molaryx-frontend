import { IPostCreateMemberFormRequest } from "./post-create-member-form-request";

export interface IPutUpdateMemberFormRequest
  extends Omit<IPostCreateMemberFormRequest, "idUserRole"> {
  idUser: number;
}
