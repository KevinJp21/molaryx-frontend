export interface IPostCreatePatientFormRequest {
    idIdentificationType: number;
    identificationNumber: string;
    firstName: string;
    secondName: string | null;
    firstSurname: string;
    secondSurname: string | null;
    birthDate: string;
    phoneNumber: string;
    email: string;
}