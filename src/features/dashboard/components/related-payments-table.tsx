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
import { PaymentDetailModal } from "@/features/dashboard/modules/payments/components/payment-detail-modal";
import { IPaymentItems } from "@/features/dashboard/modules/payments/interfaces";

type RelatedPaymentsTableProps = {
    refreshKey?: number;
    emptyMessage?: string;
} & (
    | { idAppointment: number; idPatientTreatment?: never }
    | { idPatientTreatment: number; idAppointment?: never }
);

const notePreview = (notes: string | null) => {
    const trimmed = notes?.trim();
    if (!trimmed) return "—";
    if (trimmed.length <= 60) return trimmed;
    return `${trimmed.slice(0, 60)}…`;
};

export const RelatedPaymentsTable = ({
    idAppointment,
    idPatientTreatment,
    refreshKey = 0,
    emptyMessage = "No hay pagos registrados.",
}: RelatedPaymentsTableProps) => {
    const dispatch = useAppDispatch();
    const { data, status, message, error } = useAppSelector(selectGetPayments);
    const [currentPage, setCurrentPage] = useState(1);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<IPaymentItems | null>(null);
    const colSpan = 5;

    useEffect(() => {
        setCurrentPage(1);
    }, [idAppointment, idPatientTreatment]);

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

        dispatch(
            getPayments({
                IdPatientTreatment: idPatientTreatment,
                Page: currentPage,
            }),
        );
    }, [dispatch, idAppointment, idPatientTreatment, currentPage, refreshKey]);

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
                                <TableHead>Notas</TableHead>
                                <TableHead className="w-14 text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        {(status === "loading" || status === "idle") && (
                            <TableSkeleton columns={colSpan} rows={5} />
                        )}
                        <TableBody>
                            {status === "error" && (
                                <TableRow>
                                    <TableCell
                                        colSpan={colSpan}
                                        className="py-16 text-center text-sm text-coral-500 bg-coral-500/10 hover:bg-coral-500/15"
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
                                    <TableRow key={item.idPayment}>
                                        <TableCell>
                                            {formatDate(item.paidAt, "d MMM yyyy · HH:mm", {
                                                hour12: true,
                                            })}
                                        </TableCell>
                                        <TableCell className="tabular-nums">
                                            {currencyFormat(item.amount)}
                                        </TableCell>
                                        <TableCell>{item.paymentMethod}</TableCell>
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
