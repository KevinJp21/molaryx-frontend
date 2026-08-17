"use client";

import { Trash2, X } from "lucide-react";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import {
  Button,
  CustomFormField,
  CustomFormSelect,
  CustomFormTextarea,
} from "@/components";
import { formatDate } from "@/utils";
import type { TAppointmentForm } from "../schemas";
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
  patientItems: SelectItem[];
  patientsStatus: string;
  professionalItems: SelectItem[];
  professionalsStatus: string;
  serviceItems: SelectItem[];
  servicesStatus: string;
  statusItems: SelectItem[];
  searchPatients: (query: string) => void;
  searchProfessionals: (query: string) => void;
  searchServices: (query: string) => void;
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
  patientItems,
  patientsStatus,
  professionalItems,
  professionalsStatus,
  serviceItems,
  servicesStatus,
  statusItems,
  searchPatients,
  searchProfessionals,
  searchServices,
}: Props) => {
  const { setValue, getValues } = methods;

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
              patientsStatus === "loading" && patientItems.length === 0
                ? "Cargando pacientes..."
                : "Selecciona un paciente"
            }
            items={patientItems}
            disabled={patientsStatus === "loading" && patientItems.length === 0}
            searchable
            searchPlaceholder="Buscar paciente..."
            isSearching={patientsStatus === "loading"}
            onSearch={searchPatients}
          />

          <CustomFormSelect
            name="idUser"
            label="Profesional"
            placeholder={
              professionalsStatus === "loading" && professionalItems.length === 0
                ? "Cargando profesionales..."
                : "Selecciona un profesional"
            }
            items={professionalItems}
            disabled={
              professionalsStatus === "loading" && professionalItems.length === 0
            }
            searchable
            searchPlaceholder="Buscar profesional..."
            isSearching={professionalsStatus === "loading"}
            onSearch={searchProfessionals}
          />

          <CustomFormSelect
            name="idService"
            label="Servicio"
            placeholder={
              servicesStatus === "loading" && serviceItems.length === 0
                ? "Cargando servicios..."
                : "Selecciona un servicio"
            }
            items={serviceItems}
            disabled={servicesStatus === "loading" && serviceItems.length === 0}
            searchable
            searchPlaceholder="Buscar servicio..."
            isSearching={servicesStatus === "loading"}
            onSearch={searchServices}
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
