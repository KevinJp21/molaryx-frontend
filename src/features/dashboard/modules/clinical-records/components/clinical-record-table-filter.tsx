'use client';

import { TableFilters } from "@/components";
import { TGetClinicalRecordsParams } from "../actions";

type TClinicalRecordTableFilterProps = {
    params: TGetClinicalRecordsParams;
    onFiltersChange: (filters: TGetClinicalRecordsParams) => void;
};

type TFormValues = {
    searchTerm: string;
    from: string;
    to: string;
};

export const ClinicalRecordTableFilter = ({ params, onFiltersChange} : TClinicalRecordTableFilterProps) => {
    const toQueryParams = (values: TFormValues, debouncedSearch = ""): TGetClinicalRecordsParams => {
        const queryParams: TGetClinicalRecordsParams = {};
        const term = debouncedSearch.trim();
        if (term) queryParams.Search = term;
        if (values.from) queryParams.From = values.from;
        if (values.to) queryParams.To = values.to;
        return queryParams;
    };

    return(
        <TableFilters<TFormValues, TGetClinicalRecordsParams>
            defaultValues={{
                searchTerm: params.Search ?? "",
                from: params.From ?? "",
                to: params.To ?? "",
            }}
            searchField={{
                name: "searchTerm",
                label: "Buscar",
                placeholder: "Nombre, cédula, teléfono…",
                debounceMs: 300,
            }}
            drawerFields={[
                {
                    type: "field",
                    name: "from",
                    label: "Desde",
                    fieldType: "date"
                },
                {
                    type: "field",
                    name: "to",
                    label: "Hasta",
                    fieldType: "date"
                }
            ]}
            toQueryParams={toQueryParams}
            onFiltersChange={onFiltersChange}
            drawerDescription="Filtra la lista de registros clínicos por los criterios que necesites."
        />
    )
}
