"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import {
  checkCanCreate,
  checkCanDelete,
  checkCanUpdate,
} from "@/features/dashboard/utils";
import { PERMISSION_MODULES } from "@/features/dashboard/consts";
import { TreatmentsFormModal, TreatmentsTable, DeleteTreatmentModal } from "../components";
import { ITreatmentsItems } from "../interfaces";

export const TreatmentsTemplate = () => {
    const { data: userData } = useAppSelector(selectGetUserData);
    const canCreate = checkCanCreate(
        userData?.permissions,
        PERMISSION_MODULES.TREATMENTS,
    );
    const canUpdate = checkCanUpdate(
        userData?.permissions,
        PERMISSION_MODULES.TREATMENTS,
    );
    const canDelete = checkCanDelete(
        userData?.permissions,
        PERMISSION_MODULES.TREATMENTS,
    );

    const [treatmentModalOpen, setTreatmentModalOpen] = useState(false);
    const [selectedTreatment, setSelectedTreatment] = useState<ITreatmentsItems | null>(null);

    const [listRefreshKey, setListRefreshKey] = useState(0);
    const [deleteTreatmentModalOpen, setDeleteTreatmentModalOpen] = useState(false);
    const [treatmentToDelete, setTreatmentToDelete] = useState<ITreatmentsItems | null>(null);

    const refreshTreatmentsList = () => {
        setListRefreshKey((key) => key + 1);
    };

    const openCreateModal = () => {
        setSelectedTreatment(null);
        setTreatmentModalOpen(true);
    };

    const openEditModal = (treatment: ITreatmentsItems) => {
        setSelectedTreatment(treatment);
        setTreatmentModalOpen(true);
    };

    const handleModalOpenChange = (next: boolean) => {
        setTreatmentModalOpen(next);
        if (!next) setSelectedTreatment(null);
    };

    const openDeleteModal = (treatment: ITreatmentsItems) => {
        setTreatmentToDelete(treatment);
        setDeleteTreatmentModalOpen(true);
    };

    const handleDeleteModalOpenChange = (next: boolean) => {
        setDeleteTreatmentModalOpen(next);
        if (!next) setTreatmentToDelete(null);
    };

    return (
        <>
            <section className="mb-4 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-medium text-ink-950">
                        Servicios
                    </h1>
                    <p className="text-sm text-ink-700">
                        Gestión de servicios
                    </p>
                </div>
                {canCreate && (
                    <Button onClick={openCreateModal}>
                        <PlusIcon className="h-4 w-4" />
                        Agregar Servicio
                    </Button>
                )}
            </section>
            <TreatmentsTable
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                canUpdate={canUpdate}
                canDelete={canDelete}
                refreshKey={listRefreshKey}
            />
            {(canCreate || canUpdate) && (
                <TreatmentsFormModal
                    open={treatmentModalOpen}
                    onOpenChange={handleModalOpenChange}
                    treatment={selectedTreatment}
                    onSuccess={refreshTreatmentsList}
                />
            )}
            {canDelete && (
                <DeleteTreatmentModal
                    open={deleteTreatmentModalOpen}
                    onOpenChange={handleDeleteModalOpenChange}
                    treatment={treatmentToDelete}
                    onSuccess={refreshTreatmentsList}
                />
            )}
        </>
    );
};
