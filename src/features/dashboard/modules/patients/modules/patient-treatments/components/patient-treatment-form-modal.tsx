"use client";

import { useEffect } from "react";
import { ClipboardPlus, SquarePen } from "lucide-react";
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
    getTreatments,
    selectGetTreatments,
} from "@/store/treatments/treatments-slice";
import {
    postCreatePatientTreatment,
    putUpdatePatientTreatment,
    resetPostCreatePatientTreatment,
    resetPutUpdatePatientTreatment,
    selectPostCreatePatientTreatment,
    selectPutUpdatePatientTreatment,
} from "@/store/patient-treatments/patient-treatments-slice";
import { colombiaToUtcIso, formatDate } from "@/utils";
import {
    PAYMENT_FREQUENCY,
    PAYMENT_FREQUENCY_OPTIONS,
    getAllowedTreatmentStatuses,
    TREATMENT_STATUS_LABEL,
} from "../consts";
import { IPatientTreatmentItems } from "../interfaces";
import {
    PATIENT_TREATMENT_FORM_DEFAULT_VALUES,
    PatientTreatmentFormSchema,
    TPatientTreatmentForm,
    TPatientTreatmentFormValues,
} from "../schemas";

type Props = {
    open: boolean;
    onOpenChange: (next: boolean) => void;
    idPatient: string;
    patientTreatment?: IPatientTreatmentItems | null;
    onSuccess?: () => void;
};

