"use client";

import { useEffect } from "react";
import {
  Root as DialogRoot,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  Clock,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  CustomFormField,
  CustomFormSelect,
  CustomFormTextarea,
} from "@/components";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getPatients,
  selectGetPatients,
} from "@/store/patients/patiens-slice";
import {
  getServices,
  selectGetServices,
} from "@/store/services/services-slice";
import {
  getProfessionals,
  selectGetProfessionals,
} from "@/store/professionals/professionals-slice";
import {
  postCreateAppointment,
  resetPostCreateAppointment,
  selectPostCreateAppointment,
} from "@/store/appointments/appointments-slice";
import {
  getAppointmentStatusColor,
  getAppointmentStatusLabel,
} from "../consts/appointment-status";
import { USER_STATUS } from "../consts/user-status";
import {
  AppointmentFormSchema,
  buildAppointmentFormDefaults,
  type TAppointmentForm,
} from "../schemas";
import { formatDuration, formatEventTime } from "../utils/format-time";
import type { TAppointmentCalendarEvent } from "../types";

export type TAppointmentModalMode = "view" | "edit" | "create";

type Props = {
  open: boolean;
  mode: TAppointmentModalMode;
  event: TAppointmentCalendarEvent | null;
  initialDate?: Date;
  onModeChange: (mode: TAppointmentModalMode) => void;
  onClose: () => void;
  onSuccess?: () => void;
  onDelete: (event: TAppointmentCalendarEvent) => void;
};

const LIST_PARAMS = { Page: 1, Size: 100 } as const;

const fullName = (...parts: Array<string | null | undefined>) =>
  parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

