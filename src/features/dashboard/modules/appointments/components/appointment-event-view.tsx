"use client";

import {
  AlignLeft,
  CalendarDays,
  ClipboardList,
  Clock,
  Edit2,
  Stethoscope,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components";
import { cn } from "@/lib/utils";
import { currencyFormat, formatDate } from "@/utils";
import { formatDuration, formatEventTime } from "../utils/format-time";
import { getAppointmentStatusChipClass } from "../consts/appointment-status";
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

const DetailField = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <div className={cn("min-w-0", className)}>
    <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
      {label}
    </p>
    <p className="mt-1 truncate text-sm font-semibold text-ink-50">{value}</p>
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
}: Props) => {
  const accent = event.color ?? statusColor;
  const statusChipClass = getAppointmentStatusChipClass(Number(event.calendarId));
  const hasProcedures = event.procedures.length > 0;
  const hasTreatment = Boolean(event.patientTreatmentName?.trim());
  const hasNotes = Boolean(event.description?.trim());
  const hasPrice = event.totalPrice > 0;

  return (
    <div className="flex max-h-[90vh] w-full flex-col overflow-hidden bg-ink-950">
      <div
        className="relative shrink-0 px-6 pb-5 pt-6"
        style={{
          background: `linear-gradient(160deg, ${accent}28 0%, ${accent}08 42%, transparent 100%)`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-6 top-0 h-px opacity-40"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />

        <div className="mb-5 flex items-start justify-between gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
            style={{
              backgroundColor: `${accent}22`,
              color: accent,
              boxShadow: `inset 0 0 0 1px ${accent}33`,
            }}
          >
            <span className="size-2 rounded-full" style={{ backgroundColor: accent }} />
            {event.statusLabel ?? statusLabel}
          </span>

          <div className="flex shrink-0 items-center gap-0.5">
            {canUpdate && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={onEdit}
                  title="Editar"
                  aria-label="Editar cita"
                  className="text-ink-400 hover:bg-ink-900/80"
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
              className="text-ink-400 hover:bg-ink-900/80"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <h1 className="mb-4 text-xl font-bold leading-snug tracking-tight text-ink-50 sm:text-2xl">
          {event.title || "Cita"}
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-ink-800/80 bg-ink-950/50 px-3 py-1.5 text-sm shadow-sm backdrop-blur-sm">
            <CalendarDays className="size-3.5 text-ink-400" />
            <span className="font-medium capitalize text-ink-100">
              {formatDate(event.start, "EEE, d 'de' MMM")}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-ink-800/80 bg-ink-950/50 px-3 py-1.5 text-sm shadow-sm backdrop-blur-sm">
            <Clock className="size-3.5 text-ink-400" />
            <span className="font-medium tabular-nums text-ink-100">
              {formatEventTime(event.start)} – {formatEventTime(event.end)}
            </span>
          </span>
          <span
            className="rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums"
            style={{ backgroundColor: `${accent}18`, color: accent }}
          >
            {formatDuration(event.start, event.end)}
          </span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto border-t border-ink-800/80 px-6 py-5">
        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          <DetailField
            label="N° de cita"
            value={`#${event.idAppointment}`}
          />
          <DetailField
            label="Profesional"
            value={event.professionalName || "Sin asignar"}
          />
        </div>

        <div
          className={cn(
            "mt-4 flex items-start gap-3 rounded-xl px-3.5 py-3",
            hasTreatment ? "bg-ink-900/60 ring-1 ring-ink-800" : "bg-ink-900/30",
          )}
        >
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg",
              hasTreatment ? "bg-accent-100 text-accent-600" : "bg-ink-850 text-ink-400",
            )}
          >
            <ClipboardList className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
              Plan de tratamiento
            </p>
            <p
              className={cn(
                "mt-0.5 truncate text-sm font-medium",
                hasTreatment ? "text-ink-50" : "text-ink-400",
              )}
            >
              {event.patientTreatmentName?.trim() || "Sin plan vinculado"}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center gap-1.5">
            <Tag className="size-3.5 text-ink-400" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
              Procedimientos
            </p>
          </div>
          {hasProcedures ? (
            <div className="flex flex-wrap gap-2">
              {event.procedures.map((procedure) => (
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
            <p className="text-sm text-ink-400">Sin procedimientos registrados</p>
          )}
        </div>

        {hasNotes && (
          <div className="mt-5">
            <div className="mb-2 flex items-center gap-1.5">
              <AlignLeft className="size-3.5 text-ink-400" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                Notas
              </p>
            </div>
            <p className="whitespace-pre-wrap rounded-xl bg-ink-900/50 px-3.5 py-3 text-sm leading-relaxed text-ink-200 ring-1 ring-ink-800/80">
              {event.description}
            </p>
          </div>
        )}

        {hasPrice && (
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-ink-800/80 pt-5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
              Precio total
            </span>
            <span className="text-lg font-bold tabular-nums tracking-tight text-ink-50">
              {currencyFormat(event.totalPrice)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
