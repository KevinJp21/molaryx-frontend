"use client";

import { Plus, Trash2, X } from "lucide-react";
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
import { currencyFormat, formatDate } from "@/utils";
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
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink-100">Procedimientos</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl"
          onClick={() => append(emptyAppointmentProcedure())}
        >
          <Plus className="size-4" />
          Agregar
        </Button>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-3 rounded-2xl border border-ink-800 bg-ink-900/40 p-3"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wider text-ink-400">
              Procedimiento {index + 1}
            </p>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Quitar procedimiento ${index + 1}`}
                className="text-ink-400 hover:bg-coral-500/10 hover:text-coral-600"
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
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
            <p className="text-xs text-ink-400">
              Precio incluido en el plan de tratamiento.
            </p>
          )}
        </div>
      ))}

      {!hasTreatment && totalPrice > 0 && (
        <p className="text-right text-sm text-ink-300">
          Total:{" "}
          <span className="font-medium tabular-nums text-ink-50">
            {currencyFormat(totalPrice)}
          </span>
        </p>
      )}

      {proceduresError && (
        <p className="text-xs text-coral-500">{proceduresError}</p>
      )}
    </div>
  );
};

export const AppointmentEventForm = ({
  methods,
  onSubmit,
  isCreate,
  isEdit,
  isSubmitting,
  statusColor,
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
  const hasPatient = typeof idPatient === "number" && idPatient > 0;
  const hasActiveTreatments = treatmentItems.length > 0;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
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
            onClick={onClose}
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
              <p className="text-xs text-ink-400">
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

          <AppointmentProceduresFields
            procedureItems={procedureItems}
            procedureReferencePriceById={procedureReferencePriceById}
            proceduresSearching={proceduresSearching}
            searchProcedures={searchProcedures}
            proceduresPagination={proceduresPagination}
            hasTreatment={hasTreatment}
          />

          {isEdit && (
            <CustomFormSelect
              name="idAppointmentStatus"
              label="Estado"
              placeholder="Selecciona un estado"
              items={statusItems}
            />
          )}

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
};
