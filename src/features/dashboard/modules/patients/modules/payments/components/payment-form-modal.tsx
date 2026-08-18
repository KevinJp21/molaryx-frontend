"use client";

import { useEffect, useMemo } from "react";
import { Wallet } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    BaseModal,
    Button,
    CustomFormField,
    CustomFormSelect,
    CustomFormTextarea,
    Spinner,
} from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import {
    postCreatePayment,
    resetPostCreatePayment,
    selectPostCreatePayment,
} from "@/store/payments/payments-slice";
import {
    getPatientTreatments,
    selectGetPatientTreatments,
} from "@/store/patient-treatments/patient-treatments-slice";
import { colombiaToUtcIso, currencyFormat, formatDate } from "@/utils";
import { TREATMENT_STATUS } from "../../patient-treatments/consts";
import { PAYMENT_METHOD_OPTIONS } from "../consts";
import {
    PAYMENT_FORM_DEFAULT_VALUES,
    PatientTreatmentPaymentFormSchema,
    PaymentFormSchema,
    TPaymentForm,
    TPaymentFormValues,
} from "../schemas";

type Props = {
    open: boolean;
    onOpenChange: (next: boolean) => void;
    idPatient?: number;
    encodedPatientId?: string;
    idAppointment?: number;
    idPatientTreatment?: number;
    contextLabel?: string;
    onSuccess?: () => void;
};

