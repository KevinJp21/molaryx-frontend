'use client'

import { useEffect, useState } from "react"
import { Eye, Users } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import { getPatients, selectGetPatients } from "@/store/patients/patiens-slice"
import { formatDate } from "@/utils"
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
} from "@/components"

export const PatientsTable = () => {
    const dispatch = useAppDispatch();
    const { data, status, message } = useAppSelector(selectGetPatients);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(getPatients({
            Page: currentPage,
        }));
    }, [dispatch, currentPage])

    const items = data?.items ?? [];
    const totalPages = data?.totalPages ?? 0;
    const colSpan = 6;

    return (
        <section className="relative flex h-full w-full flex-col overflow-hidden">
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
                            <TableHead>Paciente</TableHead>
                            <TableHead>Identificación</TableHead>
                            <TableHead>Nacimiento</TableHead>
                            <TableHead>Contacto</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="w-14 text-right"> </TableHead>
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
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="opacity-0 transition-opacity group-hover/row:opacity-100 focus-visible:opacity-100"
                                                aria-label={`Ver ${fullName}`}
                                            >
                                                <Eye className="size-3.5" strokeWidth={1.75} />
                                            </Button>
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
