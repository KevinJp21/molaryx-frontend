'use client'

import { useEffect, useState } from "react"
import { Logs, SquarePen, Trash } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import { getServices, selectGetServices } from "@/store/services/services-slice"
import { IServicesItems } from "../interfaces"
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

type Props = {
    onEdit: (service: IServicesItems) => void;
    onDelete: (service: IServicesItems) => void;
    refreshKey?: number;
};

export const ServicesTable = ({ onEdit, onDelete, refreshKey = 0 }: Props) => {
    const dispatch = useAppDispatch();
    const { data, status, message } = useAppSelector(selectGetServices);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(getServices({
            Page: currentPage,
        }));
    }, [dispatch, currentPage, refreshKey]);

    const items = data?.items ?? [];
    const totalPages = data?.totalPages ?? 0;
    const colSpan = 4;

    useEffect(() => {
        if (status === "success" && items.length === 0 && currentPage > 1) {
            setCurrentPage((page) => page - 1);
        }
    }, [status, items.length, currentPage]);

    return (
        <section className="relative flex w-full flex-col overflow-hidden">
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
                            <TableHead>Servicio</TableHead>
                            <TableHead>Descripción</TableHead>
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
                                    No hay servicios con los filtros seleccionados.
                                </TableCell>
                            </TableRow>
                        )}
                        {status === "success" &&
                            items.map((item) => {
                                return (
                                    <TableRow key={item.idService}>
                                        <TableCell>
                                            <span>{item.name}</span>
                                        </TableCell>
                                        <TableCell className="max-w-40">
                                            <span className="line-clamp-2 text-ink-300 truncate">{item.description ?? "—"}</span>
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
                                                        aria-label={`Acciones de ${item.name}`}
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
                                                            aria-label={`Editar servicio ${item.name}`}
                                                            onClick={() => onEdit(item)}
                                                        >
                                                            <SquarePen className="size-4" strokeWidth={1.75} />
                                                            Editar
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="text-xs justify-start text-ink-200 font-normal"
                                                            aria-label={`Eliminar servicio ${item.name}`}
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
