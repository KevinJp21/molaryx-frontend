'use client'

import { useEffect, useState } from "react"
import { Logs, SquarePen, Trash } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import { getPatients, selectGetPatients } from "@/store/patients/patiens-slice"
import { formatDate } from "@/utils"
import { IPatientsItems } from "../interfaces"
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
import { PatientsTableFilter } from "."
import { TGetPatientsParams } from "../actions"

type Props = {
    onEdit: (patient: IPatientsItems) => void;
    onDelete: (patient: IPatientsItems) => void;
    refreshKey?: number;
};

export const PatientsTable = ({ onEdit, onDelete, refreshKey = 0 }: Props) => {
    const dispatch = useAppDispatch();
    const { data, status, message } = useAppSelector(selectGetPatients);
    const [currentPage, setCurrentPage] = useState(1);
    const [listFilters, setListFilters] = useState<Pick<TGetPatientsParams, "Search" | "IsActive">>({});

    const handleFiltersChange = (filters: TGetPatientsParams) => {
        setListFilters(filters);
        setCurrentPage(1);
    }

    useEffect(() => {
        dispatch(getPatients({
            Page: currentPage,
            ...listFilters,
        }));
    }, [dispatch, currentPage, refreshKey, listFilters]);

    const items = data?.items ?? [];
    const totalPages = data?.totalPages ?? 0;
    const colSpan = 6;

    const filterParamsForForm: TGetPatientsParams = { Page: 1, ...listFilters };

    useEffect(() => {
        if (status === "success" && items.length === 0 && currentPage > 1) {
            setCurrentPage((page) => page - 1);
        }
    }, [status, items.length, currentPage]);

    return (
        <section className="flex-1 relative flex w-full flex-col overflow-hidden">
            <BaseTable
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                isLoading={status === "loading" || status === "idle"}
                totalItems={data?.totalItems ?? 0}
                totalItemsView={items.length}
            >
                <PatientsTableFilter
                    params={filterParamsForForm}
                    onFiltersChange={handleFiltersChange}
                />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Paciente</TableHead>
                            <TableHead>Identificación</TableHead>
                            <TableHead>Nacimiento</TableHead>
                            <TableHead>Contacto</TableHead>
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
                                <TableCell colSpan={colSpan} className="py-16 text-center text-sm text-coral-500 bg-coral-500/10 hover:bg-coral-500/15">
                                    {message}
                                </TableCell>
                            </TableRow>
                        )}
                        {status === "success" && items.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={colSpan} className="py-16 text-center text-sm text-ink-400 group-hover/row:bg-transparent">
                                    No hay pacientes con los filtros seleccionados.
                                </TableCell>
                            </TableRow>
                        )}
                        {status === "success" &&
                            items.map((item) => {
                                const fullName = [item.firstName, item.secondName, item.firstSurname, item.secondSurname]
                                    .filter(Boolean)
                                    .join(" ");

                                return (
                                    <TableRow key={item.idPatient}>
                                        <TableCell>
                                            <div className="flex min-w-48 flex-col gap-0.5">
                                                <span>{fullName}</span>
                                                <span className="text-xs">{item.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                <span>{item.identificationType}</span>
                                                <span className="font-mono text-xs tabular-nums">
                                                    {item.identificationNumber}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(item.birthDate, "d MMM yyyy")}
                                        </TableCell>
                                        <TableCell className="tabular-nums font-mono">
                                            {item.phoneNumber}
                                        </TableCell>
                                        <TableCell>
                                            {item.isActive ? (
                                                <Badge variant="success">Activo</Badge>
                                            ) : (
                                                <Badge variant="destructive">Inactivo</Badge>
                                            )}
                                        </TableCell>
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
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-xs justify-start text-ink-200 font-normal"
                                                            aria-label={`Editar paciente ${fullName}`}
                                                            onClick={() => onEdit(item)}
                                                        >
                                                            <SquarePen className="size-4" strokeWidth={1.75} />
                                                            Editar
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="text-xs justify-start text-ink-200 font-normal"
                                                            aria-label={`Eliminar paciente ${fullName}`}
                                                            onClick={() => onDelete(item)}
                                                        >
                                                            <Trash className="size-4" strokeWidth={1.75} />
                                                            Eliminar
                                                        </Button>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </BaseTable>
        </section>
    )
}
