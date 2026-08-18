"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getPatients,
  selectGetPatients,
} from "@/store/patients/patiens-slice";
import {
  getServices,
  selectGetServices,
} from "@/store/services/services-slice";
import {
  getProfessionals,
  selectGetProfessionals,
} from "@/store/professionals/professionals-slice";
import {
  getPatientTreatments,
  selectGetPatientTreatments,
} from "@/store/patient-treatments/patient-treatments-slice";
import { TREATMENT_STATUS } from "@/features/dashboard/modules/patients/modules/patient-treatments/consts";
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

  const patientItems =
    patientsData?.items.map((patient) => ({
      value: patient.idPatient,
      name: fullName(
        patient.firstName,
        patient.secondName,
        patient.firstSurname,
        patient.secondSurname,
      ),
    })) ?? [];

  const serviceItems =
    servicesData?.items.map((service) => ({
      value: service.idService,
      name: service.name,
    })) ?? [];

  const professionalItems =
    professionalsData?.items.map((professional) => ({
      value: professional.idUser,
      name: fullName(
        professional.firstName,
        professional.secondName,
        professional.firstSurname,
        professional.secondSurname,
      ),
    })) ?? [];

  const statusItems = APPOINTMENT_STATUS_OPTIONS.map((option) => ({
    value: option.id,
    name: option.label,
  }));

  const treatmentItems = useMemo(() => {
    const items = (treatmentsData?.items ?? [])
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
    treatmentsData,
    idPatient,
    currentIdPatientTreatment,
    currentPatientTreatmentName,
  ]);

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

  const searchProfessionals = useCallback(
    (Search: string) => {
      dispatch(
        getProfessionals({
          IdUserStatus: USER_STATUS.ACTIVE,
          ...(Search ? { Search } : {}),
        }),
      );
    },
    [dispatch],
  );

  const searchServices = useCallback(
    (Search: string) => {
      dispatch(
        getServices({
          IsActive: true,
          ...(Search ? { Search } : {}),
        }),
      );
    },
    [dispatch],
  );

  const loadOptions = useCallback(() => {
    dispatch(getPatients({ IsActive: true }));
    dispatch(getServices({ IsActive: true }));
    dispatch(getProfessionals({ IdUserStatus: USER_STATUS.ACTIVE }));
  }, [dispatch]);

  useEffect(() => {
    if (!open || !idPatient) return;

    dispatch(
      getPatientTreatments({
        IdPatient: idPatient,
        IdTreatmentStatus: TREATMENT_STATUS.ACTIVE,
        Size: 50,
      }),
    );
  }, [open, idPatient, dispatch]);

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
    searchPatients,
    searchProfessionals,
    searchServices,
    loadOptions,
  };
};
