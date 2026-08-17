"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components";
import { TreatmentsFormModal, TreatmentsTable, DeleteTreatmentModal } from "../components";
import { ITreatmentsItems } from "../interfaces";

export const TreatmentsTemplate = () => {
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
                    <h1 className="text-xl font-medium text-ink-50">
                        Servicios
                    </h1>
                    <p className="text-sm text-ink-300">
                        Gestión de servicios
                    </p>
                </div>
                <Button onClick={openCreateModal}>
                    <PlusIcon className="h-4 w-4" />
                    Agregar Servicio
                </Button>
            </section>
            <TreatmentsTable
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                refreshKey={listRefreshKey}
            />
            <TreatmentsFormModal
                open={treatmentModalOpen}
                onOpenChange={handleModalOpenChange}
                treatment={selectedTreatment}
                onSuccess={refreshTreatmentsList}
            />
            <DeleteTreatmentModal
                open={deleteTreatmentModalOpen}
                onOpenChange={handleDeleteModalOpenChange}
                treatment={treatmentToDelete}
                onSuccess={refreshTreatmentsList}
            />
        </>
    );
};
