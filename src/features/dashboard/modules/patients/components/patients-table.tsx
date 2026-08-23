'use client'

import { useEffect, useState } from "react"
import { Logs, PlusIcon, SquarePen, Trash, User } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import { getPatients, selectGetPatients } from "@/store/patients/patiens-slice"
import { formatDate } from "@/utils"
import { IPatientsItems } from "../interfaces"
import { patientFullName } from "../utils"
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
import { PatientsSidebar } from "./patients-sidebar"
import { PatientsTableFilter } from "./patients-table-filter"
import { TGetPatientsParams } from "../actions"
import {
    getPatientStatusColor,
    type TPatientStatusFilter,
} from "../consts"

type Props = {
    onEdit: (patient: IPatientsItems) => void;
    onDelete: (patient: IPatientsItems) => void;
    onCreate: () => void;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
    refreshKey?: number;
};

export const PatientsTable = ({
    onEdit,
    onDelete,
    onCreate,
    canCreate = false,
    canUpdate = false,
    canDelete = false,
    refreshKey = 0,
}: Props) => {
    const dispatch = useAppDispatch();
    const { data, status, message, error } = useAppSelector(selectGetPatients);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<TPatientStatusFilter>("all");

    const listFilters: Pick<TGetPatientsParams, "Search" | "IsActive"> = {
        ...(search.trim() ? { Search: search.trim() } : {}),
        ...(statusFilter !== "all" ? { IsActive: statusFilter } : {}),
    };

    const handleMobileFiltersChange = (filters: TGetPatientsParams) => {
        setSearch(filters.Search ?? "");
        setStatusFilter(
            filters.IsActive === undefined ? "all" : filters.IsActive,
        );
        setCurrentPage(1);
    };

    useEffect(() => {
        dispatch(getPatients({
            Page: currentPage,
            ...listFilters,
        }));
    }, [dispatch, currentPage, refreshKey, search, statusFilter]);

    const items = data?.items ?? [];
    const totalPages = data?.totalPages ?? 0;
    const showActions = canUpdate || canDelete;
    const colSpan = showActions ? 6 : 5;
    const hasActiveFilters = Boolean(search.trim() || statusFilter !== "all");

    const filterParamsForForm: TGetPatientsParams = {
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
        <div className="relative flex min-h-160 w-full flex-1 flex-col overflow-hidden rounded-2xl bg-ink-950 shadow-[0_1px_0_rgba(14,14,23,0.04),0_24px_48px_-28px_rgba(124,77,255,0.45)] ring-1 ring-ink-700/70">
            <div className="flex min-h-0 flex-1 overflow-hidden">
                <PatientsSidebar
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
                        {canCreate && (
                            <Button
                                type="button"
                                className="mb-3 h-11 w-full justify-center gap-2 rounded-2xl"
                                onClick={onCreate}
                            >
                                <PlusIcon className="size-4" />
                                Agregar paciente
                            </Button>
                        )}
                        <PatientsTableFilter
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
                                    <TableHead>Paciente</TableHead>
                                    <TableHead>Identificación</TableHead>
                                    <TableHead>Nacimiento</TableHead>
                                    <TableHead>Contacto</TableHead>
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
                                                        <User className="size-12 text-ink-500/40" strokeWidth={1.5} />
                                                    </div>
                                                </div>
                                                <p className="text-base font-medium text-ink-50">
                                                    {hasActiveFilters
                                                        ? "Sin resultados"
                                                        : "Aún no hay pacientes"}
                                                </p>
                                                <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
                                                    {hasActiveFilters
                                                        ? "No hay pacientes con los filtros seleccionados. Ajusta la búsqueda o el estado."
                                                        : "Registra el primer paciente para empezar a gestionar fichas, citas y tratamientos."}
                                                </p>
                                                {!hasActiveFilters && canCreate && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        className="mt-5 rounded-xl"
                                                        onClick={onCreate}
                                                    >
                                                        <PlusIcon className="h-4 w-4" />
                                                        Agregar paciente
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {status === "success" &&
                                    items.map((item) => {
                                        const fullName = patientFullName(
                                            item.firstName,
                                            item.secondName,
                                            item.firstSurname,
                                            item.secondSurname,
                                        );

                                        return (
                                            <TableRow key={item.idPatient}>
                                                <TableCell>
                                                    <div
                                                        className="relative flex min-w-48 flex-col gap-0.5 border-l-2 pl-3"
                                                        style={{
                                                            borderLeftColor: getPatientStatusColor(
                                                                item.isActive,
                                                            ),
                                                        }}
                                                    >
                                                        <span className="font-medium text-ink-50">
                                                            {fullName}
                                                        </span>
                                                        <span className="text-xs text-ink-400">
                                                            {item.email}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-ink-100">
                                                            {item.identificationType}
                                                        </span>
                                                        <span className="font-mono text-xs tabular-nums text-ink-400">
                                                            {item.identificationNumber}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-ink-200">
                                                    {formatDate(item.birthDate, "d MMM yyyy")}
                                                </TableCell>
                                                <TableCell className="font-mono tabular-nums text-ink-200">
                                                    {item.phoneNumber}
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
                                                                            className="justify-start text-xs font-normal text-ink-200"
                                                                            aria-label={`Editar paciente ${fullName}`}
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
                                                                            className="justify-start text-xs font-normal text-ink-200"
                                                                            aria-label={`Eliminar paciente ${fullName}`}
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
            </div>
        </div>
    )
}
