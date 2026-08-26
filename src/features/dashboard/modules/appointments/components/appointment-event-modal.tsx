"use client";

import {
  Root as DialogRoot,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import type { TAppointmentCalendarEvent, TAppointmentModalMode } from "../types";
import { useAppointmentForm } from "../hooks/use-appointment-form";
import { AppointmentEventView } from "./appointment-event-view";
import { AppointmentEventForm } from "./appointment-event-form";

export type { TAppointmentModalMode };

type Props = {
  open: boolean;
  mode: TAppointmentModalMode;
  event: TAppointmentCalendarEvent | null;
  initialDate?: Date;
  onModeChange: (mode: TAppointmentModalMode) => void;
  onClose: () => void;
  onSuccess?: () => void;
  onDelete: (event: TAppointmentCalendarEvent) => void;
  canCreate?: boolean;
  canUpdate?: boolean;
};

export const AppointmentEventModal = ({
  open,
  mode,
  event,
  initialDate,
  onModeChange,
  onClose,
  onSuccess,
  onDelete,
  canCreate = false,
  canUpdate = false,
}: Props) => {
  const form = useAppointmentForm({
    open,
    mode,
    event,
    initialDate,
    onClose,
    onSuccess,
  });

  const effectiveMode =
    mode === "create" && !canCreate
      ? "view"
      : mode === "edit" && !canUpdate
        ? "view"
        : mode;

  return (
    <DialogRoot
      open={open}
      onOpenChange={(next) => {
        if (!next) form.handleClose();
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
            "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-1.5rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-ink-750 bg-ink-950 text-ink-100 shadow-2xl",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          )}
          onCloseAutoFocus={(event) => event.preventDefault()}
          onInteractOutside={(event) => {
            const target = event.target as HTMLElement | null;
            if (target?.closest("[data-slot='select-content']")) {
              event.preventDefault();
            }
          }}
        >
          <DialogTitle className="sr-only">
            {effectiveMode === "view"
              ? "Detalle de la cita"
              : effectiveMode === "edit"
                ? "Editar cita"
                : "Nueva cita"}
          </DialogTitle>
          {effectiveMode === "view" && event ? (
            <AppointmentEventView
              event={event}
              statusColor={form.statusColor}
              statusLabel={form.statusLabel}
              onEdit={() => onModeChange("edit")}
              onDelete={() => onDelete(event)}
              onClose={form.handleClose}
              canUpdate={canUpdate}
            />
          ) : (
            <div className="animate-in fade-in-0 zoom-in-95 duration-200">
              <AppointmentEventForm
                methods={form.methods}
                onSubmit={form.handleSubmit}
                isCreate={form.isCreate}
                isEdit={form.isEdit}
                isSubmitting={form.isSubmitting}
                statusColor={form.statusColor}
                statusLabel={form.statusLabel}
                durationLabel={form.durationLabel}
                event={event}
                onClose={form.handleClose}
                onDelete={onDelete}
                canUpdate={canUpdate}
                patientItems={form.patientItems}
                patientsStatus={form.patientsStatus}
                professionalItems={form.professionalItems}
                professionalsStatus={form.professionalsStatus}
                procedureItems={form.procedureItems}
                procedureReferencePriceById={form.procedureReferencePriceById}
                proceduresStatus={form.proceduresStatus}
                statusItems={form.statusItems}
                searchPatients={form.searchPatients}
                searchProfessionals={form.searchProfessionals}
                searchProcedures={form.searchProcedures}
                patientsPagination={form.patientsPagination}
                patientsSearching={form.patientsSearching}
                professionalsPagination={form.professionalsPagination}
                professionalsSearching={form.professionalsSearching}
                proceduresPagination={form.proceduresPagination}
                proceduresSearching={form.proceduresSearching}
                treatmentsPagination={form.treatmentsPagination}
                treatmentsSearching={form.treatmentsSearching}
                treatmentItems={form.treatmentItems}
                treatmentsStatus={form.treatmentsStatus}
                hasTreatment={form.hasTreatment}
              />
            </div>
          )}
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
};
