import {
  IDENTIFICATION_NUMBER_REGEX,
  ID_IDENTIFICATION_TYPE_NIT,
  NAME_REGEX,
  NIT_REGEX,
  PASSWORD_REGEX,
  PHONE_REGEX,
  USERNAME_REGEX,
} from '@/consts';
import { z } from 'zod';

const optionalName = (message: string) =>
  z
    .string()
    .nullable()
    .refine(
      (value) => value == null || value.trim() === '' || NAME_REGEX.test(value.trim()),
      { message },
    );

export const SignUpSchema = z.object({
  idPlan: z
    .number()
    .nullable()
    .refine((value): value is number => value != null && value >= 1, {
      message: 'Selecciona un plan para continuar',
    }),
  idPromotion: z.number().nullable(),
  tenant: z
    .object({
      idIdentificationType: z
        .number()
        .nullable()
        .refine((value): value is number => value != null && value >= 1, {
          message: 'Selecciona un tipo de identificación',
        }),
      identificationNumber: z.string().min(1, 'El número de identificación es obligatorio'),
      consultoryName: z
        .string()
        .min(1, 'El nombre de consultorio es obligatorio')
        .regex(NAME_REGEX, 'El nombre de consultorio no es válido'),
      email: z
        .email('Ingrese un correo electrónico válido'),
      phoneNumber: z
        .string()
        .min(1, 'El teléfono es obligatorio')
        .regex(PHONE_REGEX, 'El teléfono no es válido'),
      address: z.string().min(1, 'La dirección es obligatoria'),
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
          code: 'custom',
          path: ['identificationNumber'],
          message: isNit
            ? 'El NIT debe tener 10 dígitos'
            : 'El número de identificación no es válido',
        });
      }
    }),
  owner: z
    .object({
      username: z
        .string()
        .min(1, 'El nombre de usuario es obligatorio')
        .regex(USERNAME_REGEX, 'El usuario de usuario no es válido'),
      firstName: z
        .string()
        .min(1, 'El nombre es obligatorio')
        .regex(NAME_REGEX, 'El nombre no es válido'),
      secondName: optionalName('El segundo nombre no es válido'),
      firstSurname: z
        .string()
        .min(1, 'El apellido es obligatorio')
        .regex(NAME_REGEX, 'El apellido no es válido'),
      secondSurname: optionalName('El segundo apellido no es válido'),
      idIdentificationType: z.number().min(1, 'Selecciona un tipo de identificación'),
      identificationNumber: z
        .string()
        .min(1, 'El número de identificación es obligatorio')
        .regex(IDENTIFICATION_NUMBER_REGEX, 'El número de identificación no es válido'),
      phoneNumber: z
        .string()
        .min(1, 'El teléfono es obligatorio')
        .regex(PHONE_REGEX, 'El teléfono no es válido'),
      email: z
        .email('Ingrese un correo electrónico válido'),
      password: z
        .string()
        .min(8, 'La contraseña debe tener mínimo 8 caracteres')
        .regex(PASSWORD_REGEX, 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
    }),
});

// Estado del formulario (permite null en campos aún no elegidos).
export type TSignUpForm = z.input<typeof SignUpSchema>;

// Payload válido tras pasar Zod.
export type TSignUpFormValues = z.output<typeof SignUpSchema>;
