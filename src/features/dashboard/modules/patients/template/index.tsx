"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { PatientsTable } from "../components";
import { Button } from "@/components";
import { NewPatientModal } from "../components";
export const PatientsTemplate = () => {
    const [newPatientOpen, setNewPatientOpen] = useState(false);
    return (
        <>
            <section className="flex justify-between items-center mb-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-medium text-ink-50">
                        Pacientes
                    </h1>
                    <p className="text-sm text-ink-300">
                        Gestión de pacientes
                    </p>
                </div>
                <Button
                    onClick={() => setNewPatientOpen(true)}
                >
                    <PlusIcon className="w-4 h-4" />
                    Agregar Paciente
                </Button>
            </section>
            <PatientsTable />
            <NewPatientModal
                open={newPatientOpen}
                onOpenChange={setNewPatientOpen}
            />
        </>
    )
}