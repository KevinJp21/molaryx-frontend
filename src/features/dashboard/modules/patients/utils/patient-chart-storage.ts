import { IPatientsItems } from "../interfaces";

const storageKey = (idPatient: number) => `molaryx:patient-chart:${idPatient}`;

export const persistPatientChart = (patient: IPatientsItems) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(storageKey(patient.idPatient), JSON.stringify(patient));
};

export const readPersistedPatientChart = (idPatient: number): IPatientsItems | null => {
    if (typeof window === "undefined") return null;

    const raw = sessionStorage.getItem(storageKey(idPatient));
    if (!raw) return null;

    try {
        return JSON.parse(raw) as IPatientsItems;
    } catch {
        return null;
    }
};
