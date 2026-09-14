"use client";

import { TableFilters } from "@/components";
import { TGetTenantsParams } from "../actions";
import {
  TENANT_STATUS_FILTER_OPTIONS,
  type TTenantStatusFilter,
} from "../consts";

type TTenantsTableFilterProps = {
  params: TGetTenantsParams;
  onFiltersChange: (filters: TGetTenantsParams) => void;
};

type TFormValues = {
  searchTerm: string;
  idTenantStatus: TTenantStatusFilter;
};

const ALL_STATUSES_VALUE = "all" as const;

const STATUS_ITEMS = TENANT_STATUS_FILTER_OPTIONS.map((option) => ({
  value: option.value,
  name: option.label,
}));

export const TenantsTableFilter = ({
  params,
  onFiltersChange,
}: TTenantsTableFilterProps) => {
  const toQueryParams = (
    values: TFormValues,
    debouncedSearch = "",
  ): TGetTenantsParams => {
    const queryParams: TGetTenantsParams = {};
    const term = debouncedSearch.trim();
    if (term) queryParams.Search = term;
    if (values.idTenantStatus !== ALL_STATUSES_VALUE) {
      queryParams.IdTenantStatus = values.idTenantStatus;
    }
    return queryParams;
  };

  return (
    <TableFilters<TFormValues, TGetTenantsParams>
      defaultValues={{
        searchTerm: params.Search ?? "",
        idTenantStatus:
          (params.IdTenantStatus as TTenantStatusFilter | undefined) ??
          ALL_STATUSES_VALUE,
      }}
      searchField={{
        name: "searchTerm",
        label: "Buscar",
        placeholder: "Nombre, correo, ID…",
        debounceMs: 300,
      }}
      drawerFields={[
        {
          type: "select",
          name: "idTenantStatus",
          label: "Estado",
          placeholder: "Todos",
          allValue: ALL_STATUSES_VALUE,
          items: STATUS_ITEMS,
        },
      ]}
      toQueryParams={toQueryParams}
      onFiltersChange={onFiltersChange}
      drawerDescription="Filtra la lista de tenants por los criterios que necesites."
    />
  );
};
