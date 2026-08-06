import { Path } from "react-hook-form";
import type { TSignUpForm } from "../schemas";

export const SIGN_UP_STEPS = [
  { label: "Plan" },
  { label: "Consultorio" },
  { label: "Tu cuenta" },
];

export const STEP_FIELDS: Record<number, Path<TSignUpForm>[]> = {
  1: ["idPlan", "idPromotion"],
  2: [
    "tenant.idIdentificationType",
    "tenant.identificationNumber",
    "tenant.consultoryName",
    "tenant.email",
    "tenant.phoneNumber",
    "tenant.address",
  ],
  3: [
    "owner.firstName",
    "owner.firstSurname",
    "owner.idIdentificationType",
    "owner.identificationNumber",
    "owner.username",
    "owner.email",
    "owner.phoneNumber",
    "owner.password",
    "owner.confirmPassword",
  ],
};

export const SIGN_UP_DEFAULT_VALUES: TSignUpForm = {
  idPlan: null,
  idPromotion: null,
  tenant: {
    idIdentificationType: null,
    identificationNumber: "",
    consultoryName: "",
    email: "",
    phoneNumber: "",
    address: "",
  },
  owner: {
    username: "",
    firstName: "",
    secondName: null,
    firstSurname: "",
    secondSurname: null,
    idIdentificationType: 1,
    identificationNumber: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
};
