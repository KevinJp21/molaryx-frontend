"use client";

import { FileText, Plus, Trash2 } from "lucide-react";
import {
  FormProvider,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import {
  BaseModal,
  Button,
  CustomFormField,
  CustomFormSelect,
  CustomFormTextarea,
  Spinner,
} from "@/components";
import { useClinicalRecordForm } from "../hooks";
import {
  emptyClinicalRecordProcedure,
  type TClinicalRecordForm,
} from "../schemas";

type SelectItem = { value: number; name: string };

type Props = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  idPatient?: number;
  idAppointment?: number;
  idPatientTreatment?: number;
  idProcedure?: number;
  onSuccess?: () => void;
};

const ClinicalRecordProceduresFields = ({
  procedureItems,
  proceduresSearching,
  searchProcedures,
  proceduresPagination,
  locked,
}: {
  procedureItems: SelectItem[];
  proceduresSearching: boolean;
  searchProcedures: (query: string) => void;
  proceduresPagination: {
    onLoadMore: () => void;
    hasMore: boolean;
    isLoadingMore: boolean;
  };
  locked: boolean;
}) => {
  const { control, formState } = useFormContext<TClinicalRecordForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "procedures",
  });
  const proceduresError =
    typeof formState.errors.procedures?.message === "string"
      ? formState.errors.procedures.message
      : undefined;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink-100">
          Procedimientos {locked ? "" : "(opcional)"}
        </p>
        {!locked && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => append(emptyClinicalRecordProcedure())}
          >
            <Plus className="size-4" />
            Agregar
          </Button>
        )}
      </div>

      {fields.length === 0 && (
        <p className="text-xs text-ink-400">
          {locked
            ? "Esta cita no tiene procedimientos asociados."
            : "Agrega uno o más procedimientos, o déjalos vacíos."}
        </p>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-3 rounded-2xl border border-ink-800 bg-ink-900/40 p-3"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wider text-ink-400">
              Procedimiento {index + 1}
            </p>
            {!locked && fields.length > 0 && (
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
            disabled={
              locked ||
              (proceduresSearching && procedureItems.length === 0)
            }
            searchable={!locked}
            searchPlaceholder="Buscar procedimiento..."
            isSearching={proceduresSearching}
            onSearch={locked ? undefined : searchProcedures}
            {...(locked ? {} : proceduresPagination)}
          />
        </div>
      ))}

      {proceduresError && (
        <p className="text-xs text-coral-500">{proceduresError}</p>
      )}

      {locked && fields.length > 0 && (
        <p className="text-xs text-ink-400">
          Los procedimientos se toman de la cita seleccionada.
        </p>
      )}
    </div>
  );
};

export const ClinicalRecordFormModal = ({
  open,
  onOpenChange,
  idPatient,
  idAppointment,
  idPatientTreatment,
  idProcedure,
  onSuccess,
}: Props) => {
  const {
    methods,
    isSubmitting,
    needsPatientSelect,
    showPatientAssociations,
    hasLinkedAppointment,
    patientItems,
    appointmentItems,
    treatmentItems,
    procedureItems,
    searchPatients,
    searchProcedures,
    patientsPagination,
    patientsSearching,
    appointmentsPagination,
    appointmentsSearching,
    treatmentsPagination,
    treatmentsSearching,
    proceduresPagination,
    proceduresSearching,
    patientKey,
    handleDialogOpenChange,
    onSubmit,
    clearPatientDependentFields,
    applyAppointmentAssociations,
  } = useClinicalRecordForm({
    open,
    onOpenChange,
    idPatient,
    idAppointment,
    idPatientTreatment,
    idProcedure,
    onSuccess,
  });

  const proceduresLocked =
    hasLinkedAppointment || idAppointment != null;

  return (
    <BaseModal
      open={open}
      onOpenChange={handleDialogOpenChange}
      icon={<FileText className="size-3.5" strokeWidth={2} />}
      title="Crear registro"
      description="Documenta el registro clínico del paciente."
    >
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <div className="flex flex-col gap-3">
              {needsPatientSelect && (
                <CustomFormSelect
                  name="idPatient"
                  label="Paciente"
                  placeholder={
                    patientsSearching
                      ? "Cargando pacientes..."
                      : "Selecciona un paciente"
                  }
                  items={patientItems}
                  disabled={patientsSearching && patientItems.length === 0}
                  searchable
                  searchPlaceholder="Buscar paciente..."
                  onSearch={searchPatients}
                  isSearching={patientsSearching}
                  {...patientsPagination}
                  onChange={clearPatientDependentFields}
                />
              )}

              {showPatientAssociations && (
                <>
                  <CustomFormSelect
                    name="idAppointment"
                    label="Cita (opcional)"
                    placeholder={
                      appointmentsSearching
                        ? "Cargando citas..."
                        : "Sin cita asociada"
                    }
                    items={appointmentItems}
                    disabled={
                      idAppointment != null ||
                      (appointmentsSearching && appointmentItems.length === 0)
                    }
                    searchable
                    searchPlaceholder="Buscar cita..."
                    emptyLabel="Sin cita asociada"
                    {...appointmentsPagination}
                    resetKey={patientKey}
                    onChange={(value) => {
                      applyAppointmentAssociations(
                        typeof value === "number" && value > 0 ? value : null,
                      );
                    }}
                  />

                  <CustomFormSelect
                    name="idPatientTreatment"
                    label="Plan de tratamiento (opcional)"
                    placeholder={
                      treatmentsSearching
                        ? "Cargando planes..."
                        : "Sin plan asociado"
                    }
                    items={treatmentItems}
                    disabled={
                      idPatientTreatment != null ||
                      proceduresLocked ||
                      (treatmentsSearching && treatmentItems.length === 0)
                    }
                    searchable={!proceduresLocked}
                    searchPlaceholder="Buscar plan..."
                    emptyLabel="Sin plan asociado"
                    {...treatmentsPagination}
                    resetKey={patientKey}
                  />
                </>
              )}

              <ClinicalRecordProceduresFields
                procedureItems={procedureItems}
                proceduresSearching={proceduresSearching}
                searchProcedures={searchProcedures}
                proceduresPagination={proceduresPagination}
                locked={proceduresLocked}
              />

              <CustomFormField
                name="recordedAt"
                label="Fecha de registro"
                type="datetime"
                placeholder="Selecciona la fecha del registro"
              />

              <CustomFormTextarea
                name="reason"
                label="Motivo"
                placeholder="Describe el motivo de la consulta o evolución"
                rows={3}
              />

              <CustomFormTextarea
                name="diagnosis"
                label="Diagnóstico (opcional)"
                placeholder="Diagnóstico clínico"
                rows={4}
              />

              <CustomFormTextarea
                name="evolution"
                label="Evolución (opcional)"
                placeholder="Evolución del paciente"
                rows={5}
              />

              <CustomFormTextarea
                name="notes"
                label="Notas (opcional)"
                placeholder="Observaciones adicionales"
                rows={4}
              />
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-ink-800 bg-ink-900/40 px-5 py-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDialogOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="size-4" />
                  Guardando...
                </>
              ) : (
                "Crear registro"
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseModal>
  );
};
