'use client';

import { TableFilters } from "@/components";
import { TGetPatientTreatmentsParams } from "../actions";
import { PATIENT_TREATMENT_STATUS_OPTION } from "../consts/patient-treatment-status";

type TPatientsTableFilterProps = {
    params: TGetPatientTreatmentsParams;
    onFiltersChange: (filters: TGetPatientTreatmentsParams) => void;
};

type TFormValues = {
    searchTerm: string;
    idPatientTreatmentStatus: number | typeof ALL_PATIENT_TREATMENT_STATUS_VALUE;
};

const ALL_PATIENT_TREATMENT_STATUS_VALUE = "all";

const PATIENT_TREATMENT_STATUS_ITEMS = [
    { value: ALL_PATIENT_TREATMENT_STATUS_VALUE, name: "Todos" },
    ...PATIENT_TREATMENT_STATUS_OPTION.map((s) => ({ value: s.value, name: s.name })),
];

export const PatientsTreatmentFilter = ({
    params,
    onFiltersChange,
}: TPatientsTableFilterProps) => {
    const toQueryParams = (
        values: TFormValues,
        debouncedSearch = "",
    ): TGetPatientTreatmentsParams => {
        const queryParams: TGetPatientTreatmentsParams = {};
        const term = debouncedSearch.trim();
        if (term) queryParams.Search = term;
        if (values.idPatientTreatmentStatus !== ALL_PATIENT_TREATMENT_STATUS_VALUE) {
            queryParams.IdPatientTreatmentStatus = values.idPatientTreatmentStatus;
        }
        return queryParams;
    };

    return (
        <TableFilters<TFormValues, TGetPatientTreatmentsParams>
            defaultValues={{
                searchTerm: params.Search ?? "",
                idPatientTreatmentStatus:
                    params.IdPatientTreatmentStatus ?? ALL_PATIENT_TREATMENT_STATUS_VALUE,
            }}
            searchField={{
                name: "searchTerm",
                label: "Buscar",
                placeholder: "Nombre, cédula, teléfono…",
                debounceMs: 300,
            }}
            drawerFields={[
                {
                    type: "select",
                    name: "idPatientTreatmentStatus",
                    label: "Estado",
                    placeholder: "Todos",
                    allValue: ALL_PATIENT_TREATMENT_STATUS_VALUE,
                    items: PATIENT_TREATMENT_STATUS_ITEMS,
                },
            ]}
            toQueryParams={toQueryParams}
            onFiltersChange={onFiltersChange}
            drawerDescription="Filtra la lista de planes por los criterios que necesites."
        />
    );
};
