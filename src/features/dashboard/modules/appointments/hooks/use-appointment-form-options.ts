"use client";

import { useMemo } from "react";
import { usePaginatedSelect } from "@/hooks";
import { useAppDispatch, useAppSelector } from "@/store";
import { getPatients, selectGetPatients } from "@/store/patients/patiens-slice";
import { getProcedures, selectGetProcedures } from "@/store/procedures/procedures-slice";
import { getTeam, selectGetTeam } from "@/store/team/team-slice";
import { getPatientTreatments, selectGetPatientTreatments } from "@/store/patient-treatments/patient-treatments-slice";
import { PATIENT_TREATMENT_STATUS } from "@/features/dashboard/modules/patient-treatments/consts";
import { ROLES_IDS } from "@/consts";
import { APPOINTMENT_STATUS_OPTIONS } from "../consts/appointment-status";
import { USER_STATUS } from "../consts/user-status";
import { fullName } from "../utils/appointment-form-values";

/** Roles que pueden asignarse como profesional de una cita (oculto al usuario final). */
const APPOINTMENT_PROFESSIONAL_ROLES = [
  ROLES_IDS.OWNER,
  ROLES_IDS.PROFESSIONAL,
] as const;

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
  const { data: proceduresData, status: proceduresStatus } =
    useAppSelector(selectGetProcedures);
  const { data: professionalsData, status: professionalsStatus } =
    useAppSelector(selectGetTeam);
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
        getTeam({
          IdUserStatus: USER_STATUS.ACTIVE,
          IdUserRoles: [...APPOINTMENT_PROFESSIONAL_ROLES],
          Page: page,
          ...(search ? { Search: search } : {}),
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

  const procedureItems = useMemo(
    () =>
      procedures.items.map((procedure) => ({
        value: procedure.idProcedure,
        name: procedure.name,
      })),
    [procedures.items],
  );

  const procedureReferencePriceById = useMemo(() => {
    const map = new Map<number, number | null>();
    for (const procedure of procedures.items) {
      map.set(procedure.idProcedure, procedure.referencePrice ?? null);
    }
    return map;
  }, [procedures.items]);

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
    procedureItems,
    procedureReferencePriceById,
    proceduresStatus,
    treatmentItems,
    treatmentsStatus,
    statusItems,
    searchPatients: patients.onSearch,
    searchProfessionals: professionals.onSearch,
    searchProcedures: procedures.onSearch,
    patientsPagination: patients.paginationProps,
    patientsSearching: patients.isSearching,
    professionalsPagination: professionals.paginationProps,
    professionalsSearching: professionals.isSearching,
    proceduresPagination: procedures.paginationProps,
    proceduresSearching: procedures.isSearching,
    treatmentsPagination: treatments.paginationProps,
    treatmentsSearching: treatments.isSearching,
  };
};
