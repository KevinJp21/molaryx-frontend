'use client'

import { useEffect, useState } from "react"
import { Logs, Plus, SquarePen, Trash } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import { getProcedures, selectGetProcedures } from "@/store/procedures/procedures-slice"
import { IProceduresItems } from "../interfaces"
import {
    BaseTable,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Badge,
    Button,
    TableSkeleton,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components"
import { currencyFormat } from "@/utils"
import { ProcedureSidebar } from "./procedure-sidebar"
import { ProcedureTableFilter } from "./procedure-table-filter"
import { getProcedureStatusColor, type TProcedureStatusFilter } from "../consts"
import { TGetProceduresParams } from "../actions"
import { cn } from "@/lib/utils"

type Props = {
    onEdit: (procedure: IProceduresItems) => void;
    onDelete: (procedure: IProceduresItems) => void;
    onCreate: () => void;
    canUpdate?: boolean;
    canDelete?: boolean;
    canCreate?: boolean;
    refreshKey?: number;
};

export const ProceduresTable = ({
    onEdit,
    onDelete,
    onCreate,
    canUpdate = false,
    canDelete = false,
    canCreate = false,
    refreshKey = 0,
}: Props) => {
    const dispatch = useAppDispatch();
    const { data, status, message, error } = useAppSelector(selectGetProcedures);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<TProcedureStatusFilter>("all")

    const listFilters: Pick<TGetProceduresParams, "Search" | "IsActive"> = {
        ...(search.trim() ? { Search: search.trim() } : {}),
        ...(statusFilter !== "all" ? { IsActive: statusFilter } : {}),
    };

    const applyFilters = (filters: TGetProceduresParams) => {
        setStatusFilter(filters.IsActive ?? "all");
        setSearch(filters.Search ?? "");
        setCurrentPage(1);
    }

    useEffect(() => {
        dispatch(getProcedures({
            Page: currentPage,
            ...listFilters
        }));
    }, [dispatch, currentPage, refreshKey, search, statusFilter]);

    const items = data?.items ?? [];
    const totalPages = data?.totalPages ?? 0;
    const showActions = canUpdate || canDelete;
    const colSpan = showActions ? 5 : 4;

    useEffect(() => {
        if (status === "success" && items.length === 0 && currentPage > 1) {
            setCurrentPage((page) => page - 1);
        }
    }, [status, items.length, currentPage]);

    const filterParamsForForm: TGetProceduresParams = {
        Page: 1,
        ...(search.trim() ? { Search: search.trim() } : {}),
        ...(statusFilter !== "all" ? { IsActive: statusFilter } : {}),
    };

    useEffect(() => {
        if (status === "success" && items.length === 0 && currentPage > 1) {
            setCurrentPage((page) => page - 1);
        }
    }, [status, items.length, currentPage]);

    return (
        <div className="relative flex min-h-160 w-full flex-1 flex-col overflow-hidden rounded-2xl bg-ink-50 shadow-[0_1px_0_rgba(14,14,23,0.04),0_24px_48px_-28px_rgba(124,77,255,0.45)] ring-1 ring-ink-300/70">
            <section className="flex min-h-0 flex-1 overflow-hidden">
                <ProcedureSidebar
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
                    <div className="border-b border-ink-200 px-3 py-3 lg:hidden">
                        <div className="flex gap-x-3">
                            {canCreate && (
                                <Button
                                    className="mb-3 h-11 flex-1/2 justify-center gap-2 rounded-2xl"
                                    onClick={onCreate}
                                >
                                    <Plus className="size-5" />
                                    <span className="text-sm">Crear procedimiento</span>
                                </Button>
                            )}
                        </div>
                        <ProcedureTableFilter
                            params={filterParamsForForm}
                            onFiltersChange={applyFilters}
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
                                    <TableHead>Procedimiento</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead>Precio ref.</TableHead>
                                    <TableHead>Estado</TableHead>
                                    {showActions && (
                                        <TableHead className="w-14 text-right">Acciones</TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            {(status === "loading" || status === "idle") && (
                                <TableSkeleton columns={colSpan} rows={10} />
                            )}
                            <TableBody>
                                {status === "error" && (
                                    <TableRow>
                                        <TableCell colSpan={colSpan} className="py-16 text-center text-sm text-coral-500 bg-coral-500/10 hover:bg-coral-500/15">
                                            {error ?? message}
                                        </TableCell>
                                    </TableRow>
                                )}
                                {status === "success" && items.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={colSpan} className="py-16 text-center text-sm text-ink-600 group-hover/row:bg-transparent">
                                            No hay procedimientos con los filtros seleccionados.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {status === "success" &&
                                    items.map((item) => {
                                        return (
                                            <TableRow key={item.idProcedure}>
                                                <TableCell>
                                                    <div className="relative flex min-w-48 flex-col gap-0.5 border-l-2 pl-3"
                                                    style={{
                                                        borderLeftColor: getProcedureStatusColor(item.isActive)
                                                    }}
                                                    >
                                                        <span>{item.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-40">
                                                    <span className="line-clamp-2 text-ink-700 truncate">{item.description ?? "—"}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="tabular-nums text-ink-800">
                                                        {item.referencePrice != null
                                                            ? currencyFormat(item.referencePrice)
                                                            : "—"}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {item.isActive ? (
                                                        <Badge variant="success">Activo</Badge>
                                                    ) : (
                                                        <Badge variant="destructive">Inactivo</Badge>
                                                    )}
                                                </TableCell>
                                                {showActions && (
                                                    <TableCell className="text-right">
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon-sm"
                                                                    aria-label={`Acciones de ${item.name}`}
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
                                                                            className="text-xs justify-start text-ink-800 font-normal"
                                                                            aria-label={`Editar procedimiento ${item.name}`}
                                                                            onClick={() => onEdit(item)}
                                                                        >
                                                                            <SquarePen className="size-4" strokeWidth={1.75} />
                                                                            Editar
                                                                        </Button>
                                                                    )}
                                                                    {canDelete && (
                                                                        <Button
                                                                            variant="destructive"
                                                                            size="sm"
                                                                            className="text-xs justify-start text-ink-800 font-normal"
                                                                            aria-label={`Eliminar procedimiento ${item.name}`}
                                                                            onClick={() => onDelete(item)}
                                                                        >
                                                                            <Trash className="size-4" strokeWidth={1.75} />
                                                                            Eliminar
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        );
                                    })
                                }
                            </TableBody>
                        </Table>
                    </BaseTable>
                </div>
            </section>
        </div>
    )
}