export const PaymentFormModal = ({
    open,
    onOpenChange,
    idPatient,
    encodedPatientId,
    idAppointment,
    idPatientTreatment,
    contextLabel,
    onSuccess,
}: Props) => {
    const dispatch = useAppDispatch();
    const needsTreatmentSelect =
        idAppointment == null && idPatientTreatment == null;
    const { data: treatmentsData, status: treatmentsStatus } = useAppSelector(
        selectGetPatientTreatments,
    );
    const { status, message, error } = useAppSelector(selectPostCreatePayment);
    const isSubmitting = status === "loading";

    const methods = useForm<TPaymentForm, unknown, TPaymentFormValues>({
        mode: "onTouched",
        resolver: zodResolver(
            needsTreatmentSelect
                ? PatientTreatmentPaymentFormSchema
                : PaymentFormSchema,
        ),
        defaultValues: PAYMENT_FORM_DEFAULT_VALUES,
    });

    const { reset, handleSubmit, watch } = methods;
    const selectedIdPatientTreatment = watch("idPatientTreatment");

    const treatmentItems = useMemo(
        () =>
            (treatmentsData?.items ?? [])
                .filter(
                    (item) => item.idTreatmentStatus !== TREATMENT_STATUS.CANCELLED,
                )
                .map((item) => ({
                    value: item.idPatientTreatment,
                    name: item.agreedPrice
                        ? `${item.treatmentName} · ${currencyFormat(item.agreedPrice)}`
                        : item.treatmentName,
                })),
        [treatmentsData],
    );

    useEffect(() => {
        if (!open) return;

        reset({
            ...PAYMENT_FORM_DEFAULT_VALUES,
            paidAt: formatDate(new Date(), "yyyy-MM-dd'T'HH:mm"),
        });

        if (needsTreatmentSelect && encodedPatientId) {
            dispatch(
                getPatientTreatments({ IdPatient: encodedPatientId, Size: 50 }),
            );
        }
    }, [open, needsTreatmentSelect, encodedPatientId, dispatch, reset]);

    const handleDialogOpenChange = (next: boolean) => {
        if (!next) {
            reset(PAYMENT_FORM_DEFAULT_VALUES);
            if (status !== "idle") dispatch(resetPostCreatePayment());
        }
        onOpenChange(next);
    };

    const resolveIdPatient = (formIdPatientTreatment: number | null) => {
        if (idPatient) return idPatient;

        return (
            (treatmentsData?.items ?? []).find(
                (item) => item.idPatientTreatment === formIdPatientTreatment,
            )?.idPatient ?? null
        );
    };

    const onSubmit = (data: TPaymentFormValues) => {
        const targetIdPatientTreatment = needsTreatmentSelect
            ? data.idPatientTreatment
            : (idPatientTreatment ?? null);
        const resolvedIdPatient = resolveIdPatient(targetIdPatientTreatment);

        if (!resolvedIdPatient) {
            toast.error("No se pudo identificar al paciente del pago.");
            return;
        }

        dispatch(
            postCreatePayment({
                idPatient: resolvedIdPatient,
                idAppointment: idAppointment ?? null,
                idPatientTreatment: idAppointment ? null : targetIdPatientTreatment,
                amount: Number(data.amount),
                paidAt: colombiaToUtcIso(data.paidAt),
                idPaymentMethod: data.idPaymentMethod,
                notes: data.notes,
            }),
        );
    };

    useEffect(() => {
        if (status === "error") {
            toast.error(message, { description: error });
            dispatch(resetPostCreatePayment());
        }
        if (status === "success") {
            toast.success(message);
            handleDialogOpenChange(false);
            dispatch(resetPostCreatePayment());
            onSuccess?.();
        }
    }, [status, dispatch]);

    const selectedTreatment = (treatmentsData?.items ?? []).find(
        (item) => item.idPatientTreatment === selectedIdPatientTreatment,
    );

    return (
        <BaseModal
            open={open}
            onOpenChange={handleDialogOpenChange}
            icon={<Wallet className="size-3.5" strokeWidth={2} />}
            title={idAppointment ? "Registrar pago de la cita" : "Registrar pago"}
            description={
                contextLabel ??
                (idAppointment
                    ? "Registra el pago del servicio realizado en esta cita."
                    : "Registra un abono al plan de tratamiento del paciente.")
            }
        >
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                        <div className="flex flex-col gap-3">
                            {needsTreatmentSelect && (
                                <CustomFormSelect
                                    name="idPatientTreatment"
                                    label="Plan de tratamiento"
                                    placeholder={
                                        treatmentsStatus === "loading"
                                            ? "Cargando planes..."
                                            : "Selecciona un plan"
                                    }
                                    items={treatmentItems}
                                    disabled={
                                        treatmentsStatus === "loading" &&
                                        treatmentItems.length === 0
                                    }
                                    searchable
                                    searchPlaceholder="Buscar plan..."
                                />
                            )}

                            {needsTreatmentSelect &&
                                treatmentsStatus === "success" &&
                                treatmentItems.length === 0 && (
                                    <p className="text-xs text-ink-400">
                                        Este paciente no tiene planes de tratamiento activos
                                        para abonar.
                                    </p>
                                )}

                            {selectedTreatment?.periodicAmount != null && (
                                <p className="text-xs text-ink-400">
                                    Monto periódico acordado:{" "}
                                    {currencyFormat(selectedTreatment.periodicAmount)}
                                </p>
                            )}

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <CustomFormField
                                    name="amount"
                                    label="Monto"
                                    placeholder="0"
                                    mode="currency"
                                />
                                <CustomFormSelect
                                    name="idPaymentMethod"
                                    label="Método de pago"
                                    placeholder="Selecciona el método"
                                    items={PAYMENT_METHOD_OPTIONS}
                                />
                            </div>

                            <CustomFormField
                                name="paidAt"
                                label="Fecha de pago"
                                type="datetime"
                                placeholder="Selecciona la fecha del pago"
                            />

                            <CustomFormTextarea
                                name="notes"
                                label="Notas (opcional)"
                                placeholder="Ingresa una nota"
                            />
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-ink-800 bg-ink-900/40 px-5 py-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDialogOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" size="sm" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Spinner className="size-4" />
                                    Guardando...
                                </>
                            ) : (
                                "Registrar pago"
                            )}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </BaseModal>
    );
};
