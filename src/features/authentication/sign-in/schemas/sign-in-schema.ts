import { z } from 'zod';

export const SignInSchema = z.object({
    email: z.email("Ingrese un correo electrónico válido"),
    password: z.string()
    .min(1, "La contraseña es obligatoria"),
})

export type TSignInForm = z.input<typeof SignInSchema>;