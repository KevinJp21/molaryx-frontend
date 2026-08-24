import { PASSWORD_REGEX } from "@/consts";
import { z } from "zod";

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener mínimo 8 caracteres")
      .regex(
        PASSWORD_REGEX,
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.",
      ),
    confirmPassword: z
      .string()
      .min(1, "La confirmación de la contraseña es obligatoria"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type TResetPasswordForm = z.input<typeof ResetPasswordSchema>;
