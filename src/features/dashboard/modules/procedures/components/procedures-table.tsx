'use client'

import { useEffect, useState } from "react"
import { Logs, SquarePen, Trash } from "lucide-react"
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

type Props = {
    onEdit: (procedure: IProceduresItems) => void;
    onDelete: (procedure: IProceduresItems) => void;
    refreshKey?: number;
};

export const ProceduresTable = ({ onEdit, onDelete, refreshKey = 0 }: Props) => {
    const dispatch = useAppDispatch();
    const { data, status, message, error } = useAppSelector(selectGetProcedures);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(getProcedures({
            Page: currentPage,
        }));
    }, [dispatch, currentPage, refreshKey]);

    const items = data?.items ?? [];
    const totalPages = data?.totalPages ?? 0;
    const colSpan = 5;

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
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Procedimiento</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Precio ref.</TableHead>
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
                                    {error ?? message}
                                </TableCell>
                            </TableRow>
                        )}
                        {status === "success" && items.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={colSpan} className="py-16 text-center text-sm text-ink-400 group-hover/row:bg-transparent">
                                    No hay procedimientos con los filtros seleccionados.
                                </TableCell>
                            </TableRow>
                        )}
                        {status === "success" &&
                            items.map((item) => {
                                return (
                                    <TableRow key={item.idProcedure}>
                                        <TableCell>
                                            <span>{item.name}</span>
                                        </TableCell>
                                        <TableCell className="max-w-40">
                                            <span className="line-clamp-2 text-ink-300 truncate">{item.description ?? "—"}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="tabular-nums text-ink-200">
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
                                                            aria-label={`Editar procedimiento ${item.name}`}
                                                            onClick={() => onEdit(item)}
                                                        >
                                                            <SquarePen className="size-4" strokeWidth={1.75} />
                                                            Editar
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="text-xs justify-start text-ink-200 font-normal"
                                                            aria-label={`Eliminar procedimiento ${item.name}`}
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
