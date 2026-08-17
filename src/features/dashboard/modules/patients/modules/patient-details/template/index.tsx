"use client";

import { useState } from "react";
import { SquarePen } from "lucide-react";
import { Button } from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import {
    selectCurrentPatient,
    setCurrentPatient,
} from "@/store/patients/patiens-slice";
import { formatDate } from "@/utils";
import { PatientFormModal } from "../../../components";
import { persistPatientChart } from "../../../utils";

const Field = ({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) => (
    <div className="flex flex-col gap-1">
        <span className="text-xs text-ink-400">{label}</span>
        <span className="text-sm text-ink-100">{value?.trim() ? value : "—"}</span>
    </div>
);

export const PatientDetailsTemplate = () => {
    const dispatch = useAppDispatch();
    const patient = useAppSelector(selectCurrentPatient);
    const [editOpen, setEditOpen] = useState(false);

    if (!patient) {
        return (
            <p className="text-sm text-ink-400">
                Abre el expediente desde el listado de pacientes para ver los datos del paciente.
            </p>
        );
    }

    return (
        <>
            <section className="mb-4 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium text-ink-50">Datos del paciente</h2>
                    <p className="text-sm text-ink-300">Identificación y contacto</p>
                </div>
                <Button onClick={() => setEditOpen(true)}>
                    <SquarePen className="h-4 w-4" />
                    Editar
                </Button>
            </section>
            <div className="grid grid-cols-1 gap-5 rounded-lg border border-ink-800 bg-ink-900/30 p-5 md:grid-cols-2">
                <Field label="Nombre" value={patient.firstName} />
                <Field label="Segundo nombre" value={patient.secondName} />
                <Field label="Apellido" value={patient.firstSurname} />
                <Field label="Segundo apellido" value={patient.secondSurname} />
                <Field label="Tipo de identificación" value={patient.identificationType} />
                <Field label="Número de identificación" value={patient.identificationNumber} />
                <Field
                    label="Fecha de nacimiento"
                    value={formatDate(patient.birthDate, "d MMM yyyy")}
                />
                <Field label="Teléfono" value={patient.phoneNumber} />
                <Field label="Correo" value={patient.email} />
            </div>
            <PatientFormModal
                open={editOpen}
                onOpenChange={setEditOpen}
                patient={patient}
                onSuccess={() => {
                    persistPatientChart(patient);
                    dispatch(setCurrentPatient(patient));
                }}
            />
        </>
    );
};
