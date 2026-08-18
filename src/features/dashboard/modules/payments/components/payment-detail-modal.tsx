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

const fullName = (...parts: Array<string | null | undefined>) =>
    parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

export const PaymentDetailModal = ({
    open,
    onOpenChange,
    payment,
}: Props) => {
    if (!payment) return null;

    const appointment = payment.appointment;
    const patientTreatment = payment.patientTreatment;

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
                    <Field
                        label="Referencia"
                        value={
                            appointment
                                ? "Cita"
                                : patientTreatment
                                    ? "Plan de tratamiento"
                                    : "—"
                        }
                    />
                </div>

                {appointment && (
                    <section className="mt-5 flex flex-col gap-3 rounded-lg border border-ink-800 bg-ink-900/30 p-4">
                        <h3 className="text-sm font-medium text-ink-50">Cita</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field label="Servicio" value={appointment.serviceName} />
                            <Field
                                label="Estado"
                                value={appointment.appointmentStatus}
                            />
                            <Field
                                label="Fecha"
                                value={formatDate(
                                    appointment.startAt,
                                    "d MMM yyyy · HH:mm",
                                    { hour12: true },
                                )}
                            />
                            <Field
                                label="Profesional"
                                value={fullName(
                                    appointment.professionalName,
                                    appointment.professionalSurname,
                                )}
                            />
                        </div>
                    </section>
                )}

                {patientTreatment && (
                    <section className="mt-5 flex flex-col gap-3 rounded-lg border border-ink-800 bg-ink-900/30 p-4">
                        <h3 className="text-sm font-medium text-ink-50">
                            Plan de tratamiento
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field
                                label="Tratamiento"
                                value={patientTreatment.treatmentName}
                            />
                            <Field
                                label="Estado"
                                value={patientTreatment.treatmentStatus}
                            />
                            <Field
                                label="Inicio"
                                value={formatDate(
                                    patientTreatment.startAt,
                                    "d MMM yyyy · HH:mm",
                                    { hour12: true },
                                )}
                            />
                            <Field
                                label="Precio acordado"
                                value={
                                    patientTreatment.agreedPrice != null
                                        ? currencyFormat(patientTreatment.agreedPrice)
                                        : null
                                }
                            />
                        </div>
                    </section>
                )}

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
