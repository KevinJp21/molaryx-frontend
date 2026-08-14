"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components";
import { PatientFormModal, PatientsTable } from "../components";
import { IPatientsItems } from "../interfaces";

export const PatientsTemplate = () => {
    const [patientModalOpen, setPatientModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<IPatientsItems | null>(null);

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
            <PatientsTable onEdit={openEditModal} />
            <PatientFormModal
                open={patientModalOpen}
                onOpenChange={handleModalOpenChange}
                patient={selectedPatient}
            />
        </>
    );
};
