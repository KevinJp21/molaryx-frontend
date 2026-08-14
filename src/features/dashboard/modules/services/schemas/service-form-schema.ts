import { z } from "zod";

export const ServiceFormSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio"),
  description: z
    .string()
    .nullable()
    .transform((value) => {
      const trimmed = value?.trim() ?? "";
      return trimmed === "" ? null : trimmed;
    })
    .refine((value) => value == null || value.length <= 500, {
      message: "La descripción no puede tener más de 500 caracteres",
    }),
  isActive: z.boolean(),
});

export type TServiceForm = z.input<typeof ServiceFormSchema>;
export type TServiceFormValues = z.output<typeof ServiceFormSchema>;

export const SERVICE_FORM_DEFAULT_VALUES: TServiceForm = {
  name: "",
  description: "",
  isActive: true,
};
