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
import { currencyFormat, formatDate } from "@/utils";
import { APPOINTMENT_STATUS } from "@/features/dashboard/modules/appointments/consts";
import { PATIENT_TREATMENT_STATUS } from "@/features/dashboard/modules/patient-treatments/consts";
import { PAYMENT_CONTEXT } from "../consts";
import { fullName } from "../utils";

type Params = {
  open: boolean;
  needsPatientSelect: boolean;
  needsContextSelect: boolean;
  patientKey?: string;
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

  const patientItems = useMemo(
    () =>
      (patientsData?.items ?? [])
        .filter((item) => Boolean(item.encodedId))
        .map((item) => ({
          value: item.encodedId as string,
          name: fullName(
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
          (item) => item.idPatientTreatmentStatus !== PATIENT_TREATMENT_STATUS.CANCELLED,
        )
        .map((item) => ({
          value: item.idPatientTreatment,
          name: item.agreedPrice
            ? `${item.treatmentName} · ${currencyFormat(item.agreedPrice)}`
            : item.treatmentName,
        })),
    [treatmentsData],
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
    if (!open || !needsPatientSelect) return;
    dispatch(getPatients({ IsActive: true }));
  }, [open, needsPatientSelect, dispatch]);

  useEffect(() => {
    if (!open || !needsContextSelect || !patientKey) return;

    if (paymentContext === PAYMENT_CONTEXT.APPOINTMENT) {
      dispatch(getAppointmentsList({ IdPatient: patientKey, Size: 50 }));
      return;
    }

    if (paymentContext === PAYMENT_CONTEXT.PATIENT_TREATMENT) {
      dispatch(getPatientTreatments({ IdPatient: patientKey, Size: 50 }));
    }
  }, [open, needsContextSelect, patientKey, paymentContext, dispatch]);

  const resolveIdPatient = (
    idPatient: number | undefined,
    formIdAppointment: number | null,
    formIdPatientTreatment: number | null,
  ) => {
    if (idPatient) return idPatient;

    const selectedPatient = (patientsData?.items ?? []).find(
      (item) => item.encodedId === patientKey,
    );
    if (selectedPatient) return selectedPatient.idPatient;

    const appointmentPatient = (appointmentsData?.items ?? []).find(
      (item) => item.idAppointment === formIdAppointment,
    )?.idPatient;
    if (appointmentPatient) return appointmentPatient;

    return (
      (treatmentsData?.items ?? []).find(
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
    searchPatients,
    resolveIdPatient,
  };
};
