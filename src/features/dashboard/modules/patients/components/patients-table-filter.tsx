'use client';

import { TableFilters } from "@/components";
import { IS_ACTIVE_STATUS } from "@/features/dashboard/consts";
import { TGetPatientsParams } from "../actions";

type TPatientsTableFilterProps = {
    params: TGetPatientsParams;
    onFiltersChange: (filters: TGetPatientsParams) => void;
};

type TFormValues = {
    searchTerm: string;
    isActive: boolean | typeof ALL_STATUSES_VALUE;
};

const ALL_STATUSES_VALUE = "all";

const STATUS_ITEMS = [
    { value: ALL_STATUSES_VALUE, name: "Todos" },
    ...IS_ACTIVE_STATUS.map((s) => ({ value: s.value, name: s.name })),
];

export const PatientsTableFilter = ({
    params,
    onFiltersChange,
}: TPatientsTableFilterProps) => {
    const toQueryParams = (values: TFormValues, debouncedSearch = ""): TGetPatientsParams => {
        const queryParams: TGetPatientsParams = {};
        const term = debouncedSearch.trim();
        if (term) queryParams.Search = term;
        if (values.isActive !== ALL_STATUSES_VALUE) queryParams.IsActive = values.isActive;
        return queryParams;
    };

    return (
        <TableFilters<TFormValues, TGetPatientsParams>
            defaultValues={{
                searchTerm: params.Search ?? "",
                isActive: params.IsActive ?? ALL_STATUSES_VALUE,
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
                    name: "isActive",
                    label: "Estado",
                    placeholder: "Todos",
                    allValue: ALL_STATUSES_VALUE,
                    items: STATUS_ITEMS,
                },
            ]}
            toQueryParams={toQueryParams}
            onFiltersChange={onFiltersChange}
            drawerDescription="Filtra la lista de pacientes por los criterios que necesites."
        />
    );
};
