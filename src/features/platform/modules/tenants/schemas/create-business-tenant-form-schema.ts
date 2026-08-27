import {
  IDENTIFICATION_NUMBER_REGEX,
  ID_IDENTIFICATION_TYPE_NIT,
  NAME_REGEX,
  NIT_REGEX,
  PASSWORD_REGEX,
  PHONE_REGEX,
  USERNAME_REGEX,
} from "@/consts";
import { zodOptionalName } from "@/features/dashboard";
import { z } from "zod";

const requiredPositiveMoney = z
  .union([z.number(), z.string(), z.null()])
  .transform((value) => {
    if (value === "" || value == null) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  })
  .refine((value) => value != null && value > 0, {
    message: "El precio debe ser mayor a 0.",
  })
  .refine((value) => value == null || value === Number(value.toFixed(2)), {
    message: "El precio solo admite hasta 2 decimales.",
  });

const requiredPositiveInt = (message: string) =>
  z
    .union([z.number(), z.string(), z.null()])
    .transform((value) => {
      if (value === "" || value == null) return null;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    })
    .refine((value) => value != null && Number.isInteger(value) && value > 0, {
      message,
    });

export const CreateBusinessTenantFormSchema = z.object({
  plan: z.object({
    price: requiredPositiveMoney,
    maxProfessionals: requiredPositiveInt(
      "El máximo de profesionales debe ser un entero mayor a 0.",
    ),
    maxAssistants: requiredPositiveInt(
      "El máximo de asistentes debe ser un entero mayor a 0.",
    ),
    maxPatients: requiredPositiveInt(
      "El máximo de pacientes debe ser un entero mayor a 0.",
    ),
  }),
  tenant: z
    .object({
      idIdentificationType: z
        .number()
        .nullable()
        .refine((value): value is number => value != null && value >= 1, {
          message: "Selecciona un tipo de identificación",
        }),
      identificationNumber: z
        .string()
        .min(1, "El número de identificación es obligatorio"),
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
    })
    .superRefine((data, ctx) => {
      const { idIdentificationType, identificationNumber } = data;
      if (!identificationNumber) return;

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
      birthDate: z
        .string()
        .min(1, "La fecha de nacimiento es obligatoria")
        .refine(
          (value) => {
            const [year, month, day] = value.split("-").map(Number);
            const today = new Date();
            let age = today.getFullYear() - year;
            const hasHadBirthday =
              today.getMonth() > month - 1 ||
              (today.getMonth() === month - 1 && today.getDate() >= day);

            if (!hasHadBirthday) age -= 1;
            return age >= 18;
          },
          { message: "El propietario debe ser mayor de 18 años." },
        ),
      phoneNumber: z
        .string()
        .min(1, "El teléfono es obligatorio")
        .regex(PHONE_REGEX, "El teléfono no es válido"),
      email: z.email("Ingrese un correo electrónico válido"),
      password: z
        .string()
        .min(8, "La contraseña debe tener mínimo 8 caracteres")
        .regex(
          PASSWORD_REGEX,
          "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.",
        ),
      confirmPassword: z.string().min(1, "Confirma la contraseña"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    }),
});

export type TCreateBusinessTenantForm = z.input<
  typeof CreateBusinessTenantFormSchema
>;
export type TCreateBusinessTenantFormValues = z.output<
  typeof CreateBusinessTenantFormSchema
>;

export const CREATE_BUSINESS_TENANT_FORM_DEFAULT_VALUES: TCreateBusinessTenantForm =
  {
    plan: {
      price: null,
      maxProfessionals: null,
      maxAssistants: null,
      maxPatients: null,
    },
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
      birthDate: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  };
