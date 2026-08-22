import { z } from "zod";
import { PAYMENT_FREQUENCY } from "../consts";

const optionalMoney = z
  .union([z.number(), z.string(), z.null()])
  .transform((value) => {
    if (value === "" || value == null) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  })
  .refine((value) => value == null || value > 0, {
    message: "El valor debe ser mayor a 0.",
  });

const optionalNotes = z
  .string()
  .nullable()
  .transform((value) => {
    const trimmed = value?.trim() ?? "";
    return trimmed === "" ? null : trimmed;
  })
  .refine((value) => value == null || value.length <= 500, {
    message: "Las notas no pueden tener más de 500 caracteres.",
  });

export const PatientTreatmentFormSchema = z
  .object({
    idPatient: z.number(),
    idTreatment: z.number().min(1, "Selecciona un tratamiento"),
    startAt: z.string().min(1, "La fecha de inicio es obligatoria"),
    agreedPrice: optionalMoney,
    idPaymentFrequency: z.number(),
    periodicAmount: optionalMoney,
    idPatientTreatmentStatus: z.number().optional(),
    notes: optionalNotes,
  })
  .superRefine((data, ctx) => {
    if (!data.idPatientTreatmentStatus && data.idPatient <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["idPatient"],
        message: "Selecciona un paciente",
      });
    }

    const frequency = data.idPaymentFrequency;
    const needsPeriodic =
      frequency !== PAYMENT_FREQUENCY.NONE &&
      frequency !== PAYMENT_FREQUENCY.ONE_TIME;

    if (needsPeriodic && data.periodicAmount == null) {
      ctx.addIssue({
        code: "custom",
        path: ["periodicAmount"],
        message: "El monto periódico es obligatorio para esta frecuencia.",
      });
    }

    if (
      data.periodicAmount != null &&
      (frequency === PAYMENT_FREQUENCY.NONE || !frequency)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["idPaymentFrequency"],
        message: "La frecuencia de pago es obligatoria cuando hay un monto periódico.",
      });
    }
  });

export type TPatientTreatmentForm = z.input<typeof PatientTreatmentFormSchema>;
export type TPatientTreatmentFormValues = z.output<
  typeof PatientTreatmentFormSchema
>;

export const PATIENT_TREATMENT_FORM_DEFAULT_VALUES: TPatientTreatmentForm = {
  idPatient: 0,
  idTreatment: 0,
  startAt: "",
  agreedPrice: null,
  idPaymentFrequency: PAYMENT_FREQUENCY.NONE,
  periodicAmount: null,
  notes: null,
};
