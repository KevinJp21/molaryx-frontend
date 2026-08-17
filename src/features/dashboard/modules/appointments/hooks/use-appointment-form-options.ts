"use client";

import { useCallback } from "react";
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
import { APPOINTMENT_STATUS_OPTIONS } from "../consts/appointment-status";
import { USER_STATUS } from "../consts/user-status";
import { fullName } from "../utils/appointment-form-values";

export const useAppointmentFormOptions = () => {
  const dispatch = useAppDispatch();
  const { data: patientsData, status: patientsStatus } =
    useAppSelector(selectGetPatients);
  const { data: servicesData, status: servicesStatus } =
    useAppSelector(selectGetServices);
  const { data: professionalsData, status: professionalsStatus } =
    useAppSelector(selectGetProfessionals);

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

  return {
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
    loadOptions,
  };
};
