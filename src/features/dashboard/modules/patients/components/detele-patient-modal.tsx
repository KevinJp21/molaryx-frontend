'use client';

import { useEffect } from 'react';
import { Trash } from 'lucide-react';
import { BaseModal, Button, Spinner } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store';
import {
    deletePatient,
    resetDeletePatient,
    selectDeletePatient,
} from '@/store/patients/patiens-slice';
import { toast } from 'sonner';
import { IPatientsItems } from '../interfaces';

type Props = {
    open: boolean;
    onOpenChange: (next: boolean) => void;
    patient: IPatientsItems | null;
    onSuccess?: () => void;
};

const fullName = (patient: IPatientsItems) =>
    [patient.firstName, patient.secondName, patient.firstSurname, patient.secondSurname]
        .filter(Boolean)
        .join(' ');

export const DeletePatientModal = ({ open, onOpenChange, patient, onSuccess }: Props) => {
    const dispatch = useAppDispatch();
    const { status, message } = useAppSelector(selectDeletePatient);
    const isSubmitting = status === 'loading';

    const handleDialogOpenChange = (next: boolean) => {
        if (!next) {
            if (status !== 'idle') {
                dispatch(resetDeletePatient());
            }
        }
        onOpenChange(next);
    };

    const onDelete = () => {
        if (!patient) return;
        dispatch(deletePatient(patient.idPatient));
    };

    useEffect(() => {
        if (status === 'error') {
            toast.error(message);
            dispatch(resetDeletePatient());
        }
        if (status === 'success') {
            toast.success(message);
            handleDialogOpenChange(false);
            dispatch(resetDeletePatient());
            onSuccess?.();
        }
    }, [status, dispatch]);

    return (
        <BaseModal
            open={open}
            onOpenChange={handleDialogOpenChange}
            className="max-w-md"
            icon={<Trash className="size-3.5" strokeWidth={2} />}
            iconClassName="bg-coral-500/10 text-coral-600 ring-coral-500/20"
            title="Eliminar paciente"
            description="Esta acción no se puede deshacer."
        >
            <div className="px-5 py-4">
                {patient && (
                    <div className="rounded-xl border border-ink-200 bg-ink-100/60 px-4 py-3">
                        <p className="text-sm font-medium tracking-tight text-ink-950">
                            {fullName(patient)}
                        </p>
                        <p className="mt-1 font-mono text-xs tabular-nums text-ink-600">
                            {patient.identificationType} · {patient.identificationNumber}
                        </p>
                    </div>
                )}
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                    Se quitará del directorio de forma permanente y no podrá recuperarse.
                </p>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-ink-200 bg-ink-100/40 px-5 py-3">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className='flex-1 font-medium'
                    onClick={() => handleDialogOpenChange(false)}
                    disabled={isSubmitting}
                >
                    Cancelar
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className='flex-1 font-medium'
                    onClick={onDelete}
                    disabled={isSubmitting || !patient}
                >
                    {isSubmitting ? (
                        <>
                            <Spinner className="size-4" />
                            Eliminando...
                        </>
                    ) : (
                        'Eliminar'
                    )}
                </Button>
            </div>
        </BaseModal>
    );
};
