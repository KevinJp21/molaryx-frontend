"use client";

import { useState } from "react";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import { hasPermissionCode } from "@/features/dashboard/utils";
import { useDetailModalState } from "@/features/dashboard/hooks";
import {
  PatientTreatmentDetailModal,
  PatientTreatmentFormModal,
  PatientTreatmentsTable,
} from "../components";
import { IPatientTreatmentItems } from "../interfaces";

export const PatientTreatmentsTemplate = () => {
  const { data: userData } = useAppSelector(selectGetUserData);
  const canCreate = hasPermissionCode(
    userData?.permissions,
    "PATIENT_TREATMENTS",
    "CREATE_PATIENT_TREATMENT",
  );
  const canUpdate = hasPermissionCode(
    userData?.permissions,
    "PATIENT_TREATMENTS",
    "UPDATE_PATIENT_TREATMENT",
  );

  const [modalOpen, setModalOpen] = useState(false);
  const {
    open: detailModalOpen,
    selected: detailSelected,
    openDetails,
    handleOpenChange: handleDetailModalOpenChange,
  } = useDetailModalState<IPatientTreatmentItems>();
  const [selected, setSelected] = useState<IPatientTreatmentItems | null>(null);
  const [listRefreshKey, setListRefreshKey] = useState(0);

  const refreshList = () => setListRefreshKey((key) => key + 1);

  const openCreate = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const openEdit = (item: IPatientTreatmentItems) => {
    setSelected(item);
    setModalOpen(true);
  };

  const handleModalOpenChange = (next: boolean) => {
    setModalOpen(next);
    if (!next) setSelected(null);
  };

  return (
    <>
      <section className="mb-4 flex flex-col gap-1">
        <h1 className="text-xl font-medium text-ink-50">Planes de tratamiento</h1>
        <p className="text-sm text-ink-300">
          Planes asignados a los pacientes: busca, filtra y da seguimiento
        </p>
      </section>

      <PatientTreatmentsTable
        onEdit={openEdit}
        onViewDetails={openDetails}
        onCreate={canCreate ? openCreate : undefined}
        canCreate={canCreate}
        canUpdate={canUpdate}
        refreshKey={listRefreshKey}
      />

      <PatientTreatmentFormModal
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        patientTreatment={selected}
        onSuccess={refreshList}
      />
      <PatientTreatmentDetailModal
        open={detailModalOpen}
        onOpenChange={handleDetailModalOpenChange}
        patientTreatment={detailSelected}
      />
    </>
  );
};
