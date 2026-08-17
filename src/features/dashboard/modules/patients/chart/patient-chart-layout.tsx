"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ClipboardPlus, User } from "lucide-react";
import { Badge, Button } from "@/components";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import {
    selectCurrentPatient,
    selectGetPatients,
    setCurrentPatient,
} from "@/store/patients/patiens-slice";
import { hasPermissionCode } from "@/features/dashboard/utils";
import { patientFullName, persistPatientChart, readPersistedPatientChart } from "../utils";

type PatientChartContextValue = {
    encodedId: string;
    idPatient: number;
};

const PatientChartContext = createContext<PatientChartContextValue | null>(null);

export const usePatientChart = () => {
    const context = useContext(PatientChartContext);
    if (!context) {
        throw new Error("usePatientChart debe usarse dentro del expediente.");
    }
    return context;
};

type Props = {
    children: React.ReactNode;
    encodedId: string;
    idPatient: number;
};

export const PatientChartLayout = ({
    children,
    encodedId,
    idPatient,
}: Props) => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const currentPatient = useAppSelector(selectCurrentPatient);
    const { data: patientsData } = useAppSelector(selectGetPatients);
    const { data: userData } = useAppSelector(selectGetUserData);

    const patient = useMemo(() => {
        if (currentPatient?.idPatient === idPatient) return currentPatient;

        const fromList = patientsData?.items.find(
            (item) => item.idPatient === idPatient,
        );
        if (fromList) return fromList;

        return readPersistedPatientChart(idPatient);
    }, [idPatient, currentPatient, patientsData?.items]);

    useEffect(() => {
        if (!patient) return;
        persistPatientChart(patient);
        if (currentPatient?.idPatient !== patient.idPatient) {
            dispatch(setCurrentPatient(patient));
        }
    }, [patient, currentPatient?.idPatient, dispatch]);

    const canViewTreatments = hasPermissionCode(
        userData?.permissions,
        "PATIENT_TREATMENTS",
        "GET_PATIENT_TREATMENTS",
    );

    const fullName = patient
        ? patientFullName(
            patient.firstName,
            patient.secondName,
            patient.firstSurname,
            patient.secondSurname,
        )
        : "Paciente";

    const fichaHref = `/dashboard/patients/${encodedId}`;
    const treatmentsHref = `${fichaHref}/treatments`;

    const tabs = [
        { href: fichaHref, label: "Ficha", icon: User, exact: true },
        ...(canViewTreatments
            ? [{ href: treatmentsHref, label: "Tratamientos", icon: ClipboardPlus, exact: false }]
            : []),
    ];

    return (
        <PatientChartContext.Provider value={{ encodedId, idPatient }}>
            <div className="flex min-h-0 flex-1 flex-col">
                <section className="mb-4 flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="mt-0.5 h-8 w-8 shrink-0"
                            onClick={() => router.push("/dashboard/patients")}
                            aria-label="Volver a pacientes"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl font-medium text-ink-50">{fullName}</h1>
                                {patient && (
                                    patient.isActive ? (
                                        <Badge variant="success">Activo</Badge>
                                    ) : (
                                        <Badge variant="destructive">Inactivo</Badge>
                                    )
                                )}
                            </div>
                            <p className="text-sm text-ink-300">
                                {patient
                                    ? `${patient.identificationType} ${patient.identificationNumber}`
                                    : "Expediente del paciente"}
                            </p>
                        </div>
                    </div>
                    <nav className="flex gap-1 border-b border-ink-800">
                        {tabs.map((tab) => {
                            const isActive = tab.exact
                                ? pathname === tab.href
                                : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
                            const Icon = tab.icon;
                            return (
                                <Link
                                    key={tab.href}
                                    href={tab.href}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 text-sm border-b-2 -mb-px",
                                        isActive
                                            ? "border-accent-500 text-ink-50"
                                            : "border-transparent text-ink-400 hover:text-ink-200",
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                </Link>
                            );
                        })}
                    </nav>
                </section>
                {children}
            </div>
        </PatientChartContext.Provider>
    );
};
