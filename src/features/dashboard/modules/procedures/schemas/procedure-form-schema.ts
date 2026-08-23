import { z } from "zod";

const optionalReferencePrice = z
  .union([z.number(), z.string(), z.null()])
  .transform((value) => {
    if (value === "" || value == null) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  })
  .refine((value) => value == null || value >= 0, {
    message: "El precio de referencia no puede ser negativo.",
  })
  .refine((value) => value == null || value === Number(value.toFixed(2)), {
    message: "El precio solo admite hasta 2 decimales.",
  });

export const ProcedureFormSchema = z.object({
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
  referencePrice: optionalReferencePrice,
  isActive: z.boolean(),
});

export type TProcedureForm = z.input<typeof ProcedureFormSchema>;
export type TProcedureFormValues = z.output<typeof ProcedureFormSchema>;

export const PROCEDURE_FORM_DEFAULT_VALUES: TProcedureForm = {
  name: "",
  description: "",
  referencePrice: null,
  isActive: true,
};
