import { z } from "zod";

export const ExportClinicalHistorySchema = z
  .object({
    idPatient: z
      .number()
      .nullable()
      .refine((value): value is number => value != null && value >= 1, {
        message: "Selecciona un paciente",
      }),
    from: z.string(),
    to: z.string(),
  })
  .refine(
    (data) => {
      const from = data.from.trim();
      const to = data.to.trim();
      if (!from || !to) return true;
      return from <= to;
    },
    {
      message: "La fecha de fin debe ser posterior a la de inicio",
      path: ["to"],
    },
  );

export type TExportClinicalHistoryForm = z.input<
  typeof ExportClinicalHistorySchema
>;
export type TExportClinicalHistoryValues = z.output<
  typeof ExportClinicalHistorySchema
>;

export const EXPORT_CLINICAL_HISTORY_DEFAULT_VALUES: TExportClinicalHistoryForm =
  {
    idPatient: null,
    from: "",
    to: "",
  };
