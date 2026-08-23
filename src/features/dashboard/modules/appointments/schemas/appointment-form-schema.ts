import { z } from "zod";
import { format } from "date-fns";
import { APPOINTMENT_STATUS } from "../consts/appointment-status";

const requiredId = (message: string) => z.number().min(1, message);

const procedurePrice = z
  .union([z.number(), z.string(), z.null()])
  .transform((value) => {
    if (value === "" || value == null) return 0;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  })
  .refine((value) => value >= 0, {
    message: "El precio no puede ser negativo.",
  })
  .refine((value) => value === Number(value.toFixed(2)), {
    message: "El precio solo admite hasta 2 decimales.",
  });

const appointmentProcedureSchema = z.object({
  idProcedure: requiredId("Selecciona un procedimiento"),
  price: procedurePrice,
  notes: z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim() ?? "";
      return trimmed === "" ? undefined : trimmed;
    })
    .refine((value) => value == null || value.length <= 500, {
      message: "Las notas del procedimiento son demasiado largas.",
    }),
});

export const AppointmentFormSchema = z
  .object({
    idPatient: requiredId("Selecciona un paciente"),
    idUser: requiredId("Selecciona un profesional"),
    procedures: z
      .array(appointmentProcedureSchema)
      .min(1, "Debe incluir al menos un procedimiento."),
    idPatientTreatment: z.number().nullable(),
    idAppointmentStatus: requiredId("Selecciona un estado"),
    startAt: z.string().min(1, "La fecha de inicio es obligatoria"),
    endAt: z.string().min(1, "La fecha de fin es obligatoria"),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const ids = data.procedures.map((p) => p.idProcedure);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: "custom",
        path: ["procedures"],
        message: "No se puede repetir el mismo procedimiento en la cita.",
      });
    }

    const hasTreatment = (data.idPatientTreatment ?? 0) > 0;

    if (hasTreatment && data.procedures.some((p) => p.price !== 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["procedures"],
        message:
          "Los procedimientos de una cita con plan de tratamiento deben tener precio 0.",
      });
    }

    if (!hasTreatment) {
      const total = data.procedures.reduce((sum, p) => sum + p.price, 0);
      if (total <= 0) {
        ctx.addIssue({
          code: "custom",
          path: ["procedures"],
          message:
            "La cita debe tener al menos un procedimiento con precio mayor a 0.",
        });
      }
    }

    const start = new Date(data.startAt);
    const end = new Date(data.endAt);

    if (Number.isNaN(start.getTime())) {
      ctx.addIssue({
        code: "custom",
        path: ["startAt"],
        message: "La fecha de inicio no es válida",
      });
      return;
    }

    if (Number.isNaN(end.getTime())) {
      ctx.addIssue({
        code: "custom",
        path: ["endAt"],
        message: "La fecha de fin no es válida",
      });
      return;
    }

    if (end <= start) {
      ctx.addIssue({
        code: "custom",
        path: ["endAt"],
        message: "La fecha de fin debe ser posterior al inicio",
      });
    }
  });

export type TAppointmentForm = z.input<typeof AppointmentFormSchema>;
export type TAppointmentFormValues = z.output<typeof AppointmentFormSchema>;

export const emptyAppointmentProcedure = () => ({
  idProcedure: 0,
  price: 0 as number | string | null,
  notes: "",
});

export const buildAppointmentFormDefaults = (
  initialDate?: Date,
): TAppointmentForm => {
  const start = initialDate ? new Date(initialDate) : new Date();
  const end = new Date(start);
  end.setHours(start.getHours() + 1);

  return {
    idPatient: 0,
    idUser: 0,
    procedures: [emptyAppointmentProcedure()],
    idPatientTreatment: null,
    idAppointmentStatus: APPOINTMENT_STATUS.PENDING,
    startAt: format(start, "yyyy-MM-dd'T'HH:mm"),
    endAt: format(end, "yyyy-MM-dd'T'HH:mm"),
    notes: "",
  };
};

export const APPOINTMENT_FORM_DEFAULT_VALUES = buildAppointmentFormDefaults();
