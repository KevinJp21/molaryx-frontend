"use client";

import { useState } from "react";
import {
  Root as DialogRoot,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { format } from "date-fns";
import {
  AlignLeft,
  CalendarDays,
  Clock,
  Edit2,
  Stethoscope,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils";
import {
  APPOINTMENT_STATUS_OPTIONS,
  getAppointmentStatusColor,
  getAppointmentStatusLabel,
} from "../consts/appointment-status";
import { formatDuration, formatEventTime } from "../utils/format-time";
import type { TAppointmentCalendarEvent } from "../types";

export type TAppointmentModalMode = "view" | "edit" | "create";

type FormState = {
  title: string;
  start: Date;
  end: Date;
  notes: string;
  statusId: string;
};

type Props = {
  open: boolean;
  mode: TAppointmentModalMode;
  event: TAppointmentCalendarEvent | null;
  initialDate?: Date;
  onModeChange: (mode: TAppointmentModalMode) => void;
  onClose: () => void;
  onSave: (values: FormState & { id?: string }) => void;
  onDelete: (event: TAppointmentCalendarEvent) => void;
};

const toInputValue = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm");

const buildInitialState = (
  event: TAppointmentCalendarEvent | null,
  initialDate?: Date,
): FormState => {
  if (event) {
    return {
      title: event.title,
      start: event.start,
      end: event.end,
      notes: event.description ?? "",
      statusId: event.calendarId,
    };
  }

  const start = initialDate ?? new Date();
  const end = new Date(start);
  end.setHours(start.getHours() + 1);

  return { title: "", start, end, notes: "", statusId: "1" };
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 rounded-2xl border border-ink-800 bg-ink-900/40 p-4">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-600">
      {icon}
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
        {label}
      </p>
      <p className="truncate text-sm font-medium text-ink-50">{value}</p>
    </div>
  </div>
);

export const AppointmentEventModal = ({
  open,
  mode,
  event,
  initialDate,
  onModeChange,
  onClose,
  onSave,
  onDelete,
}: Props) => {
  const [form, setForm] = useState<FormState>(() =>
    buildInitialState(event, initialDate),
  );

  // El formulario se reinicia cada vez que el modal se abre con otra cita o fecha.
  const formKey = open
    ? `${event?.id ?? "new"}-${initialDate?.getTime() ?? 0}`
    : "closed";
  const [syncedFormKey, setSyncedFormKey] = useState(formKey);

  if (formKey !== syncedFormKey) {
    setSyncedFormKey(formKey);
    if (open) setForm(buildInitialState(event, initialDate));
  }

  const statusColor = getAppointmentStatusColor(Number(form.statusId));
  const statusLabel = getAppointmentStatusLabel(
    Number(form.statusId),
    event?.statusLabel,
  );

  const handleDateChange = (field: "start" | "end", value: string) => {
    const nextDate = new Date(value);
    if (Number.isNaN(nextDate.getTime())) return;

    setForm((current) => {
      if (field === "start") {
        const duration = current.end.getTime() - current.start.getTime();
        return {
          ...current,
          start: nextDate,
          end: new Date(nextDate.getTime() + duration),
        };
      }
      return nextDate < current.start
        ? { ...current, start: nextDate, end: nextDate }
        : { ...current, end: nextDate };
    });
  };

  const renderViewMode = () => (
    <div className="flex max-h-[90vh] w-full flex-col overflow-hidden bg-ink-950">
      <div
        className="relative px-6 pb-8 pt-6"
        style={{
          background: `linear-gradient(135deg, ${event?.color ?? statusColor}22 0%, transparent 100%)`,
        }}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="size-3 rounded-full"
              style={{ backgroundColor: event?.color ?? statusColor }}
            />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-400">
              {event?.statusLabel ?? statusLabel}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onModeChange("edit")}
              title="Editar"
              aria-label="Editar cita"
              className="rounded-lg p-2 text-ink-400 transition-all hover:bg-ink-900 hover:text-ink-50"
            >
              <Edit2 className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => event && onDelete(event)}
              title="Eliminar"
              aria-label="Eliminar cita"
              className="rounded-lg p-2 text-ink-400 transition-all hover:bg-coral-500/10 hover:text-coral-600"
            >
              <Trash2 className="size-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Cerrar"
              aria-label="Cerrar"
              className="rounded-lg p-2 text-ink-400 transition-all hover:bg-ink-900 hover:text-ink-50"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <h1 className="mb-3 text-2xl font-bold leading-tight text-ink-50">
          {event?.title || "Cita"}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="flex items-center gap-2 rounded-lg border border-ink-800 bg-ink-950/60 px-3 py-1.5 backdrop-blur-sm">
            <CalendarDays className="size-4 text-ink-400" />
            <span className="font-medium capitalize text-ink-50">
              {event ? formatDate(event.start, "EEE, d 'de' MMM") : "—"}
            </span>
          </span>
          <span className="flex items-center gap-2 rounded-lg border border-ink-800 bg-ink-950/60 px-3 py-1.5 backdrop-blur-sm">
            <Clock className="size-4 text-ink-400" />
            <span className="font-medium text-ink-50">
              {event
                ? `${formatEventTime(event.start)} – ${formatEventTime(event.end)}`
                : "—"}
            </span>
          </span>
          {event && (
            <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700">
              {formatDuration(event.start, event.end)}
            </span>
          )}
        </div>
      </div>

      <div className="pb-6" />
    </div>
  );

  const renderEditMode = () => (
    <form
      onSubmit={(submitEvent) => {
        submitEvent.preventDefault();
        onSave({ ...form, id: event?.id });
      }}
      className="flex max-h-[85vh] w-full flex-col overflow-hidden bg-ink-950"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-ink-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className="size-5 rounded-full"
            style={{
              backgroundColor: statusColor,
              boxShadow: `0 0 0 2px var(--ink-950), 0 0 0 4px ${statusColor}60`,
            }}
          />
          <h2 className="text-lg font-semibold text-ink-50">
            {mode === "edit" ? "Editar cita" : "Nueva cita"}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="rounded-xl p-2 text-ink-400 transition-all hover:bg-ink-900 hover:text-ink-50"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-5 px-5 py-4">
          <input
            type="text"
            required
            value={form.title}
            onChange={(inputEvent) =>
              setForm((current) => ({ ...current, title: inputEvent.target.value }))
            }
            placeholder="Paciente · servicio"
            className="w-full border-0 border-b-2 border-transparent bg-transparent px-0 py-2 text-xl font-semibold text-ink-50 transition-all placeholder:text-ink-400/60 focus:border-accent-500 focus:outline-none"
          />

          {event && (
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow
                icon={<User className="size-5" />}
                label="Paciente"
                value={event.patientName || "Sin registrar"}
              />
              <InfoRow
                icon={<Stethoscope className="size-5" />}
                label="Profesional"
                value={event.professionalName || "Sin asignar"}
              />
              <div className="sm:col-span-2">
                <InfoRow
                  icon={<Tag className="size-5" />}
                  label="Servicio"
                  value={event.serviceName || "Sin servicio"}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 rounded-2xl border border-ink-800 bg-ink-900/40 p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-600">
              <Clock className="size-5" />
            </span>
            <div className="grid min-w-0 flex-1 grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="appointment-start"
                  className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-ink-400"
                >
                  Inicio
                </label>
                <input
                  id="appointment-start"
                  type="datetime-local"
                  value={toInputValue(form.start)}
                  onChange={(inputEvent) =>
                    handleDateChange("start", inputEvent.target.value)
                  }
                  className="w-full rounded-xl border border-ink-700 bg-ink-950 px-3 py-2 text-sm font-medium text-ink-50 transition-all focus:border-accent-500 focus:outline-none focus:ring-[3px] focus:ring-accent-500/20"
                />
              </div>
              <div>
                <label
                  htmlFor="appointment-end"
                  className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-ink-400"
                >
                  Fin
                </label>
                <input
                  id="appointment-end"
                  type="datetime-local"
                  value={toInputValue(form.end)}
                  onChange={(inputEvent) =>
                    handleDateChange("end", inputEvent.target.value)
                  }
                  className="w-full rounded-xl border border-ink-700 bg-ink-950 px-3 py-2 text-sm font-medium text-ink-50 transition-all focus:border-accent-500 focus:outline-none focus:ring-[3px] focus:ring-accent-500/20"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700">
              {formatDuration(form.start, form.end)}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlignLeft className="size-4 text-ink-400" />
              <span className="text-sm font-medium text-ink-50">Notas</span>
            </div>
            <textarea
              value={form.notes}
              onChange={(inputEvent) =>
                setForm((current) => ({ ...current, notes: inputEvent.target.value }))
              }
              placeholder="Agrega indicaciones o comentarios..."
              className="min-h-25 w-full resize-none rounded-xl border border-ink-800 bg-ink-900/40 px-4 py-3 text-sm text-ink-50 transition-all placeholder:text-ink-400 focus:border-accent-500 focus:outline-none focus:ring-[3px] focus:ring-accent-500/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-200" htmlFor="status-select">
              Estado
            </label>
            <Select
              value={form.statusId}
              onValueChange={(value) =>
                setForm((current) => ({ ...current, statusId: value }))
              }
            >
              <SelectTrigger id="status-select" className="h-auto w-full min-w-0">
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: statusColor }}
                  />
                  <span className="truncate">{statusLabel}</span>
                </span>
              </SelectTrigger>
              <SelectContent className="w-(--radix-select-trigger-width)">
                {APPOINTMENT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.id} value={String(option.id)}>
                    <span className="flex items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                      {option.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-ink-400">
              Abre el listado para ver qué significa cada color de la agenda.
            </p>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-ink-800 bg-ink-900/40 px-5 py-4">
        {mode === "edit" && event ? (
          <button
            type="button"
            onClick={() => onDelete(event)}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-coral-600 transition-all hover:bg-coral-500/10"
          >
            <Trash2 className="size-4" />
            Eliminar
          </button>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-ink-400 transition-all hover:bg-ink-900 hover:text-ink-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-xl bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-accent-400 hover:shadow-lg hover:shadow-accent-500/20 active:scale-95"
          >
            {mode === "edit" ? "Guardar cambios" : "Crear cita"}
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <DialogRoot
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogPortal>
        <DialogOverlay
          className={cn(
            "fixed inset-0 z-40 bg-ink-50/20 backdrop-blur-[2px]",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          )}
        />
        <DialogContent
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-ink-750 bg-ink-950 text-ink-100 shadow-2xl",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          )}
        >
          <DialogTitle className="sr-only">
            {mode === "view"
              ? "Detalle de la cita"
              : mode === "edit"
                ? "Editar cita"
                : "Nueva cita"}
          </DialogTitle>
          {mode === "view" && event ? renderViewMode() : renderEditMode()}
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
};
