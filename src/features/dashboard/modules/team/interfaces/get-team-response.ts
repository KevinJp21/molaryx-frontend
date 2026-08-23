import { TBaseResponse } from "@/types";
import { TPaginationResponse } from "@/types";

export interface IGetTeamResponse
  extends TBaseResponse<TPaginationResponse<IGetTeamResponseData>> {}

export interface IGetTeamResponseData {
  idProfessional: number | null;
  idUser: number;
  idUserRole: number;
  idUserStatus: number;
  statusName: string;
  username: string;
  firstName: string;
  secondName: string;
  firstSurname: string;
  secondSurname: string;
  identificationType: string;
  identificationNumber: string;
  birthDate: string;
  phoneNumber: string;
  email: string;
}
