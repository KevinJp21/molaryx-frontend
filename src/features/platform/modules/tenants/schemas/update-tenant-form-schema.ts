import {
  IDENTIFICATION_NUMBER_REGEX,
  ID_IDENTIFICATION_TYPE_NIT,
  NAME_REGEX,
  NIT_REGEX,
  PHONE_REGEX,
  USERNAME_REGEX,
} from "@/consts";
import { zodOptionalName } from "@/features/dashboard";
import { z } from "zod";

const optionalPositiveMoney = z
  .union([z.number(), z.string(), z.null()])
  .transform((value) => {
    if (value === "" || value == null) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  })
  .refine((value) => value == null || value > 0, {
    message: "El precio debe ser mayor a 0.",
  })
  .refine((value) => value == null || value === Number(value.toFixed(2)), {
    message: "El precio solo admite hasta 2 decimales.",
  });

const optionalPositiveInt = (message: string) =>
  z
    .union([z.number(), z.string(), z.null()])
    .transform((value) => {
      if (value === "" || value == null) return null;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    })
    .refine(
      (value) => value == null || (Number.isInteger(value) && value > 0),
      { message },
    );

const optionalDatetime = z
  .string()
  .nullable()
  .transform((value) => {
    const trimmed = value?.trim() ?? "";
    return trimmed === "" ? null : trimmed;
  });

export const UpdateTenantFormSchema = z
  .object({
    tenant: z
      .object({
        idIdentificationType: z.number().nullable(),
        identificationNumber: z.string(),
        consultoryName: z
          .string()
          .min(1, "El nombre del consultorio es obligatorio")
          .max(150, "El nombre ingresado es demasiado largo."),
        email: z.email("Ingrese un correo electrónico válido"),
        phoneNumber: z
          .string()
          .min(1, "El teléfono es obligatorio")
          .regex(PHONE_REGEX, "El teléfono no es válido"),
        address: z
          .string()
          .min(1, "La dirección es obligatoria")
          .max(255, "La dirección ingresada es demasiado larga."),
        idTenantStatus: z.number().min(1, "Selecciona un estado"),
      })
      .superRefine((data, ctx) => {
        const { idIdentificationType, identificationNumber } = data;
        if (!identificationNumber.trim()) return;
        if (idIdentificationType == null) {
          ctx.addIssue({
            code: "custom",
            path: ["idIdentificationType"],
            message: "Selecciona un tipo de identificación",
          });
          return;
        }

        const isNit = idIdentificationType === ID_IDENTIFICATION_TYPE_NIT;
        const isValid = isNit
          ? NIT_REGEX.test(identificationNumber)
          : IDENTIFICATION_NUMBER_REGEX.test(identificationNumber);

        if (!isValid) {
          ctx.addIssue({
            code: "custom",
            path: ["identificationNumber"],
            message: isNit
              ? "El NIT debe tener 10 dígitos"
              : "El número de identificación no es válido",
          });
        }
      }),
    owner: z
      .object({
        idUser: z.number().nullable(),
        username: z
          .string()
          .min(1, "El nombre de usuario es obligatorio")
          .max(30, "El usuario ingresado es demasiado largo.")
          .regex(USERNAME_REGEX, "Ingrese un nombre de usuario válido."),
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
        phoneNumber: z
          .string()
          .min(1, "El teléfono es obligatorio")
          .regex(PHONE_REGEX, "El teléfono no es válido"),
        email: z.email("Ingrese un correo electrónico válido"),
        idUserStatus: z.number().min(1, "Selecciona un estado de usuario"),
      })
      .nullable(),
    subscription: z
      .object({
        idTenantSubscription: z.number(),
        idTenantSubscriptionStatus: z
          .number()
          .min(1, "Selecciona un estado de suscripción"),
        price: optionalPositiveMoney,
        maxProfessionals: optionalPositiveInt(
          "El máximo de profesionales debe ser un entero mayor a 0.",
        ),
        maxAssistants: optionalPositiveInt(
          "El máximo de asistentes debe ser un entero mayor a 0.",
        ),
        maxPatients: optionalPositiveInt(
          "El máximo de pacientes debe ser un entero mayor a 0.",
        ),
        startsAt: optionalDatetime,
        endsAt: optionalDatetime,
      })
      .nullable()
      .superRefine((data, ctx) => {
        if (!data?.startsAt || !data.endsAt) return;
        if (new Date(data.endsAt).getTime() <= new Date(data.startsAt).getTime()) {
          ctx.addIssue({
            code: "custom",
            path: ["endsAt"],
            message:
              "La fecha de fin de la suscripción debe ser posterior a la de inicio.",
          });
        }
      }),
  })
  ;

export type TUpdateTenantForm = z.input<typeof UpdateTenantFormSchema>;
export type TUpdateTenantFormValues = z.output<typeof UpdateTenantFormSchema>;

export const UPDATE_TENANT_FORM_DEFAULT_VALUES: TUpdateTenantForm = {
  tenant: {
    idIdentificationType: null,
    identificationNumber: "",
    consultoryName: "",
    email: "",
    phoneNumber: "",
    address: "",
    idTenantStatus: 1,
  },
  owner: null,
  subscription: null,
};
