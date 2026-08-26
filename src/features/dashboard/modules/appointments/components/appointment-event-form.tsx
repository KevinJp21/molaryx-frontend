"use client";

import {
  AlignLeft,
  CircleDot,
  CalendarDays,
  Clock,
  Plus,
  Stethoscope,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  FormProvider,
  useFieldArray,
  useFormContext,
  useWatch,
  type UseFormReturn,
} from "react-hook-form";
import {
  Button,
  CustomFormField,
  CustomFormSelect,
  CustomFormTextarea,
} from "@/components";
import { cn } from "@/lib/utils";
import { currencyFormat, formatDate } from "@/utils";
import {
  getAppointmentStatusChipClass,
  getAppointmentStatusLabel,
} from "../consts/appointment-status";
import {
  emptyAppointmentProcedure,
  type TAppointmentForm,
} from "../schemas";
import type { TAppointmentCalendarEvent } from "../types";

type SelectItem = { value: number; name: string };

type Props = {
  methods: UseFormReturn<TAppointmentForm>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void> | void;
  isCreate: boolean;
  isEdit: boolean;
  isSubmitting: boolean;
  statusColor: string;
  statusLabel: string;
  durationLabel: string | null;
  event: TAppointmentCalendarEvent | null;
  onClose: () => void;
  onDelete: (event: TAppointmentCalendarEvent) => void;
  canUpdate?: boolean;
  patientItems: SelectItem[];
  patientsStatus: string;
  professionalItems: SelectItem[];
  professionalsStatus: string;
  procedureItems: SelectItem[];
  procedureReferencePriceById: Map<number, number | null>;
  proceduresStatus: string;
  statusItems: SelectItem[];
  searchPatients: (query: string) => void;
  searchProfessionals: (query: string) => void;
  searchProcedures: (query: string) => void;
  patientsPagination: {
    onLoadMore: () => void;
    hasMore: boolean;
    isLoadingMore: boolean;
  };
  patientsSearching: boolean;
  professionalsPagination: {
    onLoadMore: () => void;
    hasMore: boolean;
    isLoadingMore: boolean;
  };
  professionalsSearching: boolean;
  proceduresPagination: {
    onLoadMore: () => void;
    hasMore: boolean;
    isLoadingMore: boolean;
  };
  proceduresSearching: boolean;
  treatmentsPagination: {
    onLoadMore: () => void;
    hasMore: boolean;
    isLoadingMore: boolean;
  };
  treatmentsSearching: boolean;
  treatmentItems: SelectItem[];
  treatmentsStatus: string;
  hasTreatment: boolean;
};

