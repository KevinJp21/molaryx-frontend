import { IDENTIFICATION_NUMBER_REGEX, NAME_REGEX, PHONE_REGEX } from "@/consts";
import { zodOptionalName } from "@/features/dashboard";
import { z } from "zod";

export const NewPatientSchema = z.object({
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

export type TNewPatientForm = z.input<typeof NewPatientSchema>;
