import { z } from 'zod';

export const SignUpSchema = z
  .object({
    idPlan: z
      .number()
      .nullable()
      .refine((value): value is number => value != null && value >= 1, {
        message: 'Selecciona un plan para continuar',
      }),
    idPromotion: z.number().nullable(),
    tenant: z.object({
      idIdentificationType: z
        .number()
        .nullable()
        .refine((value): value is number => value != null && value >= 1, {
          message: 'Selecciona un tipo de identificación',
        }),
      identificationNumber: z.string().min(1, 'El número de identificación es obligatorio'),
      consultoryName: z.string().min(3, 'Debe tener al menos 3 caracteres'),
      email: z.email('El correo electrónico no es válido'),
      phoneNumber: z.string().min(7, 'El teléfono no es válido'),
      address: z.string().min(1, 'La dirección es obligatoria'),
    }),
    owner: z.object({
      username: z.string().min(1, 'El usuario es obligatorio'),
      firstName: z.string().min(1, 'El nombre es obligatorio'),
      secondName: z.string().nullable(),
      firstSurname: z.string().min(1, 'El apellido es obligatorio'),
      secondSurname: z.string().nullable(),
      idIdentificationType: z.number().min(1, 'Selecciona un tipo de identificación'),
      identificationNumber: z.string().min(1, 'El número de identificación es obligatorio'),
      phoneNumber: z.string().min(7, 'El teléfono no es válido'),
      email: z.email('El correo electrónico no es válido'),
      password: z.string().min(8, 'La contraseña debe tener mínimo 8 caracteres'),
      confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
    }),
  })
  .refine((data) => data.owner.password === data.owner.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['owner', 'confirmPassword'],
  });

/** Estado del formulario (permite null en campos aún no elegidos). */
export type TSignUpForm = z.input<typeof SignUpSchema>;

/** Payload válido tras pasar Zod. */
export type TSignUpFormValues = z.output<typeof SignUpSchema>;
