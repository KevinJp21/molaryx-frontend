"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import { hasPermissionCode } from "@/features/dashboard/utils";
import { PatientTreatmentFormModal, PatientTreatmentsTable } from "../components";
import { IPatientTreatmentItems } from "../interfaces";

type Props = {
    encodedPatientId: string;
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
            <section className="mb-4 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium text-ink-50">
                        Tratamientos
                    </h2>
                    <p className="text-sm text-ink-300">
                        Planes asignados a este paciente
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
                canUpdate={canUpdate}
                refreshKey={listRefreshKey}
            />
            <PatientTreatmentFormModal
                open={modalOpen}
                onOpenChange={handleModalOpenChange}
                idPatient={encodedPatientId}
                patientTreatment={selected}
                onSuccess={refreshList}
            />
        </>
    );
};
