"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import { hasPermissionCode } from "@/features/dashboard/utils";
import {
  PatientTreatmentDetailModal,
  PatientTreatmentFormModal,
  PatientTreatmentsTable,
} from "../components";
import { IPatientTreatmentItems } from "../interfaces";

type Props = {
  encodedPatientId?: string;
};

export const PatientTreatmentsTemplate = ({ encodedPatientId }: Props) => {
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
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selected, setSelected] = useState<IPatientTreatmentItems | null>(null);
  const [detailSelected, setDetailSelected] =
    useState<IPatientTreatmentItems | null>(null);
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

  const openDetails = (item: IPatientTreatmentItems) => {
    setDetailSelected(item);
    setDetailModalOpen(true);
  };

  const handleModalOpenChange = (next: boolean) => {
    setModalOpen(next);
    if (!next) setSelected(null);
  };

  const handleDetailModalOpenChange = (next: boolean) => {
    setDetailModalOpen(next);
    if (!next) setDetailSelected(null);
  };

  return (
    <>
      <section className="mb-4 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-medium text-ink-50">
            Planes de tratamiento
          </h1>
          <p className="text-sm text-ink-300">
            Planes asignados a los pacientes
          </p>
        </div>
        {canCreate && (
          <Button onClick={openCreate}>
            <PlusIcon className="h-4 w-4" />
            Asignar tratamiento
          </Button>
        )}
      </section>
      <PatientTreatmentsTable
        encodedPatientId={encodedPatientId}
        onEdit={openEdit}
        onViewDetails={openDetails}
        canUpdate={canUpdate}
        refreshKey={listRefreshKey}
      />
      <PatientTreatmentFormModal
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        encodedPatientId={encodedPatientId}
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
