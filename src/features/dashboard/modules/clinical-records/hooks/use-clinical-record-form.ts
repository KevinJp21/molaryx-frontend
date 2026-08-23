"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
  idProcedure?: number;
  onSuccess?: () => void;
};

export const useClinicalRecordForm = ({
  open,
  onOpenChange,
  idPatient,
  idAppointment,
  idPatientTreatment,
  idProcedure,
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

  const { reset, handleSubmit, setValue, control } = methods;
  const formIdPatient = useWatch({ control, name: "idPatient" });
  const watchedIdAppointment = useWatch({ control, name: "idAppointment" });
  const watchedIdPatientTreatment = useWatch({
    control,
    name: "idPatientTreatment",
  });
  const patientKey =
    idPatient ?? (formIdPatient > 0 ? formIdPatient : undefined);

  const {
    patientItems,
    patientsStatus,
    appointmentItems,
    appointmentsStatus,
    appointmentsById,
    treatmentItems,
    treatmentsStatus,
    procedureItems,
    proceduresStatus,
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
  } = useClinicalRecordFormOptions({
    open,
    needsPatientSelect,
    patientKey,
    watchedIdAppointment,
    watchedIdPatientTreatment,
  });

  useEffect(() => {
    if (!open) return;

    reset({
      ...CLINICAL_RECORD_FORM_DEFAULT_VALUES,
      idPatient: idPatient ?? 0,
      idAppointment: idAppointment ?? null,
      idPatientTreatment: idPatientTreatment ?? null,
      procedures: idProcedure
        ? [{ idProcedure }]
        : CLINICAL_RECORD_FORM_DEFAULT_VALUES.procedures,
      recordedAt: formatDate(new Date(), "yyyy-MM-dd'T'HH:mm"),
    });
  }, [
    open,
    reset,
    idPatient,
    idAppointment,
    idPatientTreatment,
    idProcedure,
  ]);

  useEffect(() => {
    if (!open || !idAppointment) return;
    const appointment = appointmentsById.get(idAppointment);
    if (!appointment) return;

    setValue(
      "idPatientTreatment",
      appointment.idPatientTreatment ?? null,
      { shouldDirty: false, shouldValidate: true },
    );
    setValue(
      "procedures",
      appointment.procedures.map((procedure) => ({
        idProcedure: procedure.idProcedure,
      })),
      { shouldDirty: false, shouldValidate: true },
    );
  }, [open, idAppointment, appointmentsById, setValue]);

  const applyAppointmentAssociations = (appointmentId: number | null) => {
    if (!appointmentId) {
      setValue("idPatientTreatment", null, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("procedures", [], {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    const appointment = appointmentsById.get(appointmentId);
    if (!appointment) return;

    setValue(
      "idPatientTreatment",
      appointment.idPatientTreatment ?? null,
      { shouldDirty: true, shouldValidate: true },
    );
    setValue(
      "procedures",
      appointment.procedures.map((procedure) => ({
        idProcedure: procedure.idProcedure,
      })),
      { shouldDirty: true, shouldValidate: true },
    );
  };

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
        // Con cita, los procedimientos viven en la cita. Sin cita, la API
        // aún acepta un solo IdProcedure (se envía el primero).
        idProcedure: data.idAppointment
          ? null
          : (data.procedures[0]?.idProcedure ?? null),
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
    setValue("procedures", []);
  };

  const showPatientAssociations = Boolean(patientKey);
  const hasLinkedAppointment =
    typeof watchedIdAppointment === "number" && watchedIdAppointment > 0;

  return {
    methods,
    isSubmitting,
    needsPatientSelect,
    showPatientAssociations,
    hasLinkedAppointment,
    patientItems,
    patientsStatus,
    appointmentItems,
    appointmentsStatus,
    treatmentItems,
    treatmentsStatus,
    procedureItems,
    proceduresStatus,
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
    onSubmit: handleSubmit(onSubmit),
    clearPatientDependentFields,
    applyAppointmentAssociations,
  };
};
