"use client";

import { useMemo } from "react";
import { usePaginatedSelect } from "@/hooks";
import { useAppDispatch, useAppSelector } from "@/store";
import { getPatients, selectGetPatients } from "@/store/patients/patiens-slice";
import { getAppointmentsList, selectGetAppointmentsList } from "@/store/appointments/appointments-slice";
import { getPatientTreatments, selectGetPatientTreatments } from "@/store/patient-treatments/patient-treatments-slice";
import { getServices, selectGetServices } from "@/store/services/services-slice";
import { formatDate } from "@/utils";
import { APPOINTMENT_STATUS } from "@/features/dashboard/modules/appointments/consts";
import { PATIENT_TREATMENT_STATUS } from "@/features/dashboard/modules/patient-treatments/consts";
import { patientFullName } from "@/features/dashboard/modules/patients/utils";

type Params = {
  open: boolean;
  needsPatientSelect: boolean;
  patientKey?: number;
};

export const useClinicalRecordFormOptions = ({
  open,
  needsPatientSelect,
  patientKey,
}: Params) => {
  const dispatch = useAppDispatch();
  const { data: patientsData, status: patientsStatus } =
    useAppSelector(selectGetPatients);
  const { data: appointmentsData, status: appointmentsStatus } =
    useAppSelector(selectGetAppointmentsList);
  const { data: treatmentsData, status: treatmentsStatus } =
    useAppSelector(selectGetPatientTreatments);
  const { data: servicesData, status: servicesStatus } =
    useAppSelector(selectGetServices);

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
    enabled: open && Boolean(patientKey),
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
    enabled: open && Boolean(patientKey),
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

  const services = usePaginatedSelect({
    enabled: open,
    data: servicesData,
    status: servicesStatus,
    fetchPage: ({ page, search }) => {
      dispatch(
        getServices({
          IsActive: true,
          Page: page,
          ...(search ? { Search: search } : {}),
        }),
      );
    },
  });

  const patientItems = useMemo(
    () =>
      patients.items.map((item) => ({
        value: item.idPatient,
        name: patientFullName(
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
            item.idPatientTreatmentStatus !==
            PATIENT_TREATMENT_STATUS.CANCELLED,
        )
        .map((item) => ({
          value: item.idPatientTreatment,
          name: item.treatmentName,
        })),
    [treatments.items],
  );

  const serviceItems = useMemo(
    () =>
      services.items.map((item) => ({
        value: item.idService,
        name: item.name,
      })),
    [services.items],
  );

  return {
    patientItems,
    patientsStatus,
    appointmentItems,
    appointmentsStatus,
    treatmentItems,
    treatmentsStatus,
    serviceItems,
    servicesStatus,
    searchPatients: patients.onSearch,
    searchServices: services.onSearch,
    patientsPagination: patients.paginationProps,
    patientsSearching: patients.isSearching,
    appointmentsPagination: appointments.paginationProps,
    appointmentsSearching: appointments.isSearching,
    treatmentsPagination: treatments.paginationProps,
    treatmentsSearching: treatments.isSearching,
    servicesPagination: services.paginationProps,
    servicesSearching: services.isSearching,
  };
};
