"use client";

import { useEffect, useState } from "react";
import { Logs } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { getPayments, selectGetPayments } from "@/store/payments/payments-slice";
import { currencyFormat, formatDate } from "@/utils";
import {
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
import { IPaymentItems } from "../interfaces";
import { PaymentDetailModal } from "./payment-detail-modal";

type Props = {
    encodedPatientId?: string;
    idPatientTreatment?: number;
    idAppointment?: number;
    refreshKey?: number;
    emptyMessage?: string;
};

const paymentReference = (payment: IPaymentItems) => {
    if (payment.appointment) return "Cita";
    if (payment.patientTreatment) return "Plan de tratamiento";
    return "—";
};

const notePreview = (notes: string | null) => {
    const trimmed = notes?.trim();
    if (!trimmed) return "—";
    if (trimmed.length <= 60) return trimmed;
    return `${trimmed.slice(0, 60)}…`;
};

export const PaymentsTable = ({
    encodedPatientId,
    idPatientTreatment,
    idAppointment,
    refreshKey = 0,
    emptyMessage = "No hay pagos registrados.",
}: Props) => {
    const dispatch = useAppDispatch();
    const { data, status, message } = useAppSelector(selectGetPayments);
    const [currentPage, setCurrentPage] = useState(1);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<IPaymentItems | null>(null);
    const showReference =
        idPatientTreatment == null && idAppointment == null;
    const colSpan = showReference ? 6 : 5;

    useEffect(() => {
        setCurrentPage(1);
    }, [encodedPatientId, idPatientTreatment, idAppointment]);

    useEffect(() => {
        if (idAppointment != null) {
            dispatch(
                getPayments({
                    IdAppointment: idAppointment,
                    Page: currentPage,
                }),
            );
            return;
        }

        if (idPatientTreatment != null) {
            dispatch(
                getPayments({
                    IdPatientTreatment: idPatientTreatment,
                    Page: currentPage,
                }),
            );
            return;
        }

        if (!encodedPatientId) {
            dispatch(
                getPayments({
                    Page: currentPage,
                }),
            );
            return;
        }

        dispatch(
            getPayments({
                IdPatient: encodedPatientId,
                Page: currentPage,
            }),
        );
    }, [
        dispatch,
        encodedPatientId,
        idPatientTreatment,
        idAppointment,
        currentPage,
        refreshKey,
    ]);

    const items = data?.items ?? [];
    const totalPages = data?.totalPages ?? 0;

    useEffect(() => {
        if (status === "success" && items.length === 0 && currentPage > 1) {
            setCurrentPage((page) => page - 1);
        }
    }, [status, items.length, currentPage]);

    const openDetails = (payment: IPaymentItems) => {
        setSelectedPayment(payment);
        setDetailOpen(true);
    };

    const handleDetailOpenChange = (next: boolean) => {
        setDetailOpen(next);
        if (!next) setSelectedPayment(null);
    };

    return (
        <>
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
                                <TableHead>Fecha</TableHead>
                                <TableHead>Monto</TableHead>
                                <TableHead>Método</TableHead>
                                {showReference && <TableHead>Referencia</TableHead>}
                                <TableHead>Notas</TableHead>
                                <TableHead className="w-14 text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        {(status === "loading" || status === "idle") && (
                            <TableSkeleton columns={colSpan} rows={showReference ? 10 : 5} />
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
                                        {emptyMessage}
                                    </TableCell>
                                </TableRow>
                            )}
                            {status === "success" &&
                                items.map((item) => (
                                    <TableRow key={item.idPayment}>
                                        <TableCell>
                                            {formatDate(item.paidAt, "d MMM yyyy · HH:mm", {
                                                hour12: true,
                                            })}
                                        </TableCell>
                                        <TableCell className="font-mono tabular-nums">
                                            {currencyFormat(item.amount)}
                                        </TableCell>
                                        <TableCell>{item.paymentMethod}</TableCell>
                                        {showReference && (
                                            <TableCell>
                                                {paymentReference(item)}
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <span className="line-clamp-1 text-ink-300">
                                                {notePreview(item.notes)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        aria-label={`Ver pago del ${formatDate(item.paidAt, "d MMM yyyy")}`}
                                                    >
                                                        <Logs className="size-4" strokeWidth={1.75} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-56 p-2" align="end">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="w-full text-xs justify-start text-ink-200 font-normal"
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
            <PaymentDetailModal
                open={detailOpen}
                onOpenChange={handleDetailOpenChange}
                payment={selectedPayment}
            />
        </>
    );
};
