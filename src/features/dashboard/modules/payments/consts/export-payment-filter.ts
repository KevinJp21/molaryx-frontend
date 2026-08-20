export const EXPORT_PAYMENT_FILTER = {
  NONE: "",
  PATIENT: "patient",
  APPOINTMENT: "appointment",
  PATIENT_TREATMENT: "patient_treatment",
} as const;

export type TExportPaymentFilter =
  (typeof EXPORT_PAYMENT_FILTER)[keyof typeof EXPORT_PAYMENT_FILTER];

export const EXPORT_PAYMENT_FILTER_OPTIONS = [
  {
    value: EXPORT_PAYMENT_FILTER.PATIENT,
    name: "Paciente",
  },
  {
    value: EXPORT_PAYMENT_FILTER.APPOINTMENT,
    name: "Cita",
  },
  {
    value: EXPORT_PAYMENT_FILTER.PATIENT_TREATMENT,
    name: "Plan de tratamiento",
  },
];
