"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { colombiaToUtcIso, formatDate } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  postCreateClinicalRecord,
  resetPostCreateClinicalRecord,
  selectPostCreateClinicalRecord,
} from "@/store/clinical-records/clinical-records-slice";
import {
  CLINICAL_RECORD_FORM_DEFAULT_VALUES,
  ClinicalRecordFormSchema,
  TClinicalRecordForm,
  TClinicalRecordFormValues,
} from "../schemas";
import { useClinicalRecordFormOptions } from "./use-clinical-record-form-options";

type Params = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  idPatient?: number;
  idAppointment?: number;
  idPatientTreatment?: number;
  idService?: number;
  onSuccess?: () => void;
};

export const useClinicalRecordForm = ({
  open,
  onOpenChange,
  idPatient,
  idAppointment,
  idPatientTreatment,
  idService,
  onSuccess,
}: Params) => {
  const dispatch = useAppDispatch();
  const needsPatientSelect = !idPatient;
  const { status, message, error } = useAppSelector(
    selectPostCreateClinicalRecord,
  );
  const isSubmitting = status === "loading";

  const methods = useForm<TClinicalRecordForm, unknown, TClinicalRecordFormValues>(
    {
      mode: "onTouched",
      resolver: zodResolver(ClinicalRecordFormSchema),
      defaultValues: CLINICAL_RECORD_FORM_DEFAULT_VALUES,
    },
  );

  const { reset, handleSubmit, watch, setValue } = methods;
  const formIdPatient = watch("idPatient");
  const patientKey = idPatient ?? (formIdPatient > 0 ? formIdPatient : undefined);

  const {
    patientItems,
    patientsStatus,
    appointmentItems,
    appointmentsStatus,
    treatmentItems,
    treatmentsStatus,
    serviceItems,
    servicesStatus,
    searchPatients,
  } = useClinicalRecordFormOptions({
    open,
    needsPatientSelect,
    patientKey,
  });

  useEffect(() => {
    if (!open) return;

    reset({
      ...CLINICAL_RECORD_FORM_DEFAULT_VALUES,
      idPatient: idPatient ?? 0,
      idAppointment: idAppointment ?? null,
      idPatientTreatment: idPatientTreatment ?? null,
      idService: idService ?? null,
      recordedAt: formatDate(new Date(), "yyyy-MM-dd'T'HH:mm"),
    });
  }, [
    open,
    reset,
    idPatient,
    idAppointment,
    idPatientTreatment,
    idService,
  ]);

  const handleDialogOpenChange = (next: boolean) => {
    if (!next) {
      reset(CLINICAL_RECORD_FORM_DEFAULT_VALUES);
      if (status !== "idle") dispatch(resetPostCreateClinicalRecord());
    }
    onOpenChange(next);
  };

  const onSubmit = (data: TClinicalRecordFormValues) => {
    dispatch(
      postCreateClinicalRecord({
        idPatient: data.idPatient,
        idAppointment: data.idAppointment,
        idPatientTreatment: data.idPatientTreatment,
        idService: data.idService,
        recordedAt: colombiaToUtcIso(data.recordedAt),
        reason: data.reason,
        diagnosis: data.diagnosis,
        evolution: data.evolution,
        notes: data.notes,
      }),
    );
  };

  useEffect(() => {
    if (status === "error") {
      toast.error(message, { description: error });
      dispatch(resetPostCreateClinicalRecord());
    }
    if (status === "success") {
      toast.success(message);
      handleDialogOpenChange(false);
      dispatch(resetPostCreateClinicalRecord());
      onSuccess?.();
    }
  }, [status, dispatch]);

  const clearPatientDependentFields = () => {
    setValue("idAppointment", null);
    setValue("idPatientTreatment", null);
  };

  const showPatientAssociations = Boolean(patientKey);

  return {
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
    onSubmit: handleSubmit(onSubmit),
    clearPatientDependentFields,
  };
};