const toOptionalNumber = (value: number | string | null | undefined) => {
    if (value == null || value === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const toFormValues = (
    patientTreatment?: IPatientTreatmentItems | null,
): TPatientTreatmentForm => {
    if (!patientTreatment) {
        return {
            ...PATIENT_TREATMENT_FORM_DEFAULT_VALUES,
            startAt: formatDate(new Date(), "yyyy-MM-dd'T'HH:mm"),
        };
    }

    return {
        idTreatment: patientTreatment.idTreatment,
        startAt: formatDate(patientTreatment.startAt, "yyyy-MM-dd'T'HH:mm"),
        agreedPrice: patientTreatment.agreedPrice,
        idPaymentFrequency:
            patientTreatment.idPaymentFrequency ?? PAYMENT_FREQUENCY.NONE,
        periodicAmount: patientTreatment.periodicAmount,
        idTreatmentStatus: patientTreatment.idTreatmentStatus,
        notes: patientTreatment.notes,
    };
};

export const PatientTreatmentFormModal = ({
    open,
    onOpenChange,
    idPatient,
    patientTreatment = null,
    onSuccess,
}: Props) => {
    const dispatch = useAppDispatch();
    const isEdit = Boolean(patientTreatment);
    const { data: treatmentsData, status: treatmentsStatus } =
        useAppSelector(selectGetTreatments);
    const {
        status: postStatus,
        message: postMessage,
        error: postError,
    } = useAppSelector(selectPostCreatePatientTreatment);
    const {
        status: putStatus,
        message: putMessage,
        error: putError,
    } = useAppSelector(selectPutUpdatePatientTreatment);
    const isSubmitting = isEdit
        ? putStatus === "loading"
        : postStatus === "loading";

    const methods = useForm<
        TPatientTreatmentForm,
        unknown,
        TPatientTreatmentFormValues
    >({
        mode: "onTouched",
        resolver: zodResolver(PatientTreatmentFormSchema),
        defaultValues: PATIENT_TREATMENT_FORM_DEFAULT_VALUES,
    });

    const { reset, handleSubmit, control } = methods;
    const idPaymentFrequency = useWatch({ control, name: "idPaymentFrequency" });
    const showPeriodicAmount =
        Number(idPaymentFrequency) !== PAYMENT_FREQUENCY.NONE &&
        Number(idPaymentFrequency) !== PAYMENT_FREQUENCY.ONE_TIME;

    const treatmentItems = (treatmentsData?.items ?? []).map((item) => ({
        value: item.idTreatment,
        name: item.name,
    }));

    const statusOptions = patientTreatment
        ? getAllowedTreatmentStatuses(patientTreatment.idTreatmentStatus).map(
            (id) => ({
                value: id,
                name: TREATMENT_STATUS_LABEL[id],
            }),
        )
        : [];

    useEffect(() => {
        if (!open) return;
        if (!isEdit) {
            dispatch(getTreatments({ IsActive: true, Size: 10 }));
        }
        reset(toFormValues(patientTreatment));
    }, [open, isEdit, patientTreatment, dispatch, reset]);

    const handleDialogOpenChange = (next: boolean) => {
        if (!next) {
            reset(PATIENT_TREATMENT_FORM_DEFAULT_VALUES);
            if (isEdit) {
                if (putStatus !== "idle") dispatch(resetPutUpdatePatientTreatment());
            } else if (postStatus !== "idle") {
                dispatch(resetPostCreatePatientTreatment());
            }
        }
        onOpenChange(next);
    };

    const onSubmit = (data: TPatientTreatmentFormValues) => {
        const idPaymentFrequency =
            data.idPaymentFrequency === PAYMENT_FREQUENCY.NONE
                ? null
                : data.idPaymentFrequency;
        const periodicAmount =
            idPaymentFrequency &&
            idPaymentFrequency !== PAYMENT_FREQUENCY.ONE_TIME
                ? toOptionalNumber(data.periodicAmount)
                : null;

        if (isEdit && patientTreatment) {
            dispatch(
                putUpdatePatientTreatment({
                    idPatientTreatment: patientTreatment.idPatientTreatment,
                    agreedPrice: toOptionalNumber(data.agreedPrice),
                    idPaymentFrequency,
                    periodicAmount,
                    startAt: colombiaToUtcIso(data.startAt),
                    idTreatmentStatus: data.idTreatmentStatus,
                    notes: data.notes,
                }),
            );
            return;
        }

        dispatch(
            postCreatePatientTreatment({
                idPatient,
                idTreatment: data.idTreatment,
                agreedPrice: toOptionalNumber(data.agreedPrice),
                idPaymentFrequency,
                periodicAmount,
                startAt: colombiaToUtcIso(data.startAt),
                notes: data.notes,
            }),
        );
    };

    useEffect(() => {
        if (isEdit) return;

        if (postStatus === "error") {
            toast.error(postMessage, { description: postError });
            dispatch(resetPostCreatePatientTreatment());
        }
        if (postStatus === "success") {
            toast.success(postMessage);
            handleDialogOpenChange(false);
            dispatch(resetPostCreatePatientTreatment());
            onSuccess?.();
        }
    }, [postStatus, isEdit, dispatch]);

    useEffect(() => {
        if (!isEdit) return;

        if (putStatus === "error") {
            toast.error(putMessage, { description: putError });
            dispatch(resetPutUpdatePatientTreatment());
        }
        if (putStatus === "success") {
            toast.success(putMessage);
            handleDialogOpenChange(false);
            dispatch(resetPutUpdatePatientTreatment());
            onSuccess?.();
        }
    }, [putStatus, isEdit, dispatch]);

    return (
        <BaseModal
            open={open}
            onOpenChange={handleDialogOpenChange}
            icon={
                isEdit ? (
                    <SquarePen className="size-3.5" strokeWidth={2} />
                ) : (
                    <ClipboardPlus className="size-3.5" strokeWidth={2} />
                )
            }
            title={isEdit ? "Editar plan de tratamiento" : "Asignar tratamiento"}
            description={
                isEdit
                    ? "Actualiza el plan. El tratamiento asignado no se puede cambiar."
                    : "Asigna un tratamiento del catálogo a este paciente."
            }
        >
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                        <div className="flex flex-col gap-3">
                            {isEdit && patientTreatment ? (
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-ink-400">Tratamiento</span>
                                    <span className="text-sm text-ink-100">
                                        {patientTreatment.treatmentName}
                                    </span>
                                </div>
                            ) : (
                                <CustomFormSelect
                                    name="idTreatment"
                                    label="Tratamiento"
                                    placeholder={
                                        treatmentsStatus === "loading"
                                            ? "Cargando tratamientos..."
                                            : "Selecciona un tratamiento"
                                    }
                                    items={treatmentItems}
                                    disabled={
                                        treatmentsStatus === "loading" &&
                                        treatmentItems.length === 0
                                    }
                                    searchable
                                    searchPlaceholder="Buscar tratamiento..."
                                />
                            )}

                            <CustomFormField
                                name="startAt"
                                label="Fecha de inicio"
                                type="datetime"
                                placeholder="Selecciona la fecha de inicio"
                            />

                            {isEdit && patientTreatment && (
                                <CustomFormSelect
                                    name="idTreatmentStatus"
                                    label="Estado"
                                    placeholder="Selecciona el estado"
                                    items={statusOptions}
                                />
                            )}

                            {isEdit && patientTreatment?.endAt && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-ink-400">
                                        Fecha de finalización
                                    </span>
                                    <span className="text-sm text-ink-100">
                                        {formatDate(
                                            patientTreatment.endAt,
                                            "d MMM yyyy · HH:mm",
                                            { hour12: true },
                                        )}
                                    </span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <CustomFormField
                                    name="agreedPrice"
                                    label="Precio acordado (opcional)"
                                    placeholder="0"
                                    mode="currency"
                                />
                                <CustomFormSelect
                                    name="idPaymentFrequency"
                                    label="Frecuencia de pago (opcional)"
                                    placeholder="Selecciona la frecuencia"
                                    items={PAYMENT_FREQUENCY_OPTIONS}
                                />
                            </div>

                            {showPeriodicAmount && (
                                <CustomFormField
                                    name="periodicAmount"
                                    label="Monto periódico"
                                    placeholder="0"
                                    mode="currency"
                                />
                            )}

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
                            ) : isEdit ? (
                                "Guardar cambios"
                            ) : (
                                "Asignar tratamiento"
                            )}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </BaseModal>
    );
};
