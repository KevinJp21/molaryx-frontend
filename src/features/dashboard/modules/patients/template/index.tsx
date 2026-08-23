"use client";

import { useState } from "react";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import {
  checkCanCreate,
  checkCanDelete,
  checkCanUpdate,
} from "@/features/dashboard/utils";
import { PERMISSION_MODULES } from "@/features/dashboard/consts";
import { PatientFormModal, PatientsTable, DeletePatientModal } from "../components";
import { IPatientsItems } from "../interfaces";

export const PatientsTemplate = () => {
    const { data: userData } = useAppSelector(selectGetUserData);
    const canCreate = checkCanCreate(
        userData?.permissions,
        PERMISSION_MODULES.PATIENTS,
    );
    const canUpdate = checkCanUpdate(
        userData?.permissions,
        PERMISSION_MODULES.PATIENTS,
    );
    const canDelete = checkCanDelete(
        userData?.permissions,
        PERMISSION_MODULES.PATIENTS,
    );

    const [patientModalOpen, setPatientModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<IPatientsItems | null>(null);

    const [listRefreshKey, setListRefreshKey] = useState(0);
    const [deletePatientModalOpen, setDeletePatientModalOpen] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState<IPatientsItems | null>(null);

    const refreshPatientsList = () => {
        setListRefreshKey((key) => key + 1);
    };

    const openCreateModal = () => {
        setSelectedPatient(null);
        setPatientModalOpen(true);
    };

    const openEditModal = (patient: IPatientsItems) => {
        setSelectedPatient(patient);
        setPatientModalOpen(true);
    };

    const handleModalOpenChange = (next: boolean) => {
        setPatientModalOpen(next);
        if (!next) setSelectedPatient(null);
    };

    const openDeleteModal = (patient: IPatientsItems) => {
        setPatientToDelete(patient);
        setDeletePatientModalOpen(true);
    };

    const handleDeleteModalOpenChange = (next: boolean) => {
        setDeletePatientModalOpen(next);
        if (!next) setPatientToDelete(null);
    };

    return (
        <>
            <section className="mb-4 flex flex-col gap-1">
                <h1 className="text-xl font-medium text-ink-50">Pacientes</h1>
                <p className="text-sm text-ink-300">
                    Directorio de la clínica: busca, filtra y gestiona fichas
                </p>
            </section>

            <PatientsTable
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                onCreate={openCreateModal}
                canCreate={canCreate}
                canUpdate={canUpdate}
                canDelete={canDelete}
                refreshKey={listRefreshKey}
            />

            {(canCreate || canUpdate) && (
                <PatientFormModal
                    open={patientModalOpen}
                    onOpenChange={handleModalOpenChange}
                    patient={selectedPatient}
                    onSuccess={refreshPatientsList}
                />
            )}
            {canDelete && (
                <DeletePatientModal
                    open={deletePatientModalOpen}
                    onOpenChange={handleDeleteModalOpenChange}
                    patient={patientToDelete}
                    onSuccess={refreshPatientsList}
                />
            )}
        </>
    );
};