const FormSection = ({
  title,
  icon: Icon,
  action,
  children,
  className,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={cn("space-y-3", className)}>
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent-100 text-accent-600">
          <Icon className="size-3.5" />
        </span>
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
          {title}
        </h3>
      </div>
      {action}
    </div>
    <div className="space-y-3 rounded-xl bg-ink-900/40 p-4 ring-1 ring-ink-800/80">
      {children}
    </div>
  </section>
);

const AppointmentProceduresFields = ({
  procedureItems,
  procedureReferencePriceById,
  proceduresSearching,
  searchProcedures,
  proceduresPagination,
  hasTreatment,
}: {
  procedureItems: SelectItem[];
  procedureReferencePriceById: Map<number, number | null>;
  proceduresSearching: boolean;
  searchProcedures: (query: string) => void;
  proceduresPagination: Props["proceduresPagination"];
  hasTreatment: boolean;
}) => {
  const { control, setValue, getValues, formState } = useFormContext<TAppointmentForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "procedures",
  });
  const watchedProcedures = useWatch({ control, name: "procedures" }) ?? [];
  const totalPrice = watchedProcedures.reduce(
    (sum, item) => sum + Number(item?.price ?? 0),
    0,
  );
  const proceduresError =
    typeof formState.errors.procedures?.message === "string"
      ? formState.errors.procedures.message
      : undefined;

  return (
    <FormSection
      title="Procedimientos"
      icon={Stethoscope}
      action={
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 rounded-lg px-2.5 text-xs"
          onClick={() => append(emptyAppointmentProcedure())}
        >
          <Plus className="size-3.5" />
          Agregar
        </Button>
      }
    >
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-3 rounded-xl bg-ink-950/50 p-3.5 ring-1 ring-ink-800/60"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                Procedimiento {index + 1}
              </p>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Quitar procedimiento ${index + 1}`}
                  className="size-7 text-ink-400 hover:bg-coral-500/10 hover:text-coral-600"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>

            <CustomFormSelect
              name={`procedures.${index}.idProcedure`}
              label="Procedimiento"
              placeholder={
                proceduresSearching && procedureItems.length === 0
                  ? "Cargando procedimientos..."
                  : "Selecciona un procedimiento"
              }
              items={procedureItems}
              disabled={proceduresSearching && procedureItems.length === 0}
              searchable
              searchPlaceholder="Buscar procedimiento..."
              isSearching={proceduresSearching}
              onSearch={searchProcedures}
              {...proceduresPagination}
              onChange={(value) => {
                if (hasTreatment) {
                  setValue(`procedures.${index}.price`, 0, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  return;
                }
                if (typeof value !== "number" || value <= 0) return;
                const reference = procedureReferencePriceById.get(value);
                if (reference == null) return;
                const current = getValues(`procedures.${index}.price`);
                if (current != null && Number(current) > 0) return;
                setValue(`procedures.${index}.price`, reference, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            />

            {!hasTreatment ? (
              <CustomFormField
                name={`procedures.${index}.price`}
                label="Precio"
                placeholder="0"
                mode="currency"
              />
            ) : (
              <p className="text-xs leading-relaxed text-ink-400">
                Precio incluido en el plan de tratamiento.
              </p>
            )}
          </div>
        ))}

        {!hasTreatment && totalPrice > 0 && (
          <div className="flex items-center justify-between gap-3 border-t border-ink-800/80 pt-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
              Total
            </span>
            <span className="text-base font-bold tabular-nums tracking-tight text-ink-50">
              {currencyFormat(totalPrice)}
            </span>
          </div>
        )}

        {proceduresError && (
          <p className="text-xs text-coral-500">{proceduresError}</p>
        )}
      </div>
    </FormSection>
  );
};

export const AppointmentEventForm = ({
  methods,
  onSubmit,
  isCreate,
  isEdit,
  isSubmitting,
  statusColor,
  statusLabel,
  durationLabel,
  event,
  onClose,
  onDelete,
  canUpdate = false,
  patientItems,
  professionalItems,
  procedureItems,
  procedureReferencePriceById,
  statusItems,
  searchPatients,
  searchProfessionals,
  searchProcedures,
  patientsPagination,
  patientsSearching,
  professionalsPagination,
  professionalsSearching,
  proceduresPagination,
  proceduresSearching,
  treatmentsPagination,
  treatmentsSearching,
  treatmentItems,
  treatmentsStatus,
  hasTreatment,
}: Props) => {
  const { setValue, getValues, control } = methods;
  const idPatient = useWatch({ control, name: "idPatient" });
  const watchedStatusId = useWatch({ control, name: "idAppointmentStatus" });
  const hasPatient = typeof idPatient === "number" && idPatient > 0;
  const hasActiveTreatments = treatmentItems.length > 0;
  const currentStatusLabel = getAppointmentStatusLabel(watchedStatusId);
  const statusChipClass = getAppointmentStatusChipClass(watchedStatusId);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
        className="flex max-h-[90vh] w-full flex-col overflow-hidden bg-ink-950"
      >
        <div
          className="relative shrink-0 px-6 pb-4 pt-6"
          style={{
            background: `linear-gradient(160deg, ${statusColor}28 0%, ${statusColor}08 42%, transparent 100%)`,
          }}
        >
          <div
            className="pointer-events-none absolute inset-x-6 top-0 h-px opacity-40"
            style={{
              background: `linear-gradient(90deg, transparent, ${statusColor}, transparent)`,
            }}
          />

          <div className="mb-4 flex items-start justify-between gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
                statusChipClass,
              )}
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: statusColor }}
              />
              {currentStatusLabel || statusLabel}
            </span>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              aria-label="Cerrar"
              className="text-ink-400 hover:bg-ink-900/80"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink-50 sm:text-2xl">
              {isCreate ? "Nueva cita" : "Editar cita"}
            </h2>
            {isEdit && event && (
              <p className="mt-1 text-sm text-ink-400">
                Cita #{event.idAppointment}
                {event.patientName ? ` · ${event.patientName}` : ""}
              </p>
            )}
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto border-t border-ink-800/80 px-6 py-5">
          <FormSection title="Participantes" icon={Users}>
            <CustomFormSelect
              name="idPatient"
              label="Paciente"
              placeholder={
                patientsSearching && patientItems.length === 0
                  ? "Cargando pacientes..."
                  : "Selecciona un paciente"
              }
              items={patientItems}
              disabled={patientsSearching && patientItems.length === 0}
              searchable
              searchPlaceholder="Buscar paciente..."
              isSearching={patientsSearching}
              onSearch={searchPatients}
              {...patientsPagination}
              onChange={() =>
                setValue("idPatientTreatment", null, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />

            <CustomFormSelect
              name="idPatientTreatment"
              label="Plan de tratamiento"
              placeholder={
                !hasPatient
                  ? "Selecciona un paciente primero"
                  : treatmentsSearching
                    ? "Cargando planes..."
                    : "Selecciona un plan (opcional)"
              }
              items={treatmentItems}
              disabled={
                !hasPatient ||
                (treatmentsSearching && treatmentItems.length === 0)
              }
              emptyLabel={hasPatient ? "Sin plan de tratamiento" : undefined}
              searchable
              searchPlaceholder="Buscar plan..."
              {...treatmentsPagination}
              resetKey={idPatient}
              onChange={(value) => {
                const procedures = getValues("procedures") ?? [];
                if (typeof value === "number" && value > 0) {
                  procedures.forEach((_, index) => {
                    setValue(`procedures.${index}.price`, 0, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  });
                }
              }}
            />

            {hasPatient &&
              treatmentsStatus === "success" &&
              !treatmentsPagination.hasMore &&
              !hasActiveTreatments && (
                <p className="text-xs leading-relaxed text-ink-400">
                  Este paciente no tiene planes de tratamiento activos.
                </p>
              )}

            <CustomFormSelect
              name="idUser"
              label="Profesional"
              placeholder={
                professionalsSearching && professionalItems.length === 0
                  ? "Cargando profesionales..."
                  : "Selecciona un profesional"
              }
              items={professionalItems}
              disabled={
                professionalsSearching && professionalItems.length === 0
              }
              searchable
              searchPlaceholder="Buscar profesional..."
              isSearching={professionalsSearching}
              onSearch={searchProfessionals}
              {...professionalsPagination}
            />
          </FormSection>

          <AppointmentProceduresFields
            procedureItems={procedureItems}
            procedureReferencePriceById={procedureReferencePriceById}
            proceduresSearching={proceduresSearching}
            searchProcedures={searchProcedures}
            proceduresPagination={proceduresPagination}
            hasTreatment={hasTreatment}
          />

          <FormSection title="Horario" icon={CalendarDays}>
            <div className="space-y-3">
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
                    formatDate(
                      new Date(date.getTime() + duration),
                      "yyyy-MM-dd'T'HH:mm",
                    ),
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
            </div>

            {durationLabel && (
              <div className="flex justify-center pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1 text-xs font-semibold tabular-nums text-accent-700">
                  <Clock className="size-3.5 opacity-70" />
                  {durationLabel}
                </span>
              </div>
            )}
          </FormSection>

          {isEdit && (
            <FormSection title="Estado" icon={CircleDot}>
              <CustomFormSelect
                name="idAppointmentStatus"
                label="Estado de la cita"
                placeholder="Selecciona un estado"
                items={statusItems}
              />
            </FormSection>
          )}

          <FormSection title="Notas" icon={AlignLeft}>
            <CustomFormTextarea
              name="notes"
              label="Indicaciones o comentarios"
              placeholder="Agrega indicaciones o comentarios..."
              rows={3}
            />
          </FormSection>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-ink-800/80 bg-ink-950/95 px-6 py-4 backdrop-blur-sm">
          {!isCreate && event && canUpdate ? (
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
              onClick={onClose}
              className="rounded-xl text-ink-400"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="rounded-xl px-6 shadow-sm"
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
};
