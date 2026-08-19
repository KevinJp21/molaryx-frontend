"use client";

import { useEffect, useState } from "react";
import { Logs, SquarePen } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
    getPatientTreatments,
    selectGetPatientTreatments,
} from "@/store/patient-treatments/patient-treatments-slice";
import { currencyFormat, formatDate } from "@/utils";
import { patientFullName } from "@/features/dashboard/modules/patients/utils";
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
import {
    TREATMENT_STATUS,
    getTreatmentStatusLabel,
    isFinalTreatmentStatus,
} from "../consts";
import { IPatientTreatmentItems } from "../interfaces";

type Props = {
    encodedPatientId?: string;
    onEdit: (item: IPatientTreatmentItems) => void;
    onViewDetails: (item: IPatientTreatmentItems) => void;
    canUpdate: boolean;
    refreshKey?: number;
};

const statusBadgeVariant = (id: number) => {
    if (id === TREATMENT_STATUS.ACTIVE) return "success" as const;
    if (id === TREATMENT_STATUS.CANCELLED) return "destructive" as const;
    if (id === TREATMENT_STATUS.COMPLETED) return "secondary" as const;
    return "muted" as const;
};

export const PatientTreatmentsTable = ({
    encodedPatientId,
    onEdit,
    onViewDetails,
    canUpdate,
    refreshKey = 0,
}: Props) => {
    const dispatch = useAppDispatch();
    const { data, status, message } = useAppSelector(selectGetPatientTreatments);
    const [currentPage, setCurrentPage] = useState(1);
    const items = data?.items ?? [];
    const totalPages = data?.totalPages ?? 0;
    const showPatient = !encodedPatientId;
    const colSpan = showPatient ? 7 : 6;

    useEffect(() => {
        setCurrentPage(1);
    }, [encodedPatientId]);

    useEffect(() => {
        dispatch(
            getPatientTreatments({
                ...(encodedPatientId ? { IdPatient: encodedPatientId } : {}),
                Page: currentPage,
            }),
        );
    }, [dispatch, encodedPatientId, currentPage, refreshKey]);

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
                            {showPatient && <TableHead>Paciente</TableHead>}
                            <TableHead>Tratamiento</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Inicio</TableHead>
                            <TableHead>Fin</TableHead>
                            <TableHead>Pago</TableHead>
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
                                    className="py-16 text-center text-sm text-coral-500 bg-coral-500/10 hover:bg-coral-500/15"
                                >
                                    {message}
                                </TableCell>
                            </TableRow>
                        )}
                        {status === "success" && items.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={colSpan}
                                    className="py-16 text-center text-sm text-ink-400 group-hover/row:bg-transparent"
                                >
                                    {showPatient
                                        ? "No hay planes de tratamiento asignados."
                                        : "Este paciente no tiene tratamientos asignados."}
                                </TableCell>
                            </TableRow>
                        )}
                        {status === "success" &&
                            items.map((item) => (
                                <TableRow key={item.idPatientTreatment}>
                                    {showPatient && (
                                        <TableCell>
                                            {patientFullName(
                                                item.patientName,
                                                item.patientSurname,
                                            ) || "—"}
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <div className="flex min-w-40 flex-col gap-0.5">
                                            <span>{item.treatmentName}</span>
                                            {item.notes && (
                                                <span className="text-xs text-ink-400 line-clamp-1">
                                                    {item.notes}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusBadgeVariant(item.idTreatmentStatus)}>
                                            {getTreatmentStatusLabel(
                                                item.idTreatmentStatus,
                                                item.treatmentStatus,
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(item.startAt, "d MMM yyyy", { hour12: true })}
                                    </TableCell>
                                    <TableCell>
                                        {item.endAt
                                            ? formatDate(item.endAt, "d MMM yyyy", { hour12: true })
                                            : "—"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <span>
                                                {item.agreedPrice != null
                                                    ? currencyFormat(item.agreedPrice)
                                                    : "—"}
                                            </span>
                                            <span className="text-xs text-ink-400">
                                                {item.paymentFrequency ?? "Sin frecuencia"}
                                                {item.periodicAmount != null
                                                    ? ` · ${currencyFormat(item.periodicAmount)}`
                                                    : ""}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    aria-label={`Acciones de ${item.treatmentName}`}
                                                >
                                                    <Logs className="size-4" strokeWidth={1.75} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-56 p-2" align="end">
                                                <div className="flex flex-col gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-xs justify-start text-ink-200 font-normal"
                                                        onClick={() => onViewDetails(item)}
                                                    >
                                                        <Logs className="size-4" strokeWidth={1.75} />
                                                        Ver detalles
                                                    </Button>
                                                    {canUpdate &&
                                                        !isFinalTreatmentStatus(
                                                            item.idTreatmentStatus,
                                                        ) && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-xs justify-start text-ink-200 font-normal"
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
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </BaseTable>
        </section>
    );
};
