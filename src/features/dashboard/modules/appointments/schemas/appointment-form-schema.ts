import { z } from "zod";
import { format } from "date-fns";
import { APPOINTMENT_STATUS } from "../consts/appointment-status";

const requiredId = (message: string) => z.number().min(1, message);

export const AppointmentFormSchema = z
  .object({
    idPatient: requiredId("Selecciona un paciente"),
    idUser: requiredId("Selecciona un profesional"),
    idService: requiredId("Selecciona un servicio"),
    idAppointmentStatus: requiredId("Selecciona un estado"),
    startAt: z.string().min(1, "La fecha de inicio es obligatoria"),
    endAt: z.string().min(1, "La fecha de fin es obligatoria"),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
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

export const buildAppointmentFormDefaults = (
  initialDate?: Date,
): TAppointmentForm => {
  const start = initialDate ? new Date(initialDate) : new Date();
  const end = new Date(start);
  end.setHours(start.getHours() + 1);

  return {
    idPatient: 0,
    idUser: 0,
    idService: 0,
    idAppointmentStatus: APPOINTMENT_STATUS.PENDING,
    startAt: format(start, "yyyy-MM-dd'T'HH:mm"),
    endAt: format(end, "yyyy-MM-dd'T'HH:mm"),
    notes: "",
  };
};

export const APPOINTMENT_FORM_DEFAULT_VALUES = buildAppointmentFormDefaults();
