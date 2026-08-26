"use client";
//TODO: dejar diseño de tablas como paciente
import { useState } from "react";
import { CalendarDays, Clock, PlusIcon, Stethoscope } from "lucide-react";
import { BaseModal, Button } from "@/components";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import {
  checkCanCreate,
  checkCanView,
  checkCanViewPaymentsSummary,
} from "@/features/dashboard/utils";
import { PERMISSION_MODULES } from "@/features/dashboard/consts";
import { cn } from "@/lib/utils";
import { currencyFormat, formatDate, toColombiaDate } from "@/utils";
import { RelatedPaymentsTable } from "@/features/dashboard/components";
import {
  PaymentFormModal,
  PaymentSummaryByConcept,
} from "@/features/dashboard/modules/payments/components";
import {
  APPOINTMENT_STATUS,
  getAppointmentStatusChipClass,
  getAppointmentStatusColor,
  getAppointmentStatusLabel,
} from "../consts";
import { IAppointmentListItems } from "../interfaces";
import { formatDuration, formatEventTime } from "../utils/format-time";

type Props = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  appointment: IAppointmentListItems | null;
};

const Field = ({
  label,
  value,
  className,
}: {
  label: string;
  value?: string | null;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-1", className)}>
    <span className="text-xs text-ink-400">{label}</span>
    <span className="text-sm text-ink-100">{value?.trim() ? value : "—"}</span>
  </div>
);

const fullName = (...parts: Array<string | null | undefined>) =>
  parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

export const AppointmentDetailModal = ({
  open,
  onOpenChange,
  appointment,
}: Props) => {
  const { data: userData } = useAppSelector(selectGetUserData);
  const canViewPayments = checkCanView(
    userData?.permissions,
    PERMISSION_MODULES.PAYMENTS,
  );
  const canViewPaymentSummary = checkCanViewPaymentsSummary(userData?.permissions);
  const canCreatePayment = checkCanCreate(
    userData?.permissions,
    PERMISSION_MODULES.PAYMENTS,
  );
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentsRefreshKey, setPaymentsRefreshKey] = useState(0);

  if (!appointment) return null;

  const canReceivePayment =
    appointment.idAppointmentStatus !== APPOINTMENT_STATUS.CANCELLED &&
    appointment.idAppointmentStatus !== APPOINTMENT_STATUS.NO_SHOW;

  const patientName = fullName(
    appointment.patientName,
    appointment.patientSurname,
  );
  const professionalName = fullName(
    appointment.professionalName,
    appointment.professionalSurname,
  );
  const procedureNames =
    appointment.procedures?.map((p) => p.name).filter(Boolean).join(", ") ||
    "Cita";
  const start = toColombiaDate(appointment.startAt);
  const end = toColombiaDate(appointment.endAt);
  const statusColor = getAppointmentStatusColor(appointment.idAppointmentStatus);
  const statusLabel = getAppointmentStatusLabel(
    appointment.idAppointmentStatus,
    appointment.appointmentStatus,
  );
  const statusChipClass = getAppointmentStatusChipClass(
    appointment.idAppointmentStatus,
  );
  const hasProcedures = (appointment.procedures?.length ?? 0) > 0;
  const hasNotes = Boolean(appointment.notes?.trim());

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      icon={<CalendarDays className="size-3.5" strokeWidth={2} />}
      title={procedureNames}
      description="Detalle de la cita"
      className="max-w-4xl"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <div className="flex flex-col gap-6">
          <span
            className={cn(
              "inline-flex w-fit items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
              statusChipClass,
            )}
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: statusColor }}
            />
            {statusLabel}
          </span>

          <div className="grid grid-cols-1 gap-4 rounded-lg border border-ink-800 bg-ink-900/30 p-4 md:grid-cols-2">
            <Field label="N° de cita" value={`#${appointment.idAppointment}`} />
            <Field label="Paciente" value={patientName} />
            <Field label="Profesional" value={professionalName} />
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-ink-400">Procedimientos</span>
              {hasProcedures ? (
                <div className="flex flex-wrap gap-2">
                  {appointment.procedures.map((procedure) => (
                    <span
                      key={procedure.idProcedure}
                      className={cn(
                        "inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                        statusChipClass,
                      )}
                    >
                      <Stethoscope className="size-3 shrink-0 opacity-70" />
                      <span className="truncate">{procedure.name}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-ink-100">—</span>
              )}
            </div>
            <Field
              label="Plan de tratamiento"
              value={appointment.patientTreatmentName || "Sin plan"}
            />
            {appointment.totalPrice > 0 && (
              <Field
                label="Precio total"
                value={currencyFormat(appointment.totalPrice)}
              />
            )}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <span className="text-xs text-ink-400">Fecha y horario</span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-ink-800/80 bg-ink-950/50 px-3 py-1.5 text-sm">
                  <CalendarDays className="size-3.5 text-ink-400" />
                  <span className="font-medium capitalize text-ink-100">
                    {formatDate(appointment.startAt, "EEE, d 'de' MMM yyyy")}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-ink-800/80 bg-ink-950/50 px-3 py-1.5 text-sm">
                  <Clock className="size-3.5 text-ink-400" />
                  <span className="font-medium tabular-nums text-ink-100">
                    {formatEventTime(start)} – {formatEventTime(end)}
                  </span>
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums",
                    statusChipClass,
                  )}
                >
                  {formatDuration(start, end)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-ink-400">Notas</span>
            <div
              className={cn(
                "max-h-48 overflow-y-auto rounded-xl px-3.5 py-3 text-sm leading-relaxed ring-1 ring-ink-800/80",
                hasNotes
                  ? "whitespace-pre-wrap bg-ink-900/50 text-ink-200"
                  : "bg-ink-900/30 text-ink-400",
              )}
            >
              {hasNotes ? appointment.notes : "Sin notas registradas."}
            </div>
          </div>

          {(canViewPayments || canViewPaymentSummary) && (
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-medium text-ink-50">Pagos</h3>
                  <p className="text-xs text-ink-400">
                    Pagos registrados para esta cita
                  </p>
                </div>
                {canCreatePayment && canReceivePayment && (
                  <Button size="sm" onClick={() => setPaymentModalOpen(true)}>
                    <PlusIcon className="h-4 w-4" />
                    Registrar pago
                  </Button>
                )}
              </div>

              {canViewPaymentSummary && (
                <PaymentSummaryByConcept
                  open={open}
                  idAppointment={appointment.idAppointment}
                  refreshKey={paymentsRefreshKey}
                />
              )}

              {canViewPayments && (
                <RelatedPaymentsTable
                  idAppointment={appointment.idAppointment}
                  refreshKey={paymentsRefreshKey}
                  emptyMessage="Esta cita no tiene pagos registrados."
                />
              )}
            </section>
          )}
        </div>
      </div>

      <PaymentFormModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        idPatient={appointment.idPatient}
        idAppointment={appointment.idAppointment}
        contextLabel={`Pago de la cita de ${procedureNames}`}
        onSuccess={() => setPaymentsRefreshKey((key) => key + 1)}
      />
    </BaseModal>
  );
};
