export const PAYMENT_CONTEXT = {
  APPOINTMENT: "appointment",
  PATIENT_TREATMENT: "patient_treatment",
} as const;

export type TPaymentContext =
  (typeof PAYMENT_CONTEXT)[keyof typeof PAYMENT_CONTEXT];

export const PAYMENT_CONTEXT_OPTIONS = [
  {
    value: PAYMENT_CONTEXT.APPOINTMENT,
    name: "Cita",
  },
  {
    value: PAYMENT_CONTEXT.PATIENT_TREATMENT,
    name: "Plan de tratamiento",
  },
];
