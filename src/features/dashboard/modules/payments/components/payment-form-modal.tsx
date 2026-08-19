"use client";

import { Wallet } from "lucide-react";
import { FormProvider } from "react-hook-form";
import {
    BaseModal,
    Button,
    CustomFormField,
    CustomFormSelect,
    CustomFormTextarea,
    Spinner,
} from "@/components";
import { currencyFormat } from "@/utils";
import { PAYMENT_CONTEXT_OPTIONS, PAYMENT_METHOD_OPTIONS } from "../consts";
import { usePaymentForm } from "../hooks";

type Props = {
    open: boolean;
    onOpenChange: (next: boolean) => void;
    idPatient?: number;
    idAppointment?: number;
    idPatientTreatment?: number;
    contextLabel?: string;
    onSuccess?: () => void;
};

export const PaymentFormModal = ({
    open,
    onOpenChange,
    idPatient,
    idAppointment,
    idPatientTreatment,
    contextLabel,
    onSuccess,
}: Props) => {
    const {
        methods,
        isSubmitting,
        needsPatientSelect,
        needsContextSelect,
        showContextSelect,
        showAppointmentSelect,
        showTreatmentSelect,
        selectedTreatment,
        patientItems,
        patientsStatus,
        appointmentItems,
        appointmentsStatus,
        treatmentItems,
        treatmentsStatus,
        searchPatients,
        handleDialogOpenChange,
        onSubmit,
        clearContextSelection,
        clearPatientDependentFields,
    } = usePaymentForm({
        open,
        onOpenChange,
        idPatient,
        idAppointment,
        idPatientTreatment,
        onSuccess,
    });

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
                    onSubmit={onSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                        <div className="flex flex-col gap-3">
                            {needsPatientSelect && (
                                <CustomFormSelect
                                    name="idPatient"
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
                                    onChange={clearPatientDependentFields}
                                />
                            )}

                            {showContextSelect && (
                                <CustomFormSelect
                                    name="paymentContext"
                                    label="Qué se está cobrando"
                                    placeholder="Selecciona el contexto del pago"
                                    items={PAYMENT_CONTEXT_OPTIONS}
                                    onChange={clearContextSelection}
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
