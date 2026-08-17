"use client";

import { PaymentsTable } from "../components";

type Props = {
    encodedPatientId: string;
};

export const PaymentsTemplate = ({ encodedPatientId }: Props) => {
    return (
        <>
            <section className="mb-4 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-medium text-ink-50">Pagos</h2>
                    <p className="text-sm text-ink-300">
                        Historial de pagos de este paciente
                    </p>
                </div>
            </section>
            <PaymentsTable encodedPatientId={encodedPatientId} />
        </>
    );
};
