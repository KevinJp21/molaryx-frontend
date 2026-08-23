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
  secondName: string | null;
  firstSurname: string;
  secondSurname: string | null;
  identificationType: string;
  idIdentificationType: number;
  identificationNumber: string;
  birthDate: string;
  phoneNumber: string;
  email: string;
}
