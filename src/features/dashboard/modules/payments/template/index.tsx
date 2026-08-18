"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import { hasPermissionCode } from "@/features/dashboard/utils";
import { PaymentFormModal, PaymentsTable } from "../components";

type Props = {
    encodedPatientId?: string;
};

export const PaymentsTemplate = ({ encodedPatientId }: Props) => {
    const { data: userData } = useAppSelector(selectGetUserData);
    const canCreate = hasPermissionCode(
        userData?.permissions,
        "PAYMENTS",
        "CREATE_PAYMENT",
    );
    const isPatientContext = Boolean(encodedPatientId);

    const [modalOpen, setModalOpen] = useState(false);
    const [listRefreshKey, setListRefreshKey] = useState(0);

    const refreshList = () => setListRefreshKey((key) => key + 1);

    return (
        <>
            <section className="mb-4 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    {isPatientContext ? (
                        <>
                            <h2 className="text-lg font-medium text-ink-50">Pagos</h2>
                            <p className="text-sm text-ink-300">
                                Historial de pagos de este paciente
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-xl font-medium text-ink-50">Pagos</h1>
                            <p className="text-sm text-ink-300">
                                Historial de pagos del consultorio
                            </p>
                        </>
                    )}
                </div>
                {canCreate && (
                    <Button onClick={() => setModalOpen(true)}>
                        <PlusIcon className="h-4 w-4" />
                        Registrar pago
                    </Button>
                )}
            </section>
            <PaymentsTable
                encodedPatientId={encodedPatientId}
                refreshKey={listRefreshKey}
                emptyMessage={
                    isPatientContext
                        ? "Este paciente no tiene pagos registrados."
                        : "No hay pagos registrados."
                }
            />
            <PaymentFormModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                encodedPatientId={encodedPatientId}
                onSuccess={refreshList}
            />
        </>
    );
};
