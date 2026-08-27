"use client";

import { useEffect, useState } from "react";
import { Logs } from "lucide-react";
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
} from "../consts";
import type { ITenantsItems } from "../interfaces";
import { TenantDetailModal } from "./tenant-detail-modal";

type Props = {
  refreshKey?: number;
  onRefresh?: () => void;
  emptyMessage?: string;
};

export const TenantsTable = ({
  refreshKey = 0,
  onRefresh,
  emptyMessage = "No hay tenants registrados.",
}: Props) => {
  const dispatch = useAppDispatch();
  const { data, status, message, error } = useAppSelector(selectGetTenants);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    open: detailOpen,
    selected: selectedTenant,
    openDetails,
    handleOpenChange: handleDetailOpenChange,
  } = useDetailModalState<ITenantsItems>();
  const colSpan = 8;

  useEffect(() => {
    dispatch(
      getTenants({
        Page: currentPage,
      }),
    );
  }, [dispatch, currentPage, refreshKey]);

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;

  useEffect(() => {
    if (status === "success" && items.length === 0 && currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  }, [status, items.length, currentPage]);

  return (
    <>
      <section className="relative flex w-full flex-1 flex-col overflow-hidden">
        <BaseTable
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
                    className="py-16 text-center text-sm text-ink-400 group-hover/row:bg-transparent"
                  >
                    {emptyMessage}
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
                      <div className="flex min-w-44 flex-col gap-0.5">
                        <span>{item.consultoryName}</span>
                        <span className="text-xs">{item.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTenantTypeBadgeVariant(item.idTenantType)}>
                        {item.tenantTypeCode}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.owner ? (
                        <div className="flex flex-col gap-0.5">
                          <span>{item.owner.name}</span>
                          <span className="text-xs">@{item.owner.username}</span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>
                      {item.owner ? (
                        <div className="flex flex-col gap-0.5">
                          <span>{item.owner.email}</span>
                          <span className="text-xs">{item.owner.phoneNumber}</span>
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
      </section>

      <TenantDetailModal
        open={detailOpen}
        onOpenChange={handleDetailOpenChange}
        tenant={selectedTenant}
        onSuccess={onRefresh}
      />
    </>
  );
};
