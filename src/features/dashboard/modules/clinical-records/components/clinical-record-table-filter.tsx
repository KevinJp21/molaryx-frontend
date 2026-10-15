'use client';

import { TableFilters } from "@/components";
import { TGetClinicalRecordsParams } from "../actions";

type TClinicalRecordTableFilterProps = {
    params: TGetClinicalRecordsParams;
    onFiltersChange: (filters: TGetClinicalRecordsParams) => void;
};

type TFormValues = {
    searchTerm: string;
};

export const ClinicalRecordTableFilter = ({ params, onFiltersChange} : TClinicalRecordTableFilterProps) => {
    const toQueryParams = (values: TFormValues, debouncedSearch = ""): TGetClinicalRecordsParams => {
        const queryParams: TGetClinicalRecordsParams = {};
        const term = debouncedSearch.trim();
        if (term) queryParams.Search = term;
        return queryParams;
    };

    return(
        <TableFilters<TFormValues, TGetClinicalRecordsParams>
            defaultValues={{
                searchTerm: params.Search ?? ""
            }}
            searchField={{
                name: "searchTerm",
                label: "Buscar",
                placeholder: "Nombre, cédula, teléfono…",
                debounceMs: 300,
            }}
            toQueryParams={toQueryParams}
            onFiltersChange={onFiltersChange}
            drawerDescription="Filtra la lista de registros clínicos por los criterios que necesites."
        />
    )
}
