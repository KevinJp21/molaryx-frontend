"use client";

import { TableFilters } from "@/components";
import { TGetTeamParams } from "../actions";
import {
  TEAM_ROLE_FILTER_OPTIONS,
  TEAM_STATUS_FILTER_OPTIONS,
  parseTeamRoleFilter,
  resolveTeamRoleFilterIds,
} from "../consts";

type TTeamTableFilterProps = {
  params: TGetTeamParams;
  onFiltersChange: (filters: TGetTeamParams) => void;
};

type TFormValues = {
  searchTerm: string;
  idUserStatus: number | typeof ALL_VALUE;
  idUserRole: number | typeof ALL_VALUE;
};

const ALL_VALUE = "all";

const STATUS_ITEMS = TEAM_STATUS_FILTER_OPTIONS.map((option) => ({
  value: option.value,
  name: option.label,
}));

const ROLE_ITEMS = [
  { value: ALL_VALUE, name: "Todos" },
  ...TEAM_ROLE_FILTER_OPTIONS.map((option) => ({
    value: option.value,
    name: option.label,
  })),
];

export const TeamTableFilter = ({
  params,
  onFiltersChange,
}: TTeamTableFilterProps) => {
  const toQueryParams = (
    values: TFormValues,
    debouncedSearch = "",
  ): TGetTeamParams => {
    const queryParams: TGetTeamParams = {};
    const term = debouncedSearch.trim();
    if (term) queryParams.Search = term;
    if (values.idUserStatus !== ALL_VALUE) {
      queryParams.IdUserStatus = values.idUserStatus;
    }
    queryParams.IdUserRoles = resolveTeamRoleFilterIds(
      values.idUserRole === ALL_VALUE ? "all" : values.idUserRole,
    );
    return queryParams;
  };

  const roleFilter = parseTeamRoleFilter(params.IdUserRoles);

  return (
    <TableFilters<TFormValues, TGetTeamParams>
      defaultValues={{
        searchTerm: params.Search ?? "",
        idUserStatus: params.IdUserStatus ?? ALL_VALUE,
        idUserRole: roleFilter === "all" ? ALL_VALUE : roleFilter,
      }}
      searchField={{
        name: "searchTerm",
        label: "Buscar",
        placeholder: "Nombre, usuario, correo…",
        debounceMs: 300,
      }}
      drawerFields={[
        {
          type: "select",
          name: "idUserStatus",
          label: "Estado",
          placeholder: "Todos",
          allValue: ALL_VALUE,
          items: STATUS_ITEMS,
        },
        {
          type: "select",
          name: "idUserRole",
          label: "Rol",
          placeholder: "Todos",
          allValue: ALL_VALUE,
          items: ROLE_ITEMS,
        },
      ]}
      toQueryParams={toQueryParams}
      onFiltersChange={onFiltersChange}
      drawerDescription="Filtra la lista del equipo por estado, rol o búsqueda."
    />
  );
};
