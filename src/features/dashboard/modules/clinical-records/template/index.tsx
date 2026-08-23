"use client";

import { useState } from "react";
import { FileDownIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import { checkCanCreate, checkCanView } from "@/features/dashboard/utils";
import { PERMISSION_MODULES } from "@/features/dashboard/consts";
import { ClinicalRecordFormModal, ClinicalRecordsTable, ExportClinicalHistoryModal } from "../components";

export const ClinicalRecordsTemplate = () => {
  const { data: userData } = useAppSelector(selectGetUserData);
  const canView = checkCanView(
    userData?.permissions,
    PERMISSION_MODULES.CLINICAL_RECORDS,
  );
  const canCreate = checkCanCreate(
    userData?.permissions,
    PERMISSION_MODULES.CLINICAL_RECORDS,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [listRefreshKey, setListRefreshKey] = useState(0);

  const refreshList = () => setListRefreshKey((key) => key + 1);

  const [exportModalOpen, setExportModalOpen] = useState(false);

  return (
    <>
      <section className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-medium text-ink-50">Historia clínica</h1>
          <p className="text-sm text-ink-300">
            Registros clínicos del consultorio
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {canView && (
            <Button variant="destructive" onClick={() => setExportModalOpen(true)}>
              <FileDownIcon className="h-4 w-4" />
              Exportar historia clínica
            </Button>
          )}
          {canCreate && (
            <Button onClick={() => setModalOpen(true)}>
              <PlusIcon className="h-4 w-4" />
              Crear registro
            </Button>
          )}
        </div>
      </section>
      <ClinicalRecordsTable refreshKey={listRefreshKey} />
      <ClinicalRecordFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={refreshList}
      />
      <ExportClinicalHistoryModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
      />
    </>
  );
};
