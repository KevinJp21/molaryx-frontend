"use client";

import { CalendarDays } from "lucide-react";
import { Badge, BaseModal } from "@/components";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import { hasPermissionCode } from "@/features/dashboard/utils";
import { formatDate } from "@/utils";
import { PaymentsTable } from "@/features/dashboard/modules/patients/modules/payments/components";
import { getAppointmentStatusLabel } from "../consts";
import { IAppointmentListItems } from "../interfaces";
import { formatDuration } from "../utils/format-time";
import { toColombiaDate } from "@/utils";

type Props = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  appointment: IAppointmentListItems | null;
};

const Field = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-ink-400">{label}</span>
    <span className="text-sm text-ink-100">{value?.trim() ? value : "—"}</span>
  </div>
);

const fullName = (...parts: Array<string | null | undefined>) =>
  parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

const statusBadgeVariant = (id: number) => {
  if (id === 2 || id === 4) return "success" as const;
  if (id === 5 || id === 6) return "destructive" as const;
  if (id === 3) return "secondary" as const;
  return "muted" as const;
};

export const AppointmentDetailModal = ({
  open,
  onOpenChange,
  appointment,
}: Props) => {
  const { data: userData } = useAppSelector(selectGetUserData);
  const canViewPayments = hasPermissionCode(
    userData?.permissions,
    "PAYMENTS",
    "GET_PAYMENTS",
  );

  if (!appointment) return null;

  const patientName = fullName(
    appointment.patientName,
    appointment.patientSurname,
  );
  const professionalName = fullName(
    appointment.professionalName,
    appointment.professionalSurname,
  );
  const start = toColombiaDate(appointment.startAt);
  const end = toColombiaDate(appointment.endAt);

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      icon={<CalendarDays className="size-3.5" strokeWidth={2} />}
      title={appointment.serviceName}
      description="Detalle de la cita"
      className="max-w-4xl"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 rounded-lg border border-ink-800 bg-ink-900/30 p-4 md:grid-cols-2">
            <Field label="Paciente" value={patientName} />
            <Field label="Profesional" value={professionalName} />
            <Field label="Servicio" value={appointment.serviceName} />
            <div className="flex flex-col gap-1">
              <span className="text-xs text-ink-400">Estado</span>
              <Badge variant={statusBadgeVariant(appointment.idAppointmentStatus)}>
                {getAppointmentStatusLabel(
                  appointment.idAppointmentStatus,
                  appointment.appointmentStatus,
                )}
              </Badge>
            </div>
            <Field
              label="Fecha"
              value={formatDate(appointment.startAt, "EEE, d MMM yyyy")}
            />
            <Field
              label="Horario"
              value={`${formatDate(toColombiaDate(start), "h:mm a")} – ${formatDate(toColombiaDate(end), "h:mm a")} · ${formatDuration(toColombiaDate(start), toColombiaDate(end))}`}
            />
            <Field label="Notas" value={appointment.notes} />
          </div>

          <section className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-medium text-ink-50">Pagos</h3>
              <p className="text-xs text-ink-400">
                Pagos registrados para esta cita
              </p>
            </div>
            {canViewPayments ? (
              <PaymentsTable
                idAppointment={appointment.idAppointment}
                emptyMessage="Esta cita no tiene pagos registrados."
              />
            ) : (
              <p className="text-sm text-ink-400">
                No tienes permiso para ver los pagos de esta cita.
              </p>
            )}
          </section>
        </div>
      </div>
    </BaseModal>
  );
};
