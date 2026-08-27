"use client";

import { useEffect, useState } from "react";
import { Logs, PlusIcon, SquarePen, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { getTeam, selectGetTeam } from "@/store/team/team-slice";
import {
  Badge,
  BaseTable,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from "@/components";
import { TGetTeamParams } from "../actions";
import { IGetTeamResponseData } from "../interfaces";
import {
  getTeamRoleName,
  getTeamStatusBadgeVariant,
  getTeamStatusColor,
  parseTeamRoleFilter,
  resolveTeamRoleFilterIds,
  type TTeamRoleFilter,
  type TTeamStatusFilter,
} from "../consts";
import { memberFullName } from "../utils";
import { TeamSidebar } from "./team-sidebar";
import { TeamTableFilter } from "./team-table-filter";

type Props = {
  onCreate: () => void;
  onEdit: (member: IGetTeamResponseData) => void;
  canCreate?: boolean;
  canUpdate?: boolean;
  refreshKey?: number;
};

export const TeamTable = ({
  onCreate,
  onEdit,
  canCreate = false,
  canUpdate = false,
  refreshKey = 0,
}: Props) => {
  const dispatch = useAppDispatch();
  const { data, status, message, error } = useAppSelector(selectGetTeam);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TTeamStatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<TTeamRoleFilter>("all");

  const listFilters: Pick<
    TGetTeamParams,
    "Search" | "IdUserStatus" | "IdUserRoles"
  > = {
    ...(search.trim() ? { Search: search.trim() } : {}),
    ...(statusFilter !== "all" ? { IdUserStatus: statusFilter } : {}),
    IdUserRoles: resolveTeamRoleFilterIds(roleFilter),
  };

  const handleMobileFiltersChange = (filters: TGetTeamParams) => {
    setSearch(filters.Search ?? "");
    setStatusFilter(
      filters.IdUserStatus === undefined
        ? "all"
        : (filters.IdUserStatus as TTeamStatusFilter),
    );
    setRoleFilter(parseTeamRoleFilter(filters.IdUserRoles));
    setCurrentPage(1);
  };

  useEffect(() => {
    dispatch(
      getTeam({
        Page: currentPage,
        ...listFilters,
      }),
    );
  }, [dispatch, currentPage, refreshKey, search, statusFilter, roleFilter]);

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;
  const showActions = canUpdate;
  const colSpan = showActions ? 6 : 5;
  const hasActiveFilters = Boolean(
    search.trim() || statusFilter !== "all" || roleFilter !== "all",
  );

  const filterParamsForForm: TGetTeamParams = {
    Page: 1,
    ...listFilters,
  };

  useEffect(() => {
    if (status === "success" && items.length === 0 && currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  }, [status, items.length, currentPage]);

  return (
    <div className="relative flex min-h-160 w-full flex-1 flex-col overflow-hidden rounded-2xl bg-ink-50 shadow-[0_1px_0_rgba(14,14,23,0.04),0_24px_48px_-28px_rgba(124,77,255,0.45)] ring-1 ring-ink-300/70">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <TeamSidebar
          search={search}
          status={statusFilter}
          role={roleFilter}
          onSearchChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          onStatusChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
          onRoleChange={(value) => {
            setRoleFilter(value);
            setCurrentPage(1);
          }}
          onCreateClick={onCreate}
          canCreate={canCreate}
        />

        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="border-b border-ink-200 px-3 py-3 lg:hidden">
            {canCreate && (
              <Button
                type="button"
                className="mb-3 h-11 w-full justify-center gap-2 rounded-2xl"
                onClick={onCreate}
              >
                <PlusIcon className="size-4" />
                Agregar miembro
              </Button>
            )}
            <TeamTableFilter
              params={filterParamsForForm}
              onFiltersChange={handleMobileFiltersChange}
            />
          </div>

          <BaseTable
            className="h-full rounded-none border-0 bg-transparent shadow-none ring-0"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={status === "loading" || status === "idle"}
            totalItems={data?.totalItems ?? 0}
            totalItemsView={items.length}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Miembro</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Identificación</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Estado</TableHead>
                  {showActions && (
                    <TableHead className="text-right">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              {(status === "loading" || status === "idle") && (
                <TableSkeleton columns={colSpan} rows={10} />
              )}
              <TableBody>
                {status === "error" && (
                  <TableRow>
                    <TableCell
                      colSpan={colSpan}
                      className="bg-coral-500/10 py-16 text-center text-sm text-coral-500 hover:bg-coral-500/15"
                    >
                      {error ?? message}
                    </TableCell>
                  </TableRow>
                )}
                {status === "success" && items.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={colSpan}
                      className="py-16 group-hover/row:bg-transparent"
                    >
                      <div className="relative mx-auto flex max-w-sm flex-col items-center px-4 text-center">
                        <div className="relative mb-6">
                          <div className="absolute inset-0 scale-150 rounded-full bg-linear-to-br from-accent-500/5 via-transparent to-accent-500/5 blur-3xl" />
                          <div className="relative rounded-3xl border border-ink-200 bg-linear-to-br from-ink-100/60 to-ink-100/20 p-5">
                            <Users
                              className="size-12 text-ink-500/40"
                              strokeWidth={1.5}
                            />
                          </div>
                        </div>
                        <p className="text-base font-medium text-ink-950">
                          {hasActiveFilters
                            ? "Sin resultados"
                            : "Aún no hay miembros"}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                          {hasActiveFilters
                            ? "No hay miembros con los filtros seleccionados. Ajusta la búsqueda, el estado o el rol."
                            : "Invita al primer profesional o asistente para gestionar el equipo de la clínica."}
                        </p>
                        {!hasActiveFilters && canCreate && (
                          <Button
                            type="button"
                            size="sm"
                            className="mt-5 rounded-xl"
                            onClick={onCreate}
                          >
                            <PlusIcon className="h-4 w-4" />
                            Agregar miembro
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {status === "success" &&
                  items.map((item) => {
                    const fullName = memberFullName(
                      item.firstName,
                      item.secondName,
                      item.firstSurname,
                      item.secondSurname,
                    );

                    return (
                      <TableRow key={item.idUser}>
                        <TableCell>
                          <div
                            className="relative flex min-w-48 flex-col gap-0.5 border-l-2 pl-3"
                            style={{
                              borderLeftColor: getTeamStatusColor(
                                item.idUserStatus as TTeamStatusFilter,
                              ),
                            }}
                          >
                            <span className="font-medium text-ink-950">
                              {fullName}
                            </span>
                            <span className="text-xs text-ink-600">
                              @{item.username}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-ink-800">
                          {getTeamRoleName(item.idUserRole)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-ink-900">
                              {item.identificationType}
                            </span>
                            <span className="font-mono text-xs tabular-nums text-ink-600">
                              {item.identificationNumber}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-ink-800">{item.email}</span>
                            <span className="font-mono text-xs tabular-nums text-ink-600">
                              {item.phoneNumber}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getTeamStatusBadgeVariant(
                              item.idUserStatus,
                            )}
                          >
                            {item.statusName}
                          </Badge>
                        </TableCell>
                        {showActions && (
                          <TableCell className="text-right">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  aria-label={`Ver ${fullName}`}
                                >
                                  <Logs className="size-4" strokeWidth={1.75} />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-72 p-2" align="end">
                                <div className="flex flex-col gap-2">
                                  {canUpdate && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="justify-start text-xs font-normal text-ink-800"
                                      aria-label={`Editar miembro ${fullName}`}
                                      onClick={() => onEdit(item)}
                                    >
                                      <SquarePen
                                        className="size-4"
                                        strokeWidth={1.75}
                                      />
                                      Editar
                                    </Button>
                                  )}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </BaseTable>
        </div>
      </div>
    </div>
  );
};
