"use client";

import { TableFilters } from "@/components";
import { IS_ACTIVE_STATUS, ALL_STATUSES_VALUE } from "@/features/dashboard/consts";
import { TGetProceduresParams } from "../actions";

type TProcedureTableFilterProps = {
    params: TGetProceduresParams;
    onFiltersChange: (filters: TGetProceduresParams) => void;
};

type TFormValues = {
    isActive: boolean | typeof ALL_STATUSES_VALUE;
    searchTerm: string;
}

const STATUS_ITEMS = [
    { value: ALL_STATUSES_VALUE, name: "Todos" },
    ...IS_ACTIVE_STATUS.map((s) => ({ value: s.value, name: s.name }))
];

export const ProcedureTableFilter = ({
    params,
    onFiltersChange
}: TProcedureTableFilterProps) => {
    const toQueryParams = (values: TFormValues, debouncedSearch = ""):
    TGetProceduresParams => {
        const queryParams: TGetProceduresParams = {};
        const term = debouncedSearch.trim();
        if (term) queryParams.Search = term;
        if (values.isActive !== ALL_STATUSES_VALUE) queryParams.IsActive = values.isActive;
        return queryParams;
    };

    return (
        <TableFilters<TFormValues, TGetProceduresParams>
            defaultValues={{
                searchTerm: params.Search ?? "",
                isActive: params.IsActive ?? ALL_STATUSES_VALUE,
            }}
            searchField={{
                name: "searchTerm",
                label: "Buscar",
                placeholder: "Procedimiento, descripción...",
                debounceMs: 300,
            }}
            drawerFields={[
                {
                    type: "select",
                    name: "isActive",
                    label: "Estado",
                    placeholder: "Todos",
                    allValue: ALL_STATUSES_VALUE,
                    items: STATUS_ITEMS,
                },
            ]}
            toQueryParams={toQueryParams}
            onFiltersChange={onFiltersChange}
            drawerDescription="Filtra la lista de procedimientos por los criterios que necesites."
        />
    );
}
