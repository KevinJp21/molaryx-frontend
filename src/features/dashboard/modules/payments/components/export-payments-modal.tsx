"use client";

import { useCallback, useEffect, useState } from "react";
import { FileDownIcon } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { BaseModal, Button, CustomFormField, CustomFormSelect, InputErrorMessage, Spinner, } from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import { getPatients, selectGetPatients, } from "@/store/patients/patiens-slice";
import { getAppointmentsList, selectGetAppointmentsList, } from "@/store/appointments/appointments-slice";
import { getPatientTreatments, selectGetPatientTreatments, } from "@/store/patient-treatments/patient-treatments-slice";
import { currencyFormat, downloadReport, formatDate } from "@/utils";
import { APPOINTMENT_STATUS } from "@/features/dashboard/modules/appointments/consts";
import { PATIENT_TREATMENT_STATUS } from "@/features/dashboard/modules/patient-treatments/consts";
import { apiGetPaymentsReportAction, TGetPaymentsReportParams, } from "../actions";
import { EXPORT_PAYMENT_FILTER, EXPORT_PAYMENT_FILTER_OPTIONS, } from "../consts";
import { EXPORT_PAYMENTS_DEFAULT_VALUES, ExportPaymentsSchema, TExportPaymentsForm, TExportPaymentsValues, } from "../schemas";
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

  const patientItems = (patientsData?.items ?? []).map((patient) => ({
    value: patient.idPatient,
    name: fullName(
      patient.firstName,
      patient.secondName,
      patient.firstSurname,
      patient.secondSurname,
    ),
  }));

  const appointmentItems = (appointmentsData?.items ?? [])
    .filter(
      (item) =>
        item.idAppointmentStatus !== APPOINTMENT_STATUS.CANCELLED &&
        item.idAppointmentStatus !== APPOINTMENT_STATUS.NO_SHOW,
    )
    .map((item) => ({
      value: item.idAppointment,
      name: `${item.serviceName} · ${formatDate(item.startAt, "d MMM yyyy · HH:mm", { hour12: true })}`,
    }));

  const treatmentItems = (treatmentsData?.items ?? [])
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

  const searchPatients = useCallback(
    (Search: string) => {
      dispatch(
        getPatients({
          IsActive: true,
          ...(Search ? { Search } : {}),
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    if (!open) return;
    reset(EXPORT_PAYMENTS_DEFAULT_VALUES);
  }, [open, reset]);

  useEffect(() => {
    if (!open || !showPatientSelect) return;
    dispatch(getPatients({ IsActive: true }));
  }, [open, showPatientSelect, dispatch]);

  useEffect(() => {
    if (!open || !idPatient) return;

    if (filterType === EXPORT_PAYMENT_FILTER.APPOINTMENT) {
      dispatch(getAppointmentsList({ IdPatient: idPatient, Size: 50 }));
      return;
    }

    if (filterType === EXPORT_PAYMENT_FILTER.PATIENT_TREATMENT) {
      dispatch(getPatientTreatments({ IdPatient: idPatient, Size: 50 }));
    }
  }, [open, idPatient, filterType, dispatch]);

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
                    searchDebounceMs={300}
                    onSearch={searchPatients}
                    isSearching={patientsStatus === "loading"}
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
                      appointmentsStatus === "loading"
                        ? "Cargando citas..."
                        : "Selecciona una cita"
                    }
                    items={appointmentItems}
                    disabled={
                      appointmentsStatus === "loading" &&
                      appointmentItems.length === 0
                    }
                    searchable
                    searchPlaceholder="Buscar cita..."
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
                      treatmentsStatus === "loading"
                        ? "Cargando planes..."
                        : "Selecciona un plan"
                    }
                    items={treatmentItems}
                    disabled={
                      treatmentsStatus === "loading" &&
                      treatmentItems.length === 0
                    }
                    searchable
                    searchPlaceholder="Buscar plan..."
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
