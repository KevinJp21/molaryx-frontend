"use client";

import { CalendarDays, Clock, Edit2, Trash2, X } from "lucide-react";
import { Button } from "@/components";
import { currencyFormat, formatDate } from "@/utils";
import { formatDuration, formatEventTime } from "../utils/format-time";
import type { TAppointmentCalendarEvent } from "../types";

type Props = {
  event: TAppointmentCalendarEvent;
  statusColor: string;
  statusLabel: string;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  canUpdate?: boolean;
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 rounded-2xl border border-ink-800 bg-ink-900/40 p-4">
    {icon && (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-600">
        {icon}
      </span>
    )}
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
        {label}
      </p>
      <p className="truncate text-sm font-medium text-ink-50">{value}</p>
    </div>
  </div>
);

export const AppointmentEventView = ({
  event,
  statusColor,
  statusLabel,
  onEdit,
  onDelete,
  onClose,
  canUpdate = false,
}: Props) => (
  <div className="flex max-h-[90vh] w-full flex-col overflow-hidden bg-ink-950">
    <div
      className="relative px-6 pb-8 pt-6"
      style={{
        background: `linear-gradient(135deg, ${event.color ?? statusColor}22 0%, transparent 100%)`,
      }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="size-3 rounded-full"
            style={{ backgroundColor: event.color ?? statusColor }}
          />
          <span className="text-xs font-medium uppercase tracking-wider text-ink-200">
            {event.statusLabel ?? statusLabel}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {canUpdate && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onEdit}
                title="Editar"
                aria-label="Editar cita"
                className="text-ink-400"
              >
                <Edit2 className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onDelete}
                title="Eliminar"
                aria-label="Eliminar cita"
                className="text-ink-400 hover:bg-coral-500/10 hover:text-coral-600"
              >
                <Trash2 className="size-4" />
              </Button>
            </>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            title="Cerrar"
            aria-label="Cerrar"
            className="text-ink-400"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <h1 className="mb-3 text-2xl font-bold leading-tight text-ink-100">
        {event.title || "Cita"}
      </h1>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="flex items-center gap-2 rounded-lg border border-ink-800 bg-ink-950/60 px-3 py-1.5 backdrop-blur-sm">
          <CalendarDays className="size-4 text-ink-400" />
          <span className="font-medium capitalize text-ink-50">
            {formatDate(event.start, "EEE, d 'de' MMM")}
          </span>
        </span>
        <span className="flex items-center gap-2 rounded-lg border border-ink-800 bg-ink-950/60 px-3 py-1.5 backdrop-blur-sm">
          <Clock className="size-4 text-ink-400" />
          <span className="font-medium text-ink-50">
            {formatEventTime(event.start)} – {formatEventTime(event.end)}
          </span>
        </span>
        <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700">
          {formatDuration(event.start, event.end)}
        </span>
      </div>
      <div className="mt-6 space-y-3">
        <InfoRow label="N° de cita" value={`#${event.idAppointment}`} />
        <InfoRow
          label="Profesional"
          value={event.professionalName || "Sin asignar"}
        />
        <InfoRow
          label="Plan de tratamiento"
          value={event.patientTreatmentName || "Sin plan"}
        />
        <InfoRow
          label="Procedimientos"
          value={event.procedureNames || "Sin procedimientos"}
        />
        {event.totalPrice > 0 && (
          <InfoRow label="Precio total" value={currencyFormat(event.totalPrice)} />
        )}
      </div>
    </div>
  </div>
);
