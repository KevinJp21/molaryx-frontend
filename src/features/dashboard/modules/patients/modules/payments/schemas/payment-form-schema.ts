import { z } from "zod";
import { colombiaToUtcIso } from "@/utils";
import { PAYMENT_CONTEXT } from "../consts";

const PAID_AT_TOLERANCE_MS = 5 * 60 * 1000;

const amount = z
  .union([z.number(), z.string(), z.null()])
  .transform((value) => {
    if (value === "" || value == null) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  })
  .refine((value) => value != null && value > 0, {
    message: "El monto debe ser mayor a 0.",
  })
  .refine((value) => value == null || value === Number(value.toFixed(2)), {
    message: "El monto solo admite hasta 2 decimales.",
  });

const paidAt = z
  .string()
  .min(1, "La fecha de pago es obligatoria")
  .refine(
    (value) =>
      new Date(colombiaToUtcIso(value)).getTime() <=
      Date.now() + PAID_AT_TOLERANCE_MS,
    { message: "La fecha de pago no puede ser futura." },
  );

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

export const PaymentFormSchema = z.object({
  paymentContext: z.string(),
  idAppointment: z.number().nullable(),
  idPatientTreatment: z.number().nullable(),
  amount,
  paidAt,
  idPaymentMethod: z.number().min(1, "Selecciona un método de pago"),
  notes: optionalNotes,
});

export const PatientPaymentFormSchema = PaymentFormSchema.superRefine(
  (data, ctx) => {
    if (data.paymentContext === PAYMENT_CONTEXT.APPOINTMENT) {
      if (data.idAppointment == null || data.idAppointment <= 0) {
        ctx.addIssue({
          code: "custom",
          path: ["idAppointment"],
          message: "Selecciona una cita",
        });
      }
      return;
    }

    if (data.paymentContext === PAYMENT_CONTEXT.PATIENT_TREATMENT) {
      if (data.idPatientTreatment == null || data.idPatientTreatment <= 0) {
        ctx.addIssue({
          code: "custom",
          path: ["idPatientTreatment"],
          message: "Selecciona un plan de tratamiento",
        });
      }
      return;
    }

    ctx.addIssue({
      code: "custom",
      path: ["paymentContext"],
      message: "Selecciona si el pago corresponde a una cita o a un plan",
    });
  },
);

export type TPaymentForm = z.input<typeof PaymentFormSchema>;
export type TPaymentFormValues = z.output<typeof PaymentFormSchema>;

export const PAYMENT_FORM_DEFAULT_VALUES: TPaymentForm = {
  paymentContext: "",
  idAppointment: null,
  idPatientTreatment: null,
  amount: null,
  paidAt: "",
  idPaymentMethod: 0,
  notes: null,
};
