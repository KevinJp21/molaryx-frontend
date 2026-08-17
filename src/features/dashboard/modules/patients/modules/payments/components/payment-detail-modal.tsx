"use client";

import { Wallet } from "lucide-react";
import { BaseModal } from "@/components";
import { currencyFormat, formatDate } from "@/utils";
import { IPaymentItems } from "../interfaces";

type Props = {
    open: boolean;
    onOpenChange: (next: boolean) => void;
    payment: IPaymentItems | null;
};

const Field = ({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) => (
    <div className="flex flex-col gap-1">
        <span className="text-xs text-ink-400">{label}</span>
        <span className="text-sm text-ink-100">{value?.trim() ? value : "—"}</span>
    </div>
);

const paymentReference = (payment: IPaymentItems) => {
    if (payment.idAppointment) return "Cita";
    if (payment.idPatientTreatment) return "Plan de tratamiento";
    return "General";
};

export const PaymentDetailModal = ({
    open,
    onOpenChange,
    payment,
}: Props) => {
    if (!payment) return null;

    return (
        <BaseModal
            open={open}
            onOpenChange={onOpenChange}
            icon={<Wallet className="size-3.5" strokeWidth={2} />}
            title={currencyFormat(payment.amount)}
            description="Detalle del pago"
        >
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field
                        label="Fecha de pago"
                        value={formatDate(payment.paidAt, "d MMM yyyy · HH:mm", {
                            hour12: true,
                        })}
                    />
                    <Field label="Monto" value={currencyFormat(payment.amount)} />
                    <Field label="Método de pago" value={payment.paymentMethod} />
                    <Field label="Referencia" value={paymentReference(payment)} />
                </div>
                <div className="mt-5 flex flex-col gap-2">
                    <span className="text-xs text-ink-400">Notas</span>
                    <p className="whitespace-pre-wrap rounded-lg border border-ink-800 bg-ink-900/30 p-4 text-sm text-ink-100">
                        {payment.notes?.trim() ? payment.notes : "Sin notas."}
                    </p>
                </div>
            </div>
        </BaseModal>
    );
};
