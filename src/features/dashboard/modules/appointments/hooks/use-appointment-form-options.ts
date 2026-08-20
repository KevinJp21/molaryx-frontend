"use client";

import { useMemo } from "react";
import { usePaginatedSelect } from "@/hooks";
import { useAppDispatch, useAppSelector } from "@/store";
import { getPatients, selectGetPatients } from "@/store/patients/patiens-slice";
import { getServices, selectGetServices } from "@/store/services/services-slice";
import { getProfessionals, selectGetProfessionals } from "@/store/professionals/professionals-slice";
import { getPatientTreatments, selectGetPatientTreatments } from "@/store/patient-treatments/patient-treatments-slice";
import { PATIENT_TREATMENT_STATUS } from "@/features/dashboard/modules/patient-treatments/consts";
import { APPOINTMENT_STATUS_OPTIONS } from "../consts/appointment-status";
import { USER_STATUS } from "../consts/user-status";
import { fullName } from "../utils/appointment-form-values";

type Params = {
  open: boolean;
  idPatient: number | null;
  currentIdPatientTreatment?: number | null;
  currentPatientTreatmentName?: string | null;
};

export const useAppointmentFormOptions = ({
  open,
  idPatient,
  currentIdPatientTreatment,
  currentPatientTreatmentName,
}: Params) => {
  const dispatch = useAppDispatch();
  const { data: patientsData, status: patientsStatus } =
    useAppSelector(selectGetPatients);
  const { data: servicesData, status: servicesStatus } =
    useAppSelector(selectGetServices);
  const { data: professionalsData, status: professionalsStatus } =
    useAppSelector(selectGetProfessionals);
  const { data: treatmentsData, status: treatmentsStatus } =
    useAppSelector(selectGetPatientTreatments);

  const patients = usePaginatedSelect({
    enabled: open,
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

  const professionals = usePaginatedSelect({
    enabled: open,
    data: professionalsData,
    status: professionalsStatus,
    fetchPage: ({ page, search }) => {
      dispatch(
        getProfessionals({
          IdUserStatus: USER_STATUS.ACTIVE,
          Page: page,
          ...(search ? { Search: search } : {}),
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

  const treatments = usePaginatedSelect({
    enabled: open && Boolean(idPatient),
    data: treatmentsData,
    status: treatmentsStatus,
    resetKey: idPatient,
    fetchPage: ({ page }) => {
      if (!idPatient) return;
      dispatch(
        getPatientTreatments({
          IdPatient: idPatient,
          IdPatientTreatmentStatus: PATIENT_TREATMENT_STATUS.ACTIVE,
          Page: page,
        }),
      );
    },
  });

  const patientItems = useMemo(
    () =>
      patients.items.map((patient) => ({
        value: patient.idPatient,
        name: fullName(
          patient.firstName,
          patient.secondName,
          patient.firstSurname,
          patient.secondSurname,
        ),
      })),
    [patients.items],
  );

  const serviceItems = useMemo(
    () =>
      services.items.map((service) => ({
        value: service.idService,
        name: service.name,
      })),
    [services.items],
  );

  const professionalItems = useMemo(
    () =>
      professionals.items.map((professional) => ({
        value: professional.idUser,
        name: fullName(
          professional.firstName,
          professional.secondName,
          professional.firstSurname,
          professional.secondSurname,
        ),
      })),
    [professionals.items],
  );

  const statusItems = APPOINTMENT_STATUS_OPTIONS.map((option) => ({
    value: option.id,
    name: option.label,
  }));

  const treatmentItems = useMemo(() => {
    const items = treatments.items
      .filter(
        (item) => !idPatient || Number(item.idPatient) === Number(idPatient),
      )
      .map((item) => ({
        value: item.idPatientTreatment,
        name: item.treatmentName,
      }));

    if (
      currentIdPatientTreatment &&
      !items.some((item) => item.value === currentIdPatientTreatment)
    ) {
      items.unshift({
        value: currentIdPatientTreatment,
        name: currentPatientTreatmentName?.trim() || "Plan asignado",
      });
    }

    return items;
  }, [
    treatments.items,
    idPatient,
    currentIdPatientTreatment,
    currentPatientTreatmentName,
  ]);

  return {
    patientItems,
    patientsStatus,
    professionalItems,
    professionalsStatus,
    serviceItems,
    servicesStatus,
    treatmentItems,
    treatmentsStatus,
    statusItems,
    searchPatients: patients.onSearch,
    searchProfessionals: professionals.onSearch,
    searchServices: services.onSearch,
    patientsPagination: patients.paginationProps,
    patientsSearching: patients.isSearching,
    professionalsPagination: professionals.paginationProps,
    professionalsSearching: professionals.isSearching,
    servicesPagination: services.paginationProps,
    servicesSearching: services.isSearching,
    treatmentsPagination: treatments.paginationProps,
    treatmentsSearching: treatments.isSearching,
  };
};
