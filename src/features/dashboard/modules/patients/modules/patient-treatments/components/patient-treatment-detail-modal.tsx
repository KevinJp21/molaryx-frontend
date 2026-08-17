"use client";

import { ClipboardPlus } from "lucide-react";
import { Badge, BaseModal } from "@/components";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import { hasPermissionCode } from "@/features/dashboard/utils";
import { currencyFormat, formatDate } from "@/utils";
import { PaymentsTable } from "../../payments/components";
import { getTreatmentStatusLabel, TREATMENT_STATUS } from "../consts";
import { IPatientTreatmentItems } from "../interfaces";

type Props = {
    open: boolean;
    onOpenChange: (next: boolean) => void;
    encodedPatientId: string;
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
    if (id === TREATMENT_STATUS.ACTIVE) return "success" as const;
    if (id === TREATMENT_STATUS.CANCELLED) return "destructive" as const;
    if (id === TREATMENT_STATUS.COMPLETED) return "secondary" as const;
    return "muted" as const;
};

export const PatientTreatmentDetailModal = ({
    open,
    onOpenChange,
    encodedPatientId,
    patientTreatment,
}: Props) => {
    const { data: userData } = useAppSelector(selectGetUserData);
    const canViewPayments = hasPermissionCode(
        userData?.permissions,
        "PAYMENTS",
        "GET_PAYMENTS",
    );

    if (!patientTreatment) return null;

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
                        <Field label="Tratamiento" value={patientTreatment.treatmentName} />
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-ink-400">Estado</span>
                            <Badge variant={statusBadgeVariant(patientTreatment.idTreatmentStatus)}>
                                {getTreatmentStatusLabel(
                                    patientTreatment.idTreatmentStatus,
                                    patientTreatment.treatmentStatus,
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
                        <div className="flex flex-col gap-1">
                            <h3 className="text-sm font-medium text-ink-50">Pagos</h3>
                            <p className="text-xs text-ink-400">
                                Pagos registrados para este plan
                            </p>
                        </div>
                        {canViewPayments ? (
                            <PaymentsTable
                                encodedPatientId={encodedPatientId}
                                idPatientTreatment={patientTreatment.idPatientTreatment}
                                emptyMessage="Este plan no tiene pagos registrados."
                            />
                        ) : (
                            <p className="text-sm text-ink-400">
                                No tienes permiso para ver los pagos de este plan.
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </BaseModal>
    );
};
