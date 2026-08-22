import { z } from "zod";

export const TreatmentFormSchema = z.object({
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

export type TTreatmentForm = z.input<typeof TreatmentFormSchema>;
export type TTreatmentFormValues = z.output<typeof TreatmentFormSchema>;

export const TREATMENT_FORM_DEFAULT_VALUES: TTreatmentForm = {
  name: "",
  description: null,
  isActive: true,
};
