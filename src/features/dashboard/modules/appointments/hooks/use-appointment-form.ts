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

  const methods = useForm<TAppointmentForm>({
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
    serviceItems,
    servicesStatus,
    treatmentItems,
    treatmentsStatus,
    statusItems,
    searchPatients,
    searchProfessionals,
    searchServices,
    loadOptions,
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
    loadOptions();
  }, [open, event, initialDate, reset, loadOptions]);

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

  const onSubmit = (data: TAppointmentForm) => {
    const hasTreatment = (data.idPatientTreatment ?? 0) > 0;
    const payload = {
      idPatient: data.idPatient,
      idUser: data.idUser,
      idService: data.idService,
      idPatientTreatment: hasTreatment
        ? data.idPatientTreatment
        : isEdit
          ? 0
          : null,
      price: hasTreatment
        ? null
        : data.price
          ? Number(data.price)
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
    serviceItems,
    servicesStatus,
    statusItems,
    searchPatients,
    searchProfessionals,
    searchServices,
    treatmentItems,
    treatmentsStatus,
    hasTreatment,
  };
};