const toFormValues = (
  event: TAppointmentCalendarEvent | null,
  initialDate?: Date,
): TAppointmentForm => {
  if (!event) return buildAppointmentFormDefaults(initialDate);

  return {
    idPatient: event.idPatient,
    idUser: event.idUser,
    idService: event.idService,
    startAt: formatDate(event.start, "yyyy-MM-dd'T'HH:mm"),
    endAt: formatDate(event.end, "yyyy-MM-dd'T'HH:mm"),
    notes: event.description ?? "",
  };
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

export const AppointmentEventModal = ({
  open,
  mode,
  event,
  initialDate,
  onModeChange,
  onClose,
  onSuccess,
  onDelete,
}: Props) => {
  const dispatch = useAppDispatch();
  const { data: patientsData, status: patientsStatus } =
    useAppSelector(selectGetPatients);
  const { data: servicesData, status: servicesStatus } =
    useAppSelector(selectGetServices);
  const { data: professionalsData, status: professionalsStatus } =
    useAppSelector(selectGetProfessionals);
  const {
    status: createStatus,
    message: createMessage,
    error: createError,
  } = useAppSelector(selectPostCreateAppointment);

  const isCreate = mode === "create";
  const isSubmitting = createStatus === "loading";
  const statusColor = getAppointmentStatusColor(
    event ? Number(event.calendarId) : undefined,
  );
  const statusLabel = getAppointmentStatusLabel(
    event ? Number(event.calendarId) : undefined,
    event?.statusLabel,
  );

  const methods = useForm<TAppointmentForm>({
    mode: "onTouched",
    resolver: zodResolver(AppointmentFormSchema),
    defaultValues: buildAppointmentFormDefaults(initialDate),
  });

  const { reset, handleSubmit, setValue, getValues, watch } = methods;
  const startAt = watch("startAt");
  const endAt = watch("endAt");

  useEffect(() => {
    if (!open) return;

    reset(toFormValues(event, initialDate));
    dispatch(getPatients({ ...LIST_PARAMS, IsActive: true }));
    dispatch(getServices({ ...LIST_PARAMS, IsActive: true }));
    dispatch(getProfessionals({ ...LIST_PARAMS, IdUserStatus: USER_STATUS.ACTIVE }));
  }, [open, event, initialDate, reset, dispatch]);

  useEffect(() => {
    if (!isCreate) return;

    if (createStatus === "error") {
      toast.error(createMessage, { description: createError });
      dispatch(resetPostCreateAppointment());
    }

    if (createStatus === "success") {
      toast.success(createMessage || "Cita creada correctamente");
      dispatch(resetPostCreateAppointment());
      onSuccess?.();
    }
  }, [
    createStatus,
    createMessage,
    createError,
    isCreate,
    dispatch,
    onSuccess,
  ]);

  const patientItems =
    patientsData?.items.map((patient) => ({
      value: patient.idPatient,
      name: fullName(
        patient.firstName,
        patient.secondName,
        patient.firstSurname,
        patient.secondSurname,
      ),
    })) ?? [];

  const serviceItems =
    servicesData?.items.map((service) => ({
      value: service.idService,
      name: service.name,
    })) ?? [];

  const professionalItems =
    professionalsData?.items.map((professional) => ({
      value: professional.idUser,
      name: fullName(
        professional.firstName,
        professional.secondName,
        professional.firstSurname,
        professional.secondSurname,
      ),
    })) ?? [];

  const durationLabel =
    startAt && endAt && !Number.isNaN(new Date(startAt).getTime())
      ? formatDuration(new Date(startAt), new Date(endAt))
      : null;

  const handleClose = () => {
    if (createStatus !== "idle") {
      dispatch(resetPostCreateAppointment());
    }
    reset(buildAppointmentFormDefaults());
    onClose();
  };

  const onSubmit = (data: TAppointmentForm) => {
    if (!isCreate) {
      toast.info(
        "La edición de citas se aplicará cuando el endpoint esté disponible.",
      );
      return;
    }

    dispatch(
      postCreateAppointment({
        idPatient: data.idPatient,
        idUser: data.idUser,
        idService: data.idService,
        startAt: new Date(data.startAt).toISOString(),
        endAt: new Date(data.endAt).toISOString(),
        notes: data.notes?.trim() || undefined,
      }),
    );
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
            <span className="text-xs font-medium uppercase tracking-wider text-ink-200">
              {event?.statusLabel ?? statusLabel}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onModeChange("edit")}
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
              onClick={() => event && onDelete(event)}
              title="Eliminar"
              aria-label="Eliminar cita"
              className="text-ink-400 hover:bg-coral-500/10 hover:text-coral-600"
            >
              <Trash2 className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleClose}
              title="Cerrar"
              aria-label="Cerrar"
              className="text-ink-400"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <h1 className="mb-3 text-2xl font-bold leading-tight text-ink-100">
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
        <div className="mt-6">
          <InfoRow
            label="Profesional"
            value={event?.professionalName || "Sin asignar"}
          />
        </div>
      </div>
    </div>
  );

  const renderFormMode = () => (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
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
              {isCreate ? "Nueva cita" : "Editar cita"}
            </h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleClose}
            aria-label="Cerrar"
            className="rounded-xl text-ink-400"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <CustomFormSelect
            name="idPatient"
            label="Paciente"
            placeholder={
              patientsStatus === "loading"
                ? "Cargando pacientes..."
                : "Selecciona un paciente"
            }
            items={patientItems}
            disabled={patientsStatus === "loading"}
          />

          <CustomFormSelect
            name="idUser"
            label="Profesional"
            placeholder={
              professionalsStatus === "loading"
                ? "Cargando profesionales..."
                : "Selecciona un profesional"
            }
            items={professionalItems}
            disabled={professionalsStatus === "loading"}
          />

          <CustomFormSelect
            name="idService"
            label="Servicio"
            placeholder={
              servicesStatus === "loading"
                ? "Cargando servicios..."
                : "Selecciona un servicio"
            }
            items={serviceItems}
            disabled={servicesStatus === "loading"}
          />
          <CustomFormField
            name="startAt"
            label="Inicio"
            type="datetime"
            placeholder="Fecha y hora de inicio"
            onChange={(date: Date | undefined) => {
              if (!date) return;
              const currentEnd = getValues("endAt");
              const currentStart = getValues("startAt");
              const previousStart = currentStart
                ? new Date(currentStart)
                : date;
              const previousEnd = currentEnd
                ? new Date(currentEnd)
                : new Date(date.getTime() + 60 * 60 * 1000);
              const duration = Math.max(
                15 * 60 * 1000,
                previousEnd.getTime() - previousStart.getTime(),
              );
              setValue(
                "endAt",
                formatDate(new Date(date.getTime() + duration), "yyyy-MM-dd'T'HH:mm"),
                { shouldDirty: true, shouldValidate: true },
              );
            }}
          />
          <CustomFormField
            name="endAt"
            label="Fin"
            type="datetime"
            placeholder="Fecha y hora de fin"
          />

          {durationLabel && (
            <div className="flex justify-center">
              <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700">
                {durationLabel}
              </span>
            </div>
          )}

          <CustomFormTextarea
            name="notes"
            label="Notas"
            placeholder="Agrega indicaciones o comentarios..."
            rows={4}
          />
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-ink-800 bg-ink-900/40 px-5 py-4">
          {!isCreate && event ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onDelete(event)}
              className="rounded-xl"
            >
              <Trash2 className="size-4" />
              Eliminar
            </Button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="rounded-xl text-ink-400"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="rounded-xl px-6"
            >
              {isSubmitting
                ? "Guardando..."
                : isCreate
                  ? "Crear cita"
                  : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );

  return (
    <DialogRoot
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose();
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
          {mode === "view" && event ? (
            renderViewMode()
          ) : (
            <div className="animate-in fade-in-0 zoom-in-95 duration-200">
              {renderFormMode()}
            </div>
          )}
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
};
