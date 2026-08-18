"use client";

import { useCallback, useEffect, useMemo } from "react";
import { Wallet } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
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
import {
    getAppointmentsList,
    selectGetAppointmentsList,
} from "@/store/appointments/appointments-slice";
import {
    getPatients,
    selectGetPatients,
} from "@/store/patients/patiens-slice";
import { colombiaToUtcIso, currencyFormat, formatDate } from "@/utils";
import { APPOINTMENT_STATUS } from "@/features/dashboard/modules/appointments/consts";
import { TREATMENT_STATUS } from "@/features/dashboard/modules/patients/modules/patient-treatments/consts";
import {
    PAYMENT_CONTEXT,
    PAYMENT_CONTEXT_OPTIONS,
    PAYMENT_METHOD_OPTIONS,
} from "../consts";
import {
    GlobalPaymentFormSchema,
    PAYMENT_FORM_DEFAULT_VALUES,
    PatientPaymentFormSchema,
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

const fullName = (...parts: Array<string | null | undefined>) =>
    parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

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
    const needsContextSelect =
        idAppointment == null && idPatientTreatment == null;
    const needsPatientSelect =
        needsContextSelect && !encodedPatientId && !idPatient;
    const { data: treatmentsData, status: treatmentsStatus } = useAppSelector(
        selectGetPatientTreatments,
    );
    const { data: appointmentsData, status: appointmentsStatus } =
        useAppSelector(selectGetAppointmentsList);
    const { data: patientsData, status: patientsStatus } =
        useAppSelector(selectGetPatients);
    const { status, message, error } = useAppSelector(selectPostCreatePayment);
    const isSubmitting = status === "loading";

    const methods = useForm<TPaymentForm, unknown, TPaymentFormValues>({
        mode: "onTouched",
        resolver: zodResolver(
            needsPatientSelect
                ? GlobalPaymentFormSchema
                : needsContextSelect
                    ? PatientPaymentFormSchema
                    : PaymentFormSchema,
        ),
        defaultValues: PAYMENT_FORM_DEFAULT_VALUES,
    });

    const { reset, handleSubmit, control, setValue } = methods;
    const paymentContext = useWatch({ control, name: "paymentContext" });
    const formEncodedPatientId = useWatch({ control, name: "encodedPatientId" });
    const selectedIdPatientTreatment = useWatch({
        control,
        name: "idPatientTreatment",
    });
    const patientKey = encodedPatientId ?? formEncodedPatientId;

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

    const appointmentItems = useMemo(
        () =>
            (appointmentsData?.items ?? [])
                .filter(
                    (item) =>
                        item.idAppointmentStatus !== APPOINTMENT_STATUS.CANCELLED &&
                        item.idAppointmentStatus !== APPOINTMENT_STATUS.NO_SHOW,
                )
                .map((item) => ({
                    value: item.idAppointment,
                    name: `${item.serviceName} · ${formatDate(item.startAt, "d MMM yyyy · HH:mm", { hour12: true })}`,
                })),
        [appointmentsData],
    );

    const patientItems = useMemo(
        () =>
            (patientsData?.items ?? [])
                .filter((item) => Boolean(item.encodedId))
                .map((item) => ({
                    value: item.encodedId as string,
                    name: fullName(
                        item.firstName,
                        item.secondName,
                        item.firstSurname,
                        item.secondSurname,
                    ),
                })),
        [patientsData],
    );

    const searchPatients = useCallback(
        (Search: string) => {
            dispatch(
                getPatients({
                    IsActive: true,
                    ...(Search ? { Search } : {}),
                }),
            );
        },
        [dispatch],
    );

    useEffect(() => {
        if (!open) return;

        reset({
            ...PAYMENT_FORM_DEFAULT_VALUES,
            paidAt: formatDate(new Date(), "yyyy-MM-dd'T'HH:mm"),
        });
    }, [open, reset]);

    useEffect(() => {
        if (!open || !needsPatientSelect) return;
        dispatch(getPatients({ IsActive: true }));
    }, [open, needsPatientSelect, dispatch]);

    useEffect(() => {
        if (!open || !needsContextSelect || !patientKey) return;

        if (paymentContext === PAYMENT_CONTEXT.APPOINTMENT) {
            dispatch(
                getAppointmentsList({ IdPatient: patientKey, Size: 50 }),
            );
            return;
        }

        if (paymentContext === PAYMENT_CONTEXT.PATIENT_TREATMENT) {
            dispatch(
                getPatientTreatments({ IdPatient: patientKey, Size: 50 }),
            );
        }
    }, [
        open,
        needsContextSelect,
        patientKey,
        paymentContext,
        dispatch,
    ]);

    const handleDialogOpenChange = (next: boolean) => {
        if (!next) {
            reset(PAYMENT_FORM_DEFAULT_VALUES);
            if (status !== "idle") dispatch(resetPostCreatePayment());
        }
        onOpenChange(next);
    };

    const resolveIdPatient = (
        formIdAppointment: number | null,
        formIdPatientTreatment: number | null,
    ) => {
        if (idPatient) return idPatient;

        const selectedPatient = (patientsData?.items ?? []).find(
            (item) => item.encodedId === patientKey,
        );
        if (selectedPatient) return selectedPatient.idPatient;

        const appointmentPatient = (appointmentsData?.items ?? []).find(
            (item) => item.idAppointment === formIdAppointment,
        )?.idPatient;
        if (appointmentPatient) return appointmentPatient;

        return (
            (treatmentsData?.items ?? []).find(
                (item) => item.idPatientTreatment === formIdPatientTreatment,
            )?.idPatient ?? null
        );
    };

    const onSubmit = (data: TPaymentFormValues) => {
        const targetIdAppointment = needsContextSelect
            ? data.paymentContext === PAYMENT_CONTEXT.APPOINTMENT
                ? data.idAppointment
                : null
            : (idAppointment ?? null);
        const targetIdPatientTreatment = needsContextSelect
            ? data.paymentContext === PAYMENT_CONTEXT.PATIENT_TREATMENT
                ? data.idPatientTreatment
                : null
            : (idPatientTreatment ?? null);
        const resolvedIdPatient = resolveIdPatient(
            targetIdAppointment,
            targetIdPatientTreatment,
        );

        if (!resolvedIdPatient) {
            toast.error("No se pudo identificar al paciente del pago.");
            return;
        }

        dispatch(
            postCreatePayment({
                idPatient: resolvedIdPatient,
                idAppointment: targetIdAppointment,
                idPatientTreatment: targetIdPatientTreatment,
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
    const showAppointmentSelect =
        needsContextSelect && paymentContext === PAYMENT_CONTEXT.APPOINTMENT;
    const showTreatmentSelect =
        needsContextSelect &&
        paymentContext === PAYMENT_CONTEXT.PATIENT_TREATMENT;

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
                    : needsPatientSelect
                        ? "Selecciona el paciente y si el pago corresponde a una cita o a un plan."
                        : needsContextSelect
                            ? "Elige si el pago corresponde a una cita o a un plan de tratamiento."
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
                            {needsPatientSelect && (
                                <CustomFormSelect
                                    name="encodedPatientId"
                                    label="Paciente"
                                    placeholder={
                                        patientsStatus === "loading"
                                            ? "Cargando pacientes..."
                                            : "Selecciona un paciente"
                                    }
                                    items={patientItems}
                                    disabled={
                                        patientsStatus === "loading" &&
                                        patientItems.length === 0
                                    }
                                    searchable
                                    searchPlaceholder="Buscar paciente..."
                                    onSearch={searchPatients}
                                    isSearching={patientsStatus === "loading"}
                                    onChange={() => {
                                        setValue("paymentContext", "");
                                        setValue("idAppointment", null);
                                        setValue("idPatientTreatment", null);
                                    }}
                                />
                            )}

                            {needsContextSelect &&
                                (!needsPatientSelect || Boolean(formEncodedPatientId)) && (
                                <CustomFormSelect
                                    name="paymentContext"
                                    label="Qué se está cobrando"
                                    placeholder="Selecciona el contexto del pago"
                                    items={PAYMENT_CONTEXT_OPTIONS}
                                    onChange={() => {
                                        setValue("idAppointment", null);
                                        setValue("idPatientTreatment", null);
                                    }}
                                />
                            )}

                            {showAppointmentSelect && (
                                <CustomFormSelect
                                    name="idAppointment"
                                    label="Cita"
                                    placeholder={
                                        appointmentsStatus === "loading"
                                            ? "Cargando citas..."
                                            : "Selecciona una cita"
                                    }
                                    items={appointmentItems}
                                    disabled={
                                        appointmentsStatus === "loading" &&
                                        appointmentItems.length === 0
                                    }
                                    searchable
                                    searchPlaceholder="Buscar cita..."
                                />
                            )}

                            {showAppointmentSelect &&
                                appointmentsStatus === "success" &&
                                appointmentItems.length === 0 && (
                                    <p className="text-xs text-ink-400">
                                        Este paciente no tiene citas disponibles para registrar
                                        un pago.
                                    </p>
                                )}

                            {showTreatmentSelect && (
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

                            {showTreatmentSelect &&
                                treatmentsStatus === "success" &&
                                treatmentItems.length === 0 && (
                                    <p className="text-xs text-ink-400">
                                        Este paciente no tiene planes de tratamiento activos
                                        para abonar.
                                    </p>
                                )}

                            {showTreatmentSelect &&
                                selectedTreatment?.periodicAmount != null && (
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
