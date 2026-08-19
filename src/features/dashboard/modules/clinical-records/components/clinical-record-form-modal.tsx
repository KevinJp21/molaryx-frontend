"use client";

import { FileText } from "lucide-react";
import { FormProvider } from "react-hook-form";
import {
  BaseModal,
  Button,
  CustomFormField,
  CustomFormSelect,
  CustomFormTextarea,
  Spinner,
} from "@/components";
import { useClinicalRecordForm } from "../hooks";

type Props = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  idPatient?: number;
  idAppointment?: number;
  idPatientTreatment?: number;
  idService?: number;
  onSuccess?: () => void;
};

export const ClinicalRecordFormModal = ({
  open,
  onOpenChange,
  idPatient,
  idAppointment,
  idPatientTreatment,
  idService,
  onSuccess,
}: Props) => {
  const {
    methods,
    isSubmitting,
    needsPatientSelect,
    showPatientAssociations,
    patientItems,
    patientsStatus,
    appointmentItems,
    appointmentsStatus,
    treatmentItems,
    treatmentsStatus,
    serviceItems,
    servicesStatus,
    searchPatients,
    handleDialogOpenChange,
    onSubmit,
    clearPatientDependentFields,
  } = useClinicalRecordForm({
    open,
    onOpenChange,
    idPatient,
    idAppointment,
    idPatientTreatment,
    idService,
    onSuccess,
  });

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
                    patientsStatus === "loading"
                      ? "Cargando pacientes..."
                      : "Selecciona un paciente"
                  }
                  items={patientItems}
                  disabled={
                    patientsStatus === "loading" && patientItems.length === 0
                  }
                  searchable
                  searchPlaceholder="Buscar paciente..."
                  onSearch={searchPatients}
                  isSearching={patientsStatus === "loading"}
                  onChange={clearPatientDependentFields}
                />
              )}

              {showPatientAssociations && (
                <>
                  <CustomFormSelect
                    name="idAppointment"
                    label="Cita (opcional)"
                    placeholder={
                      appointmentsStatus === "loading"
                        ? "Cargando citas..."
                        : "Sin cita asociada"
                    }
                    items={appointmentItems}
                    disabled={
                      idAppointment != null ||
                      (appointmentsStatus === "loading" &&
                        appointmentItems.length === 0)
                    }
                    searchable
                    searchPlaceholder="Buscar cita..."
                    emptyLabel="Sin cita asociada"
                  />

                  <CustomFormSelect
                    name="idPatientTreatment"
                    label="Plan de tratamiento (opcional)"
                    placeholder={
                      treatmentsStatus === "loading"
                        ? "Cargando planes..."
                        : "Sin plan asociado"
                    }
                    items={treatmentItems}
                    disabled={
                      idPatientTreatment != null ||
                      (treatmentsStatus === "loading" &&
                        treatmentItems.length === 0)
                    }
                    searchable
                    searchPlaceholder="Buscar plan..."
                    emptyLabel="Sin plan asociado"
                  />
                </>
              )}

              <CustomFormSelect
                name="idService"
                label="Servicio (opcional)"
                placeholder={
                  servicesStatus === "loading"
                    ? "Cargando servicios..."
                    : "Sin servicio asociado"
                }
                items={serviceItems}
                disabled={
                  idService != null ||
                  (servicesStatus === "loading" && serviceItems.length === 0)
                }
                searchable
                searchPlaceholder="Buscar servicio..."
                emptyLabel="Sin servicio asociado"
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
