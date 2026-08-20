import { z } from "zod";
import { EXPORT_PAYMENT_FILTER } from "../consts";

export const ExportPaymentsSchema = z
  .object({
    filterType: z.string(),
    idPatient: z.number().nullable(),
    idAppointment: z.number().nullable(),
    idPatientTreatment: z.number().nullable(),
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
  )
  .superRefine((data, ctx) => {
    if (data.filterType === EXPORT_PAYMENT_FILTER.PATIENT) {
      if (data.idPatient == null || data.idPatient < 1) {
        ctx.addIssue({
          code: "custom",
          path: ["idPatient"],
          message: "Selecciona un paciente",
        });
      }
      return;
    }

    if (data.filterType === EXPORT_PAYMENT_FILTER.APPOINTMENT) {
      if (data.idPatient == null || data.idPatient < 1) {
        ctx.addIssue({
          code: "custom",
          path: ["idPatient"],
          message: "Selecciona un paciente",
        });
      }
      if (data.idAppointment == null || data.idAppointment < 1) {
        ctx.addIssue({
          code: "custom",
          path: ["idAppointment"],
          message: "Selecciona una cita",
        });
      }
      return;
    }

    if (data.filterType === EXPORT_PAYMENT_FILTER.PATIENT_TREATMENT) {
      if (data.idPatient == null || data.idPatient < 1) {
        ctx.addIssue({
          code: "custom",
          path: ["idPatient"],
          message: "Selecciona un paciente",
        });
      }
      if (data.idPatientTreatment == null || data.idPatientTreatment < 1) {
        ctx.addIssue({
          code: "custom",
          path: ["idPatientTreatment"],
          message: "Selecciona un plan de tratamiento",
        });
      }
    }
  });

export type TExportPaymentsForm = z.input<typeof ExportPaymentsSchema>;
export type TExportPaymentsValues = z.output<typeof ExportPaymentsSchema>;

export const EXPORT_PAYMENTS_DEFAULT_VALUES: TExportPaymentsForm = {
  filterType: EXPORT_PAYMENT_FILTER.NONE,
  idPatient: null,
  idAppointment: null,
  idPatientTreatment: null,
  from: "",
  to: "",
};
