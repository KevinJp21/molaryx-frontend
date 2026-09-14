"use client";

import { FileText } from "lucide-react";
import { BaseModal } from "@/components";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils";
import { IClinicalRecordItems } from "../interfaces";

type Props = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  record: IClinicalRecordItems | null;
};

const Field = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-ink-600">{label}</span>
    <span className="text-sm text-ink-900">{value ? value : "—"}</span>
  </div>
);

const ScrollableTextField = ({
  label,
  value,
  maxHeightClass,
}: {
  label: string;
  value?: string | null;
  maxHeightClass: string;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-ink-600">{label}</span>
    <div
      className={cn(
        "overflow-y-auto rounded-md border border-ink-200 bg-ink-50/50 px-3 py-2 text-sm whitespace-pre-wrap text-ink-900",
        maxHeightClass,
      )}
    >
      {value ? value : "—"}
    </div>
  </div>
);

const recordReference = (record: IClinicalRecordItems) => {
  if (record.appointment) return "Cita";
  if (record.patientTreatment) return "Plan de tratamiento";
  return "—";
};

export const ClinicalRecordDetailModal = ({
  open,
  onOpenChange,
  record,
}: Props) => {
  if (!record) return null;

  const { appointment, patientTreatment } = record;

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      icon={<FileText className="size-3.5" strokeWidth={2} />}
      title={record.reason}
      description="Detalle del registro clínico"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="Fecha de registro"
            value={formatDate(record.recordedAt, "d MMM yyyy · HH:mm", {
              hour12: true,
            })}
          />
          <Field
            label="Registrado por"
            value={`${record.createdBy.name} ${record.createdBy.surname}`}
          />
          <Field label="Referencia" value={recordReference(record)} />
          <Field label="Procedimiento" value={record.procedureName} />
        </div>

        <section className="mt-5 flex flex-col gap-3 rounded-lg border border-ink-200 bg-ink-100/30 p-4">
          <h3 className="text-sm font-medium text-ink-950">Paciente</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              label="Nombre"
              value={`${record.patient.name} ${record.patient.surname}`}
            />
            <Field
              label={record.patient.identificationType}
              value={record.patient.identificationNumber}
            />
            <Field label="Email" value={record.patient.email} />
            <Field label="Teléfono" value={record.patient.phoneNumber} />
          </div>
        </section>


        {appointment && (
          <section className="mt-5 flex flex-col gap-3 rounded-lg border border-ink-200 bg-ink-100/30 p-4">
            <h3 className="text-sm font-medium text-ink-950">Cita asociada</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Procedimientos" value={appointment.procedureNames} />
              <Field label="Estado" value={appointment.appointmentStatus} />
              <Field
                label="Inicio"
                value={formatDate(appointment.startAt, "d MMM yyyy · HH:mm", {
                  hour12: true,
                })}
              />
              <Field
                label="Profesional"
                value={`${appointment.professionalName} ${appointment.professionalSurname}`}
              />
            </div>
          </section>
        )}

        {patientTreatment && (
          <section className="mt-5 flex flex-col gap-3 rounded-lg border border-ink-200 bg-ink-100/30 p-4">
            <h3 className="text-sm font-medium text-ink-950">
              Plan de tratamiento
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Tratamiento" value={patientTreatment.treatmentName} />
              <Field label="Estado" value={patientTreatment.patientTreatmentStatus} />
              <Field
                label="Inicio"
                value={formatDate(patientTreatment.startAt, "d MMM yyyy", {
                  hour12: true,
                })}
              />
              <Field
                label="Fin"
                value={
                  patientTreatment.endAt
                    ? formatDate(patientTreatment.endAt, "d MMM yyyy", {
                      hour12: true,
                    })
                    : "—"
                }
              />
            </div>
          </section>
        )}

        <section className="mt-5 flex flex-col gap-4 rounded-lg border border-ink-200 bg-ink-100/30 p-4">
          <ScrollableTextField
            label="Motivo"
            value={record.reason}
            maxHeightClass="max-h-28"
          />
          <ScrollableTextField
            label="Diagnóstico"
            value={record.diagnosis}
            maxHeightClass="max-h-36"
          />
          <ScrollableTextField
            label="Evolución"
            value={record.evolution}
            maxHeightClass="max-h-48"
          />
          <ScrollableTextField
            label="Notas"
            value={record.notes}
            maxHeightClass="max-h-36"
          />
        </section>
      </div>
    </BaseModal>
  );
};
