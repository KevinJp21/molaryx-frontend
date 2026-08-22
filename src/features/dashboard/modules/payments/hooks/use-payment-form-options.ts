"use client";

import { useMemo } from "react";
import { usePaginatedSelect } from "@/hooks";
import { useAppDispatch, useAppSelector } from "@/store";
import { getPatients, selectGetPatients } from "@/store/patients/patiens-slice";
import { getAppointmentsList, selectGetAppointmentsList } from "@/store/appointments/appointments-slice";
import { getPatientTreatments, selectGetPatientTreatments } from "@/store/patient-treatments/patient-treatments-slice";
import { currencyFormat, formatDate } from "@/utils";
import { APPOINTMENT_STATUS } from "@/features/dashboard/modules/appointments/consts";
import { PATIENT_TREATMENT_STATUS } from "@/features/dashboard/modules/patient-treatments/consts";
import { PAYMENT_CONTEXT } from "../consts";
import { fullName } from "../utils";

type Params = {
  open: boolean;
  needsPatientSelect: boolean;
  needsContextSelect: boolean;
  patientKey?: number;
  paymentContext: string;
};

export const usePaymentFormOptions = ({
  open,
  needsPatientSelect,
  needsContextSelect,
  patientKey,
  paymentContext,
}: Params) => {
  const dispatch = useAppDispatch();
  const { data: patientsData, status: patientsStatus } =
    useAppSelector(selectGetPatients);
  const { data: appointmentsData, status: appointmentsStatus } =
    useAppSelector(selectGetAppointmentsList);
  const { data: treatmentsData, status: treatmentsStatus } =
    useAppSelector(selectGetPatientTreatments);

  const showAppointments =
    open &&
    needsContextSelect &&
    Boolean(patientKey) &&
    paymentContext === PAYMENT_CONTEXT.APPOINTMENT;
  const showTreatments =
    open &&
    needsContextSelect &&
    Boolean(patientKey) &&
    paymentContext === PAYMENT_CONTEXT.PATIENT_TREATMENT;

  const patients = usePaginatedSelect({
    enabled: open && needsPatientSelect,
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

  const appointments = usePaginatedSelect({
    enabled: showAppointments,
    data: appointmentsData,
    status: appointmentsStatus,
    resetKey: patientKey,
    fetchPage: ({ page }) => {
      if (!patientKey) return;
      dispatch(
        getAppointmentsList({
          IdPatient: patientKey,
          Page: page,
        }),
      );
    },
  });

  const treatments = usePaginatedSelect({
    enabled: showTreatments,
    data: treatmentsData,
    status: treatmentsStatus,
    resetKey: patientKey,
    fetchPage: ({ page }) => {
      if (!patientKey) return;
      dispatch(
        getPatientTreatments({
          IdPatient: patientKey,
          Page: page,
        }),
      );
    },
  });

  const patientItems = useMemo(
    () =>
      patients.items.map((item) => ({
        value: item.idPatient,
        name: fullName(
          item.firstName,
          item.secondName,
          item.firstSurname,
          item.secondSurname,
        ),
      })),
    [patients.items],
  );

  const appointmentItems = useMemo(
    () =>
      appointments.items
        .filter(
          (item) =>
            item.idAppointmentStatus !== APPOINTMENT_STATUS.CANCELLED &&
            item.idAppointmentStatus !== APPOINTMENT_STATUS.NO_SHOW,
        )
        .map((item) => ({
          value: item.idAppointment,
          name: `${item.serviceName} · ${formatDate(item.startAt, "d MMM yyyy · HH:mm", { hour12: true })}`,
        })),
    [appointments.items],
  );

  const treatmentItems = useMemo(
    () =>
      treatments.items
        .filter(
          (item) =>
            item.idPatientTreatmentStatus !== PATIENT_TREATMENT_STATUS.CANCELLED,
        )
        .map((item) => ({
          value: item.idPatientTreatment,
          name: item.agreedPrice
            ? `${item.treatmentName} · ${currencyFormat(item.agreedPrice)}`
            : item.treatmentName,
        })),
    [treatments.items],
  );

  const resolveIdPatient = (
    idPatient: number | undefined,
    formIdAppointment: number | null,
    formIdPatientTreatment: number | null,
  ) => {
    if (idPatient) return idPatient;
    if (patientKey) return patientKey;

    const appointmentPatient = appointments.items.find(
      (item) => item.idAppointment === formIdAppointment,
    )?.idPatient;
    if (appointmentPatient) return appointmentPatient;

    return (
      treatments.items.find(
        (item) => item.idPatientTreatment === formIdPatientTreatment,
      )?.idPatient ?? null
    );
  };

  return {
    patientItems,
    patientsStatus,
    appointmentItems,
    appointmentsStatus,
    treatmentItems,
    treatmentsStatus,
    treatmentsData,
    searchPatients: patients.onSearch,
    patientsPagination: patients.paginationProps,
    patientsSearching: patients.isSearching,
    appointmentsPagination: appointments.paginationProps,
    appointmentsSearching: appointments.isSearching,
    treatmentsPagination: treatments.paginationProps,
    treatmentsSearching: treatments.isSearching,
    resolveIdPatient,
  };
};
