import { z } from "zod";
import { colombiaToUtcIso } from "@/utils";

const RECORDED_AT_TOLERANCE_MS = 5 * 60 * 1000;

const optionalNullableId = z
  .union([z.number(), z.null()])
  .transform((value) => (value != null && value > 0 ? value : null));

const optionalText = (maxLength: number, label: string) =>
  z
    .string()
    .nullable()
    .transform((value) => {
      const trimmed = value?.trim() ?? "";
      return trimmed === "" ? null : trimmed;
    })
    .refine((value) => value == null || value.length <= maxLength, {
      message: `${label} no puede tener más de ${maxLength} caracteres.`,
    });

const recordedAt = z
  .string()
  .min(1, "La fecha de registro es obligatoria")
  .refine(
    (value) =>
      new Date(colombiaToUtcIso(value)).getTime() <=
      Date.now() + RECORDED_AT_TOLERANCE_MS,
    { message: "La fecha de registro no puede ser futura." },
  );

const clinicalRecordProcedureSchema = z.object({
  idProcedure: z.number().min(1, "Selecciona un procedimiento"),
});

export const ClinicalRecordFormSchema = z
  .object({
    idPatient: z.number().min(1, "Selecciona un paciente"),
    idAppointment: optionalNullableId,
    idPatientTreatment: optionalNullableId,
    procedures: z.array(clinicalRecordProcedureSchema),
    recordedAt,
    reason: z
      .string()
      .trim()
      .min(1, "El motivo es obligatorio")
      .max(255, "El motivo no puede tener más de 255 caracteres."),
    diagnosis: optionalText(1000, "El diagnóstico"),
    evolution: optionalText(2000, "La evolución"),
    notes: optionalText(1000, "Las notas"),
  })
  .superRefine((data, ctx) => {
    const ids = data.procedures.map((p) => p.idProcedure);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: "custom",
        path: ["procedures"],
        message: "No se puede repetir el mismo procedimiento.",
      });
    }
  });

export type TClinicalRecordForm = z.input<typeof ClinicalRecordFormSchema>;
export type TClinicalRecordFormValues = z.output<typeof ClinicalRecordFormSchema>;

export const emptyClinicalRecordProcedure = () => ({
  idProcedure: 0,
});

export const CLINICAL_RECORD_FORM_DEFAULT_VALUES: TClinicalRecordForm = {
  idPatient: 0,
  idAppointment: null,
  idPatientTreatment: null,
  procedures: [],
  recordedAt: "",
  reason: "",
  diagnosis: null,
  evolution: null,
  notes: null,
};
