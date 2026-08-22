"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { colombiaToUtcIso, formatDate } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  postCreatePayment,
  resetPostCreatePayment,
  selectPostCreatePayment,
} from "@/store/payments/payments-slice";
import { PAYMENT_CONTEXT } from "../consts";
import {
  GlobalPaymentFormSchema,
  PAYMENT_FORM_DEFAULT_VALUES,
  PatientPaymentFormSchema,
  PaymentFormSchema,
  TPaymentForm,
  TPaymentFormValues,
} from "../schemas";
import { usePaymentFormOptions } from "./use-payment-form-options";

type Params = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  idPatient?: number;
  idAppointment?: number;
  idPatientTreatment?: number;
  onSuccess?: () => void;
};

export const usePaymentForm = ({
  open,
  onOpenChange,
  idPatient,
  idAppointment,
  idPatientTreatment,
  onSuccess,
}: Params) => {
  const dispatch = useAppDispatch();
  const needsContextSelect =
    idAppointment == null && idPatientTreatment == null;
  const needsPatientSelect = needsContextSelect && !idPatient;
  const { status, message, error } = useAppSelector(selectPostCreatePayment);
  const isSubmitting = status === "loading";

  const methods = useForm<TPaymentForm, unknown, TPaymentFormValues>({
    mode: "onTouched",
    resolver: zodResolver(
      needsPatientSelect
        ? GlobalPaymentFormSchema
        : needsContextSelect
          ? PatientPaymentFormSchema
          : PaymentFormSchema,
    ),
    defaultValues: PAYMENT_FORM_DEFAULT_VALUES,
  });

  const { reset, handleSubmit, control, setValue } = methods;
  const paymentContext = useWatch({ control, name: "paymentContext" });
  const formIdPatient = useWatch({ control, name: "idPatient" });
  const selectedIdPatientTreatment = useWatch({
    control,
    name: "idPatientTreatment",
  });
  const patientKey = idPatient ?? (formIdPatient > 0 ? formIdPatient : undefined);

  const {
    patientItems,
    patientsStatus,
    appointmentItems,
    appointmentsStatus,
    treatmentItems,
    treatmentsStatus,
    treatmentsData,
    searchPatients,
    patientsPagination,
    patientsSearching,
    appointmentsPagination,
    appointmentsSearching,
    treatmentsPagination,
    treatmentsSearching,
    resolveIdPatient,
  } = usePaymentFormOptions({
    open,
    needsPatientSelect,
    needsContextSelect,
    patientKey,
    paymentContext,
  });

  useEffect(() => {
    if (!open) return;

    reset({
      ...PAYMENT_FORM_DEFAULT_VALUES,
      paidAt: formatDate(new Date(), "yyyy-MM-dd'T'HH:mm"),
    });
  }, [open, reset]);

  const handleDialogOpenChange = (next: boolean) => {
    if (!next) {
      reset(PAYMENT_FORM_DEFAULT_VALUES);
      if (status !== "idle") dispatch(resetPostCreatePayment());
    }
    onOpenChange(next);
  };

  const onSubmit = (data: TPaymentFormValues) => {
    const targetIdAppointment = needsContextSelect
      ? data.paymentContext === PAYMENT_CONTEXT.APPOINTMENT
        ? data.idAppointment
        : null
      : (idAppointment ?? null);
    const targetIdPatientTreatment = needsContextSelect
      ? data.paymentContext === PAYMENT_CONTEXT.PATIENT_TREATMENT
        ? data.idPatientTreatment
        : null
      : (idPatientTreatment ?? null);
    const resolvedIdPatient = resolveIdPatient(
      idPatient,
      targetIdAppointment,
      targetIdPatientTreatment,
    );

    if (!resolvedIdPatient) {
      toast.error("No se pudo identificar al paciente del pago.");
      return;
    }

    dispatch(
      postCreatePayment({
        idPatient: resolvedIdPatient,
        idAppointment: targetIdAppointment,
        idPatientTreatment: targetIdPatientTreatment,
        amount: Number(data.amount),
        paidAt: colombiaToUtcIso(data.paidAt),
        idPaymentMethod: data.idPaymentMethod,
        notes: data.notes,
      }),
    );
  };

  useEffect(() => {
    if (status === "error") {
      toast.error(message, { description: error });
      dispatch(resetPostCreatePayment());
    }
    if (status === "success") {
      toast.success(message);
      handleDialogOpenChange(false);
      dispatch(resetPostCreatePayment());
      onSuccess?.();
    }
  }, [status, dispatch]);

  const selectedTreatment = (treatmentsData?.items ?? []).find(
    (item) => item.idPatientTreatment === selectedIdPatientTreatment,
  );
  const showAppointmentSelect =
    needsContextSelect && paymentContext === PAYMENT_CONTEXT.APPOINTMENT;
  const showTreatmentSelect =
    needsContextSelect &&
    paymentContext === PAYMENT_CONTEXT.PATIENT_TREATMENT;
  const showContextSelect =
    needsContextSelect &&
    (!needsPatientSelect || formIdPatient > 0);

  const clearContextSelection = () => {
    setValue("idAppointment", null);
    setValue("idPatientTreatment", null);
  };

  const clearPatientDependentFields = () => {
    setValue("paymentContext", "");
    clearContextSelection();
  };

  return {
    methods,
    isSubmitting,
    needsPatientSelect,
    needsContextSelect,
    showContextSelect,
    showAppointmentSelect,
    showTreatmentSelect,
    selectedTreatment,
    patientItems,
    patientsStatus,
    appointmentItems,
    appointmentsStatus,
    treatmentItems,
    treatmentsStatus,
    searchPatients,
    patientsPagination,
    patientsSearching,
    appointmentsPagination,
    appointmentsSearching,
    treatmentsPagination,
    treatmentsSearching,
    patientKey,
    handleDialogOpenChange,
    onSubmit: handleSubmit(onSubmit),
    clearContextSelection,
    clearPatientDependentFields,
  };
};
