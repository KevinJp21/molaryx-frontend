export interface IPostCreateMemberFormRequest {
    idUserRole: number;
    username: string;
    firstName: string;
    secondName: string | null;
    firstSurname: string;
    secondSurname: string | null;
    idIdentificationType: number;
    identificationNumber: string;
    birthDate: string;
    phoneNumber: string;
    email: string;
}