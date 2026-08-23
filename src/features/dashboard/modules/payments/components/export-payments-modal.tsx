"use client";

import { useEffect, useState } from "react";
import { FileDownIcon } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { BaseModal, Button, CustomFormField, CustomFormSelect, InputErrorMessage, Spinner } from "@/components";
import { usePaginatedSelect } from "@/hooks";
import { useAppDispatch, useAppSelector } from "@/store";
import { getPatients, selectGetPatients } from "@/store/patients/patiens-slice";
import { getAppointmentsList, selectGetAppointmentsList } from "@/store/appointments/appointments-slice";
import { getPatientTreatments, selectGetPatientTreatments } from "@/store/patient-treatments/patient-treatments-slice";
import { currencyFormat, downloadReport, formatDate } from "@/utils";
import { APPOINTMENT_STATUS } from "@/features/dashboard/modules/appointments/consts";
import { formatProcedureNames } from "@/features/dashboard/modules/appointments/utils/format-procedure-names";
import { PATIENT_TREATMENT_STATUS } from "@/features/dashboard/modules/patient-treatments/consts";
import { apiGetPaymentsReportAction, TGetPaymentsReportParams } from "../actions";
import { EXPORT_PAYMENT_FILTER, EXPORT_PAYMENT_FILTER_OPTIONS } from "../consts";
import { EXPORT_PAYMENTS_DEFAULT_VALUES, ExportPaymentsSchema, TExportPaymentsForm, TExportPaymentsValues } from "../schemas";
import { fullName } from "../utils";

type TProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
};

export const ExportPaymentsModal = ({ open, onOpenChange }: TProps) => {
  const dispatch = useAppDispatch();
  const { data: patientsData, status: patientsStatus } =
    useAppSelector(selectGetPatients);
  const { data: appointmentsData, status: appointmentsStatus } =
    useAppSelector(selectGetAppointmentsList);
  const { data: treatmentsData, status: treatmentsStatus } =
    useAppSelector(selectGetPatientTreatments);
  const [isExporting, setIsExporting] = useState(false);

  const methods = useForm<TExportPaymentsForm, unknown, TExportPaymentsValues>({
    mode: "onTouched",
    resolver: zodResolver(ExportPaymentsSchema),
    defaultValues: EXPORT_PAYMENTS_DEFAULT_VALUES,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    control,
    formState: { errors, touchedFields },
  } = methods;

  const filterType = useWatch({ control, name: "filterType" });
  const idPatient = useWatch({ control, name: "idPatient" });

  const showPatientSelect =
    filterType === EXPORT_PAYMENT_FILTER.PATIENT ||
    filterType === EXPORT_PAYMENT_FILTER.APPOINTMENT ||
    filterType === EXPORT_PAYMENT_FILTER.PATIENT_TREATMENT;
  const showAppointmentSelect =
    filterType === EXPORT_PAYMENT_FILTER.APPOINTMENT && Boolean(idPatient);
  const showTreatmentSelect =
    filterType === EXPORT_PAYMENT_FILTER.PATIENT_TREATMENT && Boolean(idPatient);

  const patients = usePaginatedSelect({
    enabled: open && showPatientSelect,
    data: patientsData,
    status: patientsStatus,
    resetKey: filterType,
    fetchPage: ({ page, search }) => {
      dispatch(
        getPatients({
          IsActive: true,
          Page: page,
          ...(search ? { Search: search } : {}),
        }),
      );
    },
  });

  const appointments = usePaginatedSelect({
    enabled: open && showAppointmentSelect && Boolean(idPatient),
    data: appointmentsData,
    status: appointmentsStatus,
    resetKey: idPatient,
    fetchPage: ({ page }) => {
      if (!idPatient) return;
      dispatch(
        getAppointmentsList({
          IdPatient: idPatient,
          Page: page,
        }),
      );
    },
  });

  const treatments = usePaginatedSelect({
    enabled: open && showTreatmentSelect && Boolean(idPatient),
    data: treatmentsData,
    status: treatmentsStatus,
    resetKey: idPatient,
    fetchPage: ({ page }) => {
      if (!idPatient) return;
      dispatch(
        getPatientTreatments({
          IdPatient: idPatient,
          Page: page,
        }),
      );
    },
  });

  const patientItems = patients.items.map((patient) => ({
    value: patient.idPatient,
    name: fullName(
      patient.firstName,
      patient.secondName,
      patient.firstSurname,
      patient.secondSurname,
    ),
  }));

  const appointmentItems = appointments.items
    .filter(
      (item) =>
        item.idAppointmentStatus !== APPOINTMENT_STATUS.CANCELLED &&
        item.idAppointmentStatus !== APPOINTMENT_STATUS.NO_SHOW,
    )
    .map((item) => ({
      value: item.idAppointment,
      name: `${formatProcedureNames(item.procedures, "Cita")} · ${formatDate(item.startAt, "d MMM yyyy · HH:mm", { hour12: true })}`,
    }));

  const treatmentItems = treatments.items
    .filter(
      (item) =>
        item.idPatientTreatmentStatus !== PATIENT_TREATMENT_STATUS.CANCELLED,
    )
    .map((item) => ({
      value: item.idPatientTreatment,
      name: item.agreedPrice
        ? `${item.treatmentName} · ${currencyFormat(item.agreedPrice)}`
        : item.treatmentName,
    }));

  useEffect(() => {
    if (!open) return;
    reset(EXPORT_PAYMENTS_DEFAULT_VALUES);
  }, [open, reset]);

  const clearContextFields = () => {
    setValue("idPatient", null);
    setValue("idAppointment", null);
    setValue("idPatientTreatment", null);
  };

  const clearPatientDependentFields = () => {
    setValue("idAppointment", null);
    setValue("idPatientTreatment", null);
  };

  const handleDialogOpenChange = (next: boolean) => {
    if (!next) {
      reset(EXPORT_PAYMENTS_DEFAULT_VALUES);
      setIsExporting(false);
    }
    onOpenChange(next);
  };

  const onSubmit = handleSubmit(async (data) => {
    setIsExporting(true);
    toast.loading("Exportando pagos...");

    const params: TGetPaymentsReportParams = {};
    if (data.from) params.From = data.from;
    if (data.to) params.To = data.to;

    if (data.filterType === EXPORT_PAYMENT_FILTER.PATIENT && data.idPatient) {
      params.IdPatient = data.idPatient;
    } else if (
      data.filterType === EXPORT_PAYMENT_FILTER.APPOINTMENT &&
      data.idAppointment
    ) {
      params.IdAppointment = data.idAppointment;
    } else if (
      data.filterType === EXPORT_PAYMENT_FILTER.PATIENT_TREATMENT &&
      data.idPatientTreatment
    ) {
      params.IdPatientTreatment = data.idPatientTreatment;
    }

    const response = await apiGetPaymentsReportAction(params);

    if (!response.success) {
      toast.dismiss();
      toast.error(response.message, {
        description: response.error,
      });
      setIsExporting(false);
      return;
    }

    downloadReport(
      response.data ?? new Blob(),
      response.filename ?? `pagos_${new Date().getTime()}.xlsx`,
    );
    toast.dismiss();
    toast.success("Reporte de pagos exportado correctamente");
    handleDialogOpenChange(false);
  });

  return (
    <BaseModal
      open={open}
      onOpenChange={handleDialogOpenChange}
      icon={<FileDownIcon className="size-3.5" strokeWidth={2} />}
      title="Exportar pagos"
      description="Filtra por fechas y, si quieres, por paciente, cita o plan."
      className="max-w-xl"
    >
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomFormField
                  name="from"
                  label="Fecha de inicio (opcional)"
                  placeholder="Selecciona la fecha de inicio"
                  type="date"
                />
                <CustomFormField
                  name="to"
                  label="Fecha de fin (opcional)"
                  placeholder="Selecciona la fecha de fin"
                  type="date"
                />
              </div>

              <CustomFormSelect
                name="filterType"
                label="Filtro (opcional)"
                placeholder="Sin filtro de contexto"
                items={EXPORT_PAYMENT_FILTER_OPTIONS}
                emptyLabel="Sin filtro de contexto"
                onChange={(value) => {
                  if (value == null) {
                    setValue("filterType", EXPORT_PAYMENT_FILTER.NONE);
                  }
                  clearContextFields();
                }}
              />

              {showPatientSelect && (
                <div className="flex flex-col gap-1.5">
                  <CustomFormSelect
                    name="idPatient"
                    label="Paciente"
                    placeholder={
                      patients.isSearching
                        ? "Cargando pacientes..."
                        : "Selecciona un paciente"
                    }
                    items={patientItems}
                    disabled={patients.isSearching && patientItems.length === 0}
                    searchable
                    searchPlaceholder="Buscar paciente..."
                    searchDebounceMs={300}
                    onSearch={patients.onSearch}
                    isSearching={patients.isSearching}
                    {...patients.paginationProps}
                    resetKey={filterType}
                    onChange={clearPatientDependentFields}
                  />
                  {errors.idPatient && !touchedFields.idPatient && (
                    <InputErrorMessage message={errors.idPatient.message} />
                  )}
                </div>
              )}

              {showAppointmentSelect && (
                <div className="flex flex-col gap-1.5">
                  <CustomFormSelect
                    name="idAppointment"
                    label="Cita"
                    placeholder={
                      appointments.isSearching
                        ? "Cargando citas..."
                        : "Selecciona una cita"
                    }
                    items={appointmentItems}
                    disabled={
                      appointments.isSearching && appointmentItems.length === 0
                    }
                    searchable
                    searchPlaceholder="Buscar cita..."
                    {...appointments.paginationProps}
                    resetKey={idPatient}
                  />
                  {errors.idAppointment && !touchedFields.idAppointment && (
                    <InputErrorMessage
                      message={errors.idAppointment.message}
                    />
                  )}
                </div>
              )}

              {showTreatmentSelect && (
                <div className="flex flex-col gap-1.5">
                  <CustomFormSelect
                    name="idPatientTreatment"
                    label="Plan de tratamiento"
                    placeholder={
                      treatments.isSearching
                        ? "Cargando planes..."
                        : "Selecciona un plan"
                    }
                    items={treatmentItems}
                    disabled={
                      treatments.isSearching && treatmentItems.length === 0
                    }
                    searchable
                    searchPlaceholder="Buscar plan..."
                    {...treatments.paginationProps}
                    resetKey={idPatient}
                  />
                  {errors.idPatientTreatment &&
                    !touchedFields.idPatientTreatment && (
                      <InputErrorMessage
                        message={errors.idPatientTreatment.message}
                      />
                    )}
                </div>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-ink-800 bg-ink-900/40 px-5 py-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDialogOpenChange(false)}
              disabled={isExporting}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={isExporting}>
              {isExporting ? (
                <>
                  <Spinner className="size-4" />
                  Exportando...
                </>
              ) : (
                <>
                  <FileDownIcon className="size-4" />
                  Exportar
                </>
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseModal>
  );
};
