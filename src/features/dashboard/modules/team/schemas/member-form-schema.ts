import {
  IDENTIFICATION_NUMBER_REGEX,
  NAME_REGEX,
  PHONE_REGEX,
  ROLES_IDS,
} from "@/consts";
import { zodOptionalName } from "@/features/dashboard";
import { z } from "zod";

export const MemberFormSchema = z.object({
  idUserRole: z.number().min(1, "Selecciona un rol"),
  username: z
    .string()
    .min(1, "El nombre de usuario es obligatorio")
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  idIdentificationType: z
    .number()
    .min(1, "Selecciona un tipo de identificación"),
  identificationNumber: z
    .string()
    .min(1, "El número de identificación es obligatorio")
    .regex(
      IDENTIFICATION_NUMBER_REGEX,
      "El número de identificación no es válido",
    ),
  firstName: z
    .string()
    .min(1, "El nombre es obligatorio")
    .regex(NAME_REGEX, "El nombre no es válido"),
  secondName: zodOptionalName("El segundo nombre no es válido"),
  firstSurname: z
    .string()
    .min(1, "El apellido es obligatorio")
    .regex(NAME_REGEX, "El apellido no es válido"),
  secondSurname: zodOptionalName("El segundo apellido no es válido"),
  birthDate: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  phoneNumber: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .regex(PHONE_REGEX, "El teléfono no es válido"),
  email: z.email("Ingrese un correo electrónico válido"),
});

export type TMemberForm = z.input<typeof MemberFormSchema>;

export const MEMBER_FORM_DEFAULT_VALUES: TMemberForm = {
  idUserRole: ROLES_IDS.PROFESSIONAL,
  username: "",
  idIdentificationType: 1,
  identificationNumber: "",
  firstName: "",
  secondName: null,
  firstSurname: "",
  secondSurname: null,
  birthDate: "",
  phoneNumber: "",
  email: "",
};
