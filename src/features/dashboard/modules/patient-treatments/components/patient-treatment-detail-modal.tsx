"use client";

import { useState } from "react";
import { ClipboardPlus, PlusIcon } from "lucide-react";
import { Badge, BaseModal, Button } from "@/components";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import { hasPermissionCode } from "@/features/dashboard/utils";
import { currencyFormat, formatDate } from "@/utils";
import { RelatedPaymentsTable } from "@/features/dashboard/components";
import {
    PaymentFormModal,
    PaymentSummaryByConcept,
} from "@/features/dashboard/modules/payments/components";
import { getTreatmentStatusLabel, PATIENT_TREATMENT_STATUS } from "../consts";
import { IPatientTreatmentItems } from "../interfaces";

type Props = {
    open: boolean;
    onOpenChange: (next: boolean) => void;
    patientTreatment: IPatientTreatmentItems | null;
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

const statusBadgeVariant = (id: number) => {
    if (id === PATIENT_TREATMENT_STATUS.ACTIVE) return "success" as const;
    if (id === PATIENT_TREATMENT_STATUS.CANCELLED) return "destructive" as const;
    if (id === PATIENT_TREATMENT_STATUS.COMPLETED) return "secondary" as const;
    return "muted" as const;
};

export const PatientTreatmentDetailModal = ({
    open,
    onOpenChange,
    patientTreatment,
}: Props) => {
    const { data: userData } = useAppSelector(selectGetUserData);
    const canViewPayments = hasPermissionCode(
        userData?.permissions,
        "PAYMENTS",
        "GET_PAYMENTS",
    );
    const canViewPaymentSummary = hasPermissionCode(
        userData?.permissions,
        "PAYMENTS",
        "GET_PAYMENTS_SUMMARY_BY_CONCEPT",
    );
    const canCreatePayment = hasPermissionCode(
        userData?.permissions,
        "PAYMENTS",
        "CREATE_PAYMENT",
    );
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paymentsRefreshKey, setPaymentsRefreshKey] = useState(0);

    if (!patientTreatment) return null;

    const canReceivePayment =
        patientTreatment.idPatientTreatmentStatus !== PATIENT_TREATMENT_STATUS.CANCELLED;

    const paymentSummary =
        patientTreatment.agreedPrice != null
            ? currencyFormat(patientTreatment.agreedPrice)
            : "—";

    const frequencySummary = [
        patientTreatment.paymentFrequency ?? "Sin frecuencia",
        patientTreatment.periodicAmount != null
            ? currencyFormat(patientTreatment.periodicAmount)
            : null,
    ]
        .filter(Boolean)
        .join(" · ");

    return (
        <BaseModal
            open={open}
            onOpenChange={onOpenChange}
            icon={<ClipboardPlus className="size-3.5" strokeWidth={2} />}
            title={patientTreatment.treatmentName}
            description="Detalle del plan de tratamiento"
            className="max-w-4xl"
        >
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 gap-4 rounded-lg border border-ink-800 bg-ink-900/30 p-4 md:grid-cols-2">
                        <Field
                            label="Paciente"
                            value={
                                [patientTreatment.patientName, patientTreatment.patientSurname]
                                    .filter(Boolean)
                                    .join(" ")
                                    .trim() || "—"
                            }
                        />
                        <Field label="Tratamiento" value={patientTreatment.treatmentName} />
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-ink-400">Estado</span>
                            <Badge variant={statusBadgeVariant(patientTreatment.idPatientTreatmentStatus)}>
                                {getTreatmentStatusLabel(
                                    patientTreatment.idPatientTreatmentStatus,
                                    patientTreatment.patientTreatmentStatus,
                                )}
                            </Badge>
                        </div>
                        <Field
                            label="Fecha de inicio"
                            value={formatDate(patientTreatment.startAt, "d MMM yyyy · HH:mm", {
                                hour12: true,
                            })}
                        />
                        <Field
                            label="Fecha de finalización"
                            value={
                                patientTreatment.endAt
                                    ? formatDate(patientTreatment.endAt, "d MMM yyyy · HH:mm", {
                                          hour12: true,
                                      })
                                    : null
                            }
                        />
                        <Field label="Precio acordado" value={paymentSummary} />
                        <Field label="Frecuencia de pago" value={frequencySummary} />
                        <Field
                            label="Notas"
                            value={patientTreatment.notes}
                        />
                    </div>

                    <section className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-sm font-medium text-ink-50">Pagos</h3>
                                <p className="text-xs text-ink-400">
                                    Pagos registrados para este plan
                                </p>
                            </div>
                            {canCreatePayment && canReceivePayment && (
                                <Button
                                    size="sm"
                                    onClick={() => setPaymentModalOpen(true)}
                                >
                                    <PlusIcon className="h-4 w-4" />
                                    Registrar abono
                                </Button>
                            )}
                        </div>
                        {canViewPaymentSummary && (
                            <PaymentSummaryByConcept
                                open={open}
                                idPatientTreatment={patientTreatment.idPatientTreatment}
                                refreshKey={paymentsRefreshKey}
                            />
                        )}
                        {canViewPayments ? (
                            <RelatedPaymentsTable
                                idPatientTreatment={patientTreatment.idPatientTreatment}
                                refreshKey={paymentsRefreshKey}
                                emptyMessage="Este plan no tiene pagos registrados."
                            />
                        ) : !canViewPaymentSummary ? (
                            <p className="text-sm text-ink-400">
                                No tienes permiso para ver los pagos de este plan.
                            </p>
                        ) : null}
                    </section>
                </div>
            </div>
            <PaymentFormModal
                open={paymentModalOpen}
                onOpenChange={setPaymentModalOpen}
                idPatient={patientTreatment.idPatient}
                idPatientTreatment={patientTreatment.idPatientTreatment}
                contextLabel={`Abono al plan ${patientTreatment.treatmentName}`}
                onSuccess={() => setPaymentsRefreshKey((key) => key + 1)}
            />
        </BaseModal>
    );
};
