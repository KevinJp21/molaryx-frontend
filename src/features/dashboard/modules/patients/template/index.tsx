"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components";
import { PatientFormModal, PatientsTable, DeletePatientModal } from "../components";
import { IPatientsItems } from "../interfaces";
import { persistPatientChart } from "../utils";
import { useAppDispatch } from "@/store";
import { setCurrentPatient } from "@/store/patients/patiens-slice";
import { apiEncodeIdAction } from "../actions";

export const PatientsTemplate = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
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

    const openChart = async (patient: IPatientsItems) => {
        persistPatientChart(patient);
        dispatch(setCurrentPatient(patient));
        const encodedId = await apiEncodeIdAction(patient.idPatient);
        router.push(`/dashboard/patients/${encodedId}`);
    };

    return (
        <>
            <section className="mb-4 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-medium text-ink-50">
                        Pacientes
                    </h1>
                    <p className="text-sm text-ink-300">
                        Gestión de pacientes
                    </p>
                </div>
                <Button onClick={openCreateModal}>
                    <PlusIcon className="h-4 w-4" />
                    Agregar Paciente
                </Button>
            </section>
            <PatientsTable
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                onOpenChart={openChart}
                refreshKey={listRefreshKey}
            />
            <PatientFormModal
                open={patientModalOpen}
                onOpenChange={handleModalOpenChange}
                patient={selectedPatient}
                onSuccess={refreshPatientsList}
            />
            <DeletePatientModal
                open={deletePatientModalOpen}
                onOpenChange={handleDeleteModalOpenChange}
                patient={patientToDelete}
                onSuccess={refreshPatientsList}
            />
        </>
    );
};
