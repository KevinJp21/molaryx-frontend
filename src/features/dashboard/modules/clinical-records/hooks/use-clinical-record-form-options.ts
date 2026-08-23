"use client";

import { useMemo } from "react";
import { usePaginatedSelect } from "@/hooks";
import { useAppDispatch, useAppSelector } from "@/store";
import { getPatients, selectGetPatients } from "@/store/patients/patiens-slice";
import {
  getAppointmentsList,
  selectGetAppointmentsList,
} from "@/store/appointments/appointments-slice";
import {
  getPatientTreatments,
  selectGetPatientTreatments,
} from "@/store/patient-treatments/patient-treatments-slice";
import {
  getProcedures,
  selectGetProcedures,
} from "@/store/procedures/procedures-slice";
import { formatDate } from "@/utils";
import { APPOINTMENT_STATUS } from "@/features/dashboard/modules/appointments/consts";
import { formatProcedureNames } from "@/features/dashboard/modules/appointments/utils/format-procedure-names";
import type { IAppointmentListItems } from "@/features/dashboard/modules/appointments/interfaces";
import { PATIENT_TREATMENT_STATUS } from "@/features/dashboard/modules/patient-treatments/consts";
import { patientFullName } from "@/features/dashboard/modules/patients/utils";

type Params = {
  open: boolean;
  needsPatientSelect: boolean;
  patientKey?: number;
  watchedIdAppointment?: number | null;
  watchedIdPatientTreatment?: number | null;
};

export const useClinicalRecordFormOptions = ({
  open,
  needsPatientSelect,
  patientKey,
  watchedIdAppointment,
  watchedIdPatientTreatment,
}: Params) => {
  const dispatch = useAppDispatch();
  const { data: patientsData, status: patientsStatus } =
    useAppSelector(selectGetPatients);
  const { data: appointmentsData, status: appointmentsStatus } =
    useAppSelector(selectGetAppointmentsList);
  const { data: treatmentsData, status: treatmentsStatus } =
    useAppSelector(selectGetPatientTreatments);
  const { data: proceduresData, status: proceduresStatus } =
    useAppSelector(selectGetProcedures);

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

  const procedures = usePaginatedSelect({
    enabled: open,
    data: proceduresData,
    status: proceduresStatus,
    fetchPage: ({ page, search }) => {
      dispatch(
        getProcedures({
          IsActive: true,
          Page: page,
          ...(search ? { Search: search } : {}),
        }),
      );
    },
  });

  const appointmentsById = useMemo(() => {
    const map = new Map<number, IAppointmentListItems>();
    for (const item of appointments.items) {
      map.set(item.idAppointment, item);
    }
    return map;
  }, [appointments.items]);

  const selectedAppointment = useMemo(() => {
    if (!watchedIdAppointment) return null;
    return appointmentsById.get(watchedIdAppointment) ?? null;
  }, [appointmentsById, watchedIdAppointment]);

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
          name: `${formatProcedureNames(item.procedures, "Cita")} · ${formatDate(item.startAt, "d MMM yyyy · HH:mm", { hour12: true })}`,
        })),
    [appointments.items],
  );

  const treatmentItems = useMemo(() => {
    const items = treatments.items
      .filter(
        (item) =>
          item.idPatientTreatmentStatus !==
          PATIENT_TREATMENT_STATUS.CANCELLED,
      )
      .map((item) => ({
        value: item.idPatientTreatment,
        name: item.treatmentName,
      }));

    if (
      selectedAppointment?.idPatientTreatment &&
      !items.some(
        (item) => item.value === selectedAppointment.idPatientTreatment,
      )
    ) {
      items.unshift({
        value: selectedAppointment.idPatientTreatment,
        name:
          selectedAppointment.patientTreatmentName?.trim() || "Plan asignado",
      });
    } else if (
      watchedIdPatientTreatment &&
      !items.some((item) => item.value === watchedIdPatientTreatment)
    ) {
      items.unshift({
        value: watchedIdPatientTreatment,
        name: "Plan asignado",
      });
    }

    return items;
  }, [treatments.items, selectedAppointment, watchedIdPatientTreatment]);

  const procedureItems = useMemo(() => {
    const items = procedures.items.map((item) => ({
      value: item.idProcedure,
      name: item.name,
    }));

    for (const procedure of selectedAppointment?.procedures ?? []) {
      if (!items.some((item) => item.value === procedure.idProcedure)) {
        items.unshift({
          value: procedure.idProcedure,
          name: procedure.name,
        });
      }
    }

    return items;
  }, [procedures.items, selectedAppointment]);

  return {
    patientItems,
    patientsStatus,
    appointmentItems,
    appointmentsStatus,
    appointmentsById,
    treatmentItems,
    treatmentsStatus,
    procedureItems,
    proceduresStatus,
    searchPatients: patients.onSearch,
    searchProcedures: procedures.onSearch,
    patientsPagination: patients.paginationProps,
    patientsSearching: patients.isSearching,
    appointmentsPagination: appointments.paginationProps,
    appointmentsSearching: appointments.isSearching,
    treatmentsPagination: treatments.paginationProps,
    treatmentsSearching: treatments.isSearching,
    proceduresPagination: procedures.paginationProps,
    proceduresSearching: procedures.isSearching,
  };
};
