"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { colombiaToUtcIso } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  postCreateAppointment,
  putUpdateAppointment,
  resetPostCreateAppointment,
  resetPutUpdateAppointment,
  selectPostCreateAppointment,
  selectPutUpdateAppointment,
} from "@/store/appointments/appointments-slice";
import {
  getAppointmentStatusColor,
  getAppointmentStatusLabel,
} from "../consts/appointment-status";
import {
  AppointmentFormSchema,
  buildAppointmentFormDefaults,
  type TAppointmentForm,
  type TAppointmentFormValues,
} from "../schemas";
import { formatDuration } from "../utils/format-time";
import { toAppointmentFormValues } from "../utils/appointment-form-values";
import type { TAppointmentCalendarEvent, TAppointmentModalMode } from "../types";
import { useAppointmentFormOptions } from "./use-appointment-form-options";

type Params = {
  open: boolean;
  mode: TAppointmentModalMode;
  event: TAppointmentCalendarEvent | null;
  initialDate?: Date;
  onClose: () => void;
  onSuccess?: () => void;
};

export const useAppointmentForm = ({
  open,
  mode,
  event,
  initialDate,
  onClose,
  onSuccess,
}: Params) => {
  const dispatch = useAppDispatch();
  const {
    status: createStatus,
    message: createMessage,
    error: createError,
  } = useAppSelector(selectPostCreateAppointment);
  const {
    status: updateStatus,
    message: updateMessage,
    error: updateError,
  } = useAppSelector(selectPutUpdateAppointment);

  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isSubmitting =
    createStatus === "loading" || updateStatus === "loading";

  const methods = useForm<TAppointmentForm, unknown, TAppointmentFormValues>({
    mode: "onTouched",
    resolver: zodResolver(AppointmentFormSchema),
    defaultValues: buildAppointmentFormDefaults(initialDate),
  });

  const { reset, handleSubmit, setValue, getValues, control } = methods;
  const startAt = useWatch({ control, name: "startAt" });
  const endAt = useWatch({ control, name: "endAt" });
  const watchedStatusId = useWatch({ control, name: "idAppointmentStatus" });
  const idPatient = useWatch({ control, name: "idPatient" });
  const idPatientTreatment = useWatch({ control, name: "idPatientTreatment" });
  const hasTreatment = (idPatientTreatment ?? 0) > 0;

  const {
    patientItems,
    patientsStatus,
    professionalItems,
    professionalsStatus,
    procedureItems,
    procedureReferencePriceById,
    proceduresStatus,
    treatmentItems,
    treatmentsStatus,
    statusItems,
    searchPatients,
    searchProfessionals,
    searchProcedures,
    patientsPagination,
    patientsSearching,
    professionalsPagination,
    professionalsSearching,
    proceduresPagination,
    proceduresSearching,
    treatmentsPagination,
    treatmentsSearching,
  } = useAppointmentFormOptions({
    open,
    idPatient,
    currentIdPatientTreatment:
      event && idPatient === event.idPatient
        ? event.idPatientTreatment
        : null,
    currentPatientTreatmentName:
      event && idPatient === event.idPatient
        ? event.patientTreatmentName
        : null,
  });

  const statusColor = getAppointmentStatusColor(
    isEdit || isCreate
      ? watchedStatusId
      : event
        ? Number(event.calendarId)
        : undefined,
  );
  const statusLabel = getAppointmentStatusLabel(
    event ? Number(event.calendarId) : undefined,
    event?.statusLabel,
  );

  useEffect(() => {
    if (!open) return;
    reset(toAppointmentFormValues(event, initialDate));
  }, [open, event, initialDate, reset]);

  useEffect(() => {
    if (!isCreate) return;

    if (createStatus === "error") {
      toast.error(createMessage, { description: createError });
      dispatch(resetPostCreateAppointment());
    }

    if (createStatus === "success") {
      toast.success(createMessage || "Cita creada correctamente");
      dispatch(resetPostCreateAppointment());
      onSuccess?.();
    }
  }, [
    createStatus,
    createMessage,
    createError,
    isCreate,
    dispatch,
    onSuccess,
  ]);

  useEffect(() => {
    if (!isEdit) return;

    if (updateStatus === "error") {
      toast.error(updateMessage, { description: updateError });
      dispatch(resetPutUpdateAppointment());
    }

    if (updateStatus === "success") {
      toast.success(updateMessage || "Cita actualizada correctamente");
      dispatch(resetPutUpdateAppointment());
      onSuccess?.();
    }
  }, [
    updateStatus,
    updateMessage,
    updateError,
    isEdit,
    dispatch,
    onSuccess,
  ]);

  const durationLabel =
    startAt && endAt && !Number.isNaN(new Date(startAt).getTime())
      ? formatDuration(new Date(startAt), new Date(endAt))
      : null;

  const handleClose = () => {
    if (createStatus !== "idle") {
      dispatch(resetPostCreateAppointment());
    }
    if (updateStatus !== "idle") {
      dispatch(resetPutUpdateAppointment());
    }
    reset(buildAppointmentFormDefaults());
    onClose();
  };

  const onSubmit = (data: TAppointmentFormValues) => {
    const hasTreatmentPlan = (data.idPatientTreatment ?? 0) > 0;
    const payload = {
      idPatient: data.idPatient,
      idUser: data.idUser,
      procedures: data.procedures.map((procedure) => ({
        idProcedure: procedure.idProcedure,
        price: hasTreatmentPlan ? 0 : procedure.price,
        notes: procedure.notes,
      })),
      idPatientTreatment: hasTreatmentPlan
        ? data.idPatientTreatment
        : isEdit
          ? 0
          : null,
      startAt: colombiaToUtcIso(data.startAt),
      endAt: colombiaToUtcIso(data.endAt),
      notes: data.notes?.trim() || undefined,
    };

    if (isEdit) {
      if (!event) return;
      dispatch(
        putUpdateAppointment({
          ...payload,
          idAppointment: Number(event.id),
          idAppointmentStatus: data.idAppointmentStatus,
        }),
      );
      return;
    }

    dispatch(postCreateAppointment(payload));
  };

  return {
    methods,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    getValues,
    isCreate,
    isEdit,
    isSubmitting,
    statusColor,
    statusLabel,
    durationLabel,
    handleClose,
    patientItems,
    patientsStatus,
    professionalItems,
    professionalsStatus,
    procedureItems,
    procedureReferencePriceById,
    proceduresStatus,
    statusItems,
    searchPatients,
    searchProfessionals,
    searchProcedures,
    patientsPagination,
    patientsSearching,
    professionalsPagination,
    professionalsSearching,
    proceduresPagination,
    proceduresSearching,
    treatmentsPagination,
    treatmentsSearching,
    treatmentItems,
    treatmentsStatus,
    hasTreatment,
  };
};
