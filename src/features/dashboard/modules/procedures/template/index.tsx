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
import { ProcedureFormModal, ProceduresTable, DeleteProcedureModal } from "../components";
import { IProceduresItems } from "../interfaces";

export const ProceduresTemplate = () => {
    const { data: userData } = useAppSelector(selectGetUserData);
    const canCreate = checkCanCreate(
        userData?.permissions,
        PERMISSION_MODULES.PROCEDURES,
    );
    const canUpdate = checkCanUpdate(
        userData?.permissions,
        PERMISSION_MODULES.PROCEDURES,
    );
    const canDelete = checkCanDelete(
        userData?.permissions,
        PERMISSION_MODULES.PROCEDURES,
    );

    const [procedureModalOpen, setProcedureModalOpen] = useState(false);
    const [selectedProcedure, setSelectedProcedure] = useState<IProceduresItems | null>(null);

    const [listRefreshKey, setListRefreshKey] = useState(0);
    const [deleteProcedureModalOpen, setDeleteProcedureModalOpen] = useState(false);
    const [procedureToDelete, setProcedureToDelete] = useState<IProceduresItems | null>(null);

    const refreshProceduresList = () => {
        setListRefreshKey((key) => key + 1);
    };

    const openCreateModal = () => {
        setSelectedProcedure(null);
        setProcedureModalOpen(true);
    };

    const openEditModal = (procedure: IProceduresItems) => {
        setSelectedProcedure(procedure);
        setProcedureModalOpen(true);
    };

    const handleModalOpenChange = (next: boolean) => {
        setProcedureModalOpen(next);
        if (!next) setSelectedProcedure(null);
    };

    const openDeleteModal = (procedure: IProceduresItems) => {
        setProcedureToDelete(procedure);
        setDeleteProcedureModalOpen(true);
    };

    const handleDeleteModalOpenChange = (next: boolean) => {
        setDeleteProcedureModalOpen(next);
        if (!next) setProcedureToDelete(null);
    };

    return (
        <>
            <section className="mb-4 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-medium text-ink-50">
                        Procedimientos
                    </h1>
                    <p className="text-sm text-ink-300">
                        Gestión de procedimientos
                    </p>
                </div>
                {canCreate && (
                    <Button onClick={openCreateModal}>
                        <PlusIcon className="h-4 w-4" />
                        Agregar procedimiento
                    </Button>
                )}
            </section>
            <ProceduresTable
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                canUpdate={canUpdate}
                canDelete={canDelete}
                refreshKey={listRefreshKey}
            />
            {(canCreate || canUpdate) && (
                <ProcedureFormModal
                    open={procedureModalOpen}
                    onOpenChange={handleModalOpenChange}
                    procedure={selectedProcedure}
                    onSuccess={refreshProceduresList}
                />
            )}
            {canDelete && (
                <DeleteProcedureModal
                    open={deleteProcedureModalOpen}
                    onOpenChange={handleDeleteModalOpenChange}
                    procedure={procedureToDelete}
                    onSuccess={refreshProceduresList}
                />
            )}
        </>
    );
};
