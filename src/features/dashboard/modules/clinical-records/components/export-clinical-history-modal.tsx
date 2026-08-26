"use client";

import { useEffect, useState } from "react";
import { FileDownIcon } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { BaseModal, Button, CustomFormField, CustomFormSelect, Spinner } from "@/components";
import { usePaginatedSelect } from "@/hooks";
import { useAppDispatch, useAppSelector } from "@/store";
import { getPatients, selectGetPatients } from "@/store/patients/patiens-slice";
import { patientFullName } from "@/features/dashboard/modules/patients/utils";
import { downloadReport } from "@/utils";
import { apiGetClinicalHistoryAction, TGetClinicalHistoryParams } from "../actions";
import { EXPORT_CLINICAL_HISTORY_DEFAULT_VALUES, ExportClinicalHistorySchema, TExportClinicalHistoryForm, TExportClinicalHistoryValues } from "../schemas";

type TProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
};

export const ExportClinicalHistoryModal = ({
  open,
  onOpenChange,
}: TProps) => {
  const dispatch = useAppDispatch();
  const { data: patientsData, status: patientsStatus } =
    useAppSelector(selectGetPatients);
  const [isExporting, setIsExporting] = useState(false);

  const methods = useForm<
    TExportClinicalHistoryForm,
    unknown,
    TExportClinicalHistoryValues
  >({
    mode: "onTouched",
    resolver: zodResolver(ExportClinicalHistorySchema),
    defaultValues: EXPORT_CLINICAL_HISTORY_DEFAULT_VALUES,
  });

  const { reset, handleSubmit } = methods;

  const patients = usePaginatedSelect({
    enabled: open,
    data: patientsData,
    status: patientsStatus,
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

  const patientItems = patients.items.map((patient) => ({
    value: patient.idPatient,
    name: patientFullName(
      patient.firstName,
      patient.secondName,
      patient.firstSurname,
      patient.secondSurname,
    ),
  }));

  useEffect(() => {
    if (!open) return;
    reset(EXPORT_CLINICAL_HISTORY_DEFAULT_VALUES);
  }, [open, reset]);

  const handleDialogOpenChange = (next: boolean) => {
    if (!next) {
      reset(EXPORT_CLINICAL_HISTORY_DEFAULT_VALUES);
      setIsExporting(false);
    }
    onOpenChange(next);
  };

  const onSubmit = handleSubmit(async (data) => {
    setIsExporting(true);
    toast.loading("Exportando historia clínica...");
    const params: TGetClinicalHistoryParams = {
      IdPatient: data.idPatient,
    };

    if (data.from.trim()) params.From = data.from.trim();
    if (data.to.trim()) params.To = data.to.trim();

    const response = await apiGetClinicalHistoryAction(params);

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
      response.filename ?? `historia-clinica_${new Date().getTime()}.pdf`,
    );
    toast.dismiss();
    toast.success("Historia clínica exportada correctamente");
    handleDialogOpenChange(false);
  });

  return (
    <BaseModal
      open={open}
      onOpenChange={handleDialogOpenChange}
      icon={<FileDownIcon className="size-3.5" strokeWidth={2} />}
      title="Exportar historia clínica"
      description="Selecciona el paciente y, si quieres, un rango de fechas."
      className="max-w-xl"
    >
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <div className="flex flex-col gap-3">
              <CustomFormSelect
                name="idPatient"
                label="Paciente"
                placeholder={
                  patients.isSearching
                    ? "Cargando pacientes..."
                    : "Selecciona un paciente"
                }
                items={patientItems}
                disabled={
                  patients.isSearching && patientItems.length === 0
                }
                searchable
                searchPlaceholder="Buscar paciente..."
                searchDebounceMs={300}
                onSearch={patients.onSearch}
                isSearching={patients.isSearching}
                {...patients.paginationProps}
              />

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
