"use client";

import { useEffect, useState } from "react";
import { Building2, Logs, PlusIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { getTenants, selectGetTenants } from "@/store/tenants/tenants-slice";
import { useDetailModalState } from "@/features/dashboard/hooks";
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
import { cn } from "@/lib/utils";
import {
  getTenantStatusChipClass,
  getTenantStatusColor,
  getTenantTypeBadgeVariant,
  type TTenantStatusFilter,
} from "../consts";
import type { ITenantsItems } from "../interfaces";
import { TGetTenantsParams } from "../actions";
import { TenantDetailModal } from "./tenant-detail-modal";
import { TenantsSidebar } from "./tenants-sidebar";
import { TenantsTableFilter } from "./tenants-table-filter";

type Props = {
  refreshKey?: number;
  onRefresh?: () => void;
  onCreate?: () => void;
  canCreate?: boolean;
  emptyMessage?: string;
};

export const TenantsTable = ({
  refreshKey = 0,
  onRefresh,
  onCreate,
  canCreate = false,
  emptyMessage = "No hay tenants registrados.",
}: Props) => {
  const dispatch = useAppDispatch();
  const { data, status, message, error } = useAppSelector(selectGetTenants);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<TTenantStatusFilter>("all");
  const {
    open: detailOpen,
    selected: selectedTenant,
    openDetails,
    handleOpenChange: handleDetailOpenChange,
  } = useDetailModalState<ITenantsItems>();
  const colSpan = 8;

  const listFilters: Pick<TGetTenantsParams, "Search" | "IdTenantStatus"> = {
    ...(search.trim() ? { Search: search.trim() } : {}),
    ...(statusFilter !== "all" ? { IdTenantStatus: statusFilter } : {}),
  };

  const handleMobileFiltersChange = (filters: TGetTenantsParams) => {
    setSearch(filters.Search ?? "");
    setStatusFilter(
      filters.IdTenantStatus === undefined
        ? "all"
        : (filters.IdTenantStatus as TTenantStatusFilter),
    );
    setCurrentPage(1);
  };

  useEffect(() => {
    dispatch(
      getTenants({
        Page: currentPage,
        ...listFilters,
      }),
    );
  }, [dispatch, currentPage, refreshKey, search, statusFilter]);

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;
  const hasActiveFilters = Boolean(search.trim() || statusFilter !== "all");

  const filterParamsForForm: TGetTenantsParams = {
    Page: 1,
    ...(search.trim() ? { Search: search.trim() } : {}),
    ...(statusFilter !== "all" ? { IdTenantStatus: statusFilter } : {}),
  };

  useEffect(() => {
    if (status === "success" && items.length === 0 && currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  }, [status, items.length, currentPage]);

  return (
    <>
      <div className="relative flex min-h-160 w-full flex-1 flex-col overflow-hidden rounded-2xl bg-ink-950 shadow-[0_1px_0_rgba(14,14,23,0.04),0_24px_48px_-28px_rgba(124,77,255,0.45)] ring-1 ring-ink-700/70">
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <TenantsSidebar
            search={search}
            status={statusFilter}
            onSearchChange={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
            onStatusChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
            onCreateClick={onCreate}
            canCreate={canCreate}
          />

          <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
            <div className="border-b border-ink-800 px-3 py-3 lg:hidden">
              {canCreate && onCreate && (
                <Button
                  type="button"
                  className="mb-3 h-11 w-full justify-center gap-2 rounded-2xl"
                  onClick={onCreate}
                >
                  <PlusIcon className="size-4" />
                  Crear Business
                </Button>
              )}
              <TenantsTableFilter
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
                    <TableHead className="w-20">ID</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Identificación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-14 text-right">Acciones</TableHead>
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
                            <div className="relative rounded-3xl border border-ink-800 bg-linear-to-br from-ink-900/60 to-ink-900/20 p-5">
                              <Building2
                                className="size-12 text-ink-500/40"
                                strokeWidth={1.5}
                              />
                            </div>
                          </div>
                          <p className="text-base font-medium text-ink-50">
                            {hasActiveFilters
                              ? "Sin resultados"
                              : "Aún no hay tenants"}
                          </p>
                          <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
                            {hasActiveFilters
                              ? "No hay tenants con los filtros seleccionados. Ajusta la búsqueda o el estado."
                              : emptyMessage}
                          </p>
                          {!hasActiveFilters && canCreate && onCreate && (
                            <Button
                              type="button"
                              size="sm"
                              className="mt-5 rounded-xl"
                              onClick={onCreate}
                            >
                              <PlusIcon className="h-4 w-4" />
                              Crear Business
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {status === "success" &&
                    items.map((item) => (
                      <TableRow key={item.idTenant}>
                        <TableCell>
                          <span className="font-mono text-xs tabular-nums text-ink-300">
                            #{item.idTenant}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div
                            className="relative flex min-w-44 flex-col gap-0.5 border-l-2 pl-3"
                            style={{
                              borderLeftColor: getTenantStatusColor(
                                item.idTenantStatus,
                              ),
                            }}
                          >
                            <span className="font-medium text-ink-50">
                              {item.consultoryName}
                            </span>
                            <span className="text-xs text-ink-400">
                              {item.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getTenantTypeBadgeVariant(
                              item.idTenantType,
                            )}
                          >
                            {item.tenantTypeCode}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.owner ? (
                            <div className="flex flex-col gap-0.5">
                              <span>{item.owner.name}</span>
                              <span className="text-xs">
                                @{item.owner.username}
                              </span>
                            </div>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell>
                          {item.owner ? (
                            <div className="flex flex-col gap-0.5">
                              <span>{item.owner.email}</span>
                              <span className="text-xs">
                                {item.owner.phoneNumber}
                              </span>
                            </div>
                          ) : (
                            item.phoneNumber || "—"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span>{item.identificationCode || "—"}</span>
                            <span className="text-xs">
                              {item.identificationNumber ?? "—"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
                              getTenantStatusChipClass(item.idTenantStatus),
                            )}
                          >
                            <span
                              className="size-1.5 rounded-full"
                              style={{
                                backgroundColor: getTenantStatusColor(
                                  item.idTenantStatus,
                                ),
                              }}
                            />
                            {item.tenantStatusName}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Acciones de ${item.consultoryName}`}
                              >
                                <Logs className="size-4" strokeWidth={1.75} />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-2" align="end">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-xs font-normal text-ink-200"
                                onClick={() => openDetails(item)}
                              >
                                <Logs className="size-4" strokeWidth={1.75} />
                                Ver detalles
                              </Button>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </BaseTable>
          </div>
        </div>
      </div>

      <TenantDetailModal
        open={detailOpen}
        onOpenChange={handleDetailOpenChange}
        tenant={selectedTenant}
        onSuccess={onRefresh}
      />
    </>
  );
};
