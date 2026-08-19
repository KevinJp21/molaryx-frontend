"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getPatients,
  selectGetPatients,
} from "@/store/patients/patiens-slice";
import {
  getAppointmentsList,
  selectGetAppointmentsList,
} from "@/store/appointments/appointments-slice";
import {
  getPatientTreatments,
  selectGetPatientTreatments,
} from "@/store/patient-treatments/patient-treatments-slice";
import {
  getServices,
  selectGetServices,
} from "@/store/services/services-slice";
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

  const patientItems = useMemo(
    () =>
      (patientsData?.items ?? []).map((item) => ({
        value: item.idPatient,
        name: patientFullName(
          item.firstName,
          item.secondName,
          item.firstSurname,
          item.secondSurname,
        ),
      })),
    [patientsData],
  );

  const appointmentItems = useMemo(
    () =>
      (appointmentsData?.items ?? [])
        .filter(
          (item) =>
            item.idAppointmentStatus !== APPOINTMENT_STATUS.CANCELLED &&
            item.idAppointmentStatus !== APPOINTMENT_STATUS.NO_SHOW,
        )
        .map((item) => ({
          value: item.idAppointment,
          name: `${item.serviceName} · ${formatDate(item.startAt, "d MMM yyyy · HH:mm", { hour12: true })}`,
        })),
    [appointmentsData],
  );

  const treatmentItems = useMemo(
    () =>
      (treatmentsData?.items ?? [])
        .filter(
          (item) =>
            item.idPatientTreatmentStatus !==
            PATIENT_TREATMENT_STATUS.CANCELLED,
        )
        .map((item) => ({
          value: item.idPatientTreatment,
          name: item.treatmentName,
        })),
    [treatmentsData],
  );

  const serviceItems = useMemo(
    () =>
      (servicesData?.items ?? []).map((item) => ({
        value: item.idService,
        name: item.name,
      })),
    [servicesData],
  );

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
    dispatch(getServices({ IsActive: true, Size: 50 }));
  }, [open, dispatch]);

  useEffect(() => {
    if (!open || !needsPatientSelect) return;
    dispatch(getPatients({ IsActive: true }));
  }, [open, needsPatientSelect, dispatch]);

  useEffect(() => {
    if (!open || !patientKey) return;

    dispatch(getAppointmentsList({ IdPatient: patientKey, Size: 50 }));
    dispatch(getPatientTreatments({ IdPatient: patientKey, Size: 50 }));
  }, [open, patientKey, dispatch]);

  return {
    patientItems,
    patientsStatus,
    appointmentItems,
    appointmentsStatus,
    treatmentItems,
    treatmentsStatus,
    serviceItems,
    servicesStatus,
    searchPatients,
  };
};
