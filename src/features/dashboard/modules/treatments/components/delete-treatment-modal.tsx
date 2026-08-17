'use client';

import { useEffect } from 'react';
import { Trash } from 'lucide-react';
import { BaseModal, Button, Spinner } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store';
import {
    deleteTreatment,
    resetDeleteTreatment,
    selectDeleteTreatment,
} from '@/store/treatments/treatments-slice';
import { toast } from 'sonner';
import { ITreatmentsItems } from '../interfaces';

type Props = {
    open: boolean;
    onOpenChange: (next: boolean) => void;
    treatment: ITreatmentsItems | null;
    onSuccess?: () => void;
};

export const DeleteTreatmentModal = ({ open, onOpenChange, treatment, onSuccess }: Props) => {
    const dispatch = useAppDispatch();
    const { status, message } = useAppSelector(selectDeleteTreatment);
    const isSubmitting = status === 'loading';

    const handleDialogOpenChange = (next: boolean) => {
        if (!next) {
            if (status !== 'idle') {
                dispatch(resetDeleteTreatment());
            }
        }
        onOpenChange(next);
    };

    const onDelete = () => {
        if (!treatment) return;
        dispatch(deleteTreatment(treatment.idTreatment));
    };

    useEffect(() => {
        if (status === 'error') {
            toast.error(message);
            dispatch(resetDeleteTreatment());
        }
        if (status === 'success') {
            toast.success(message);
            handleDialogOpenChange(false);
            dispatch(resetDeleteTreatment());
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
            title="Eliminar tratamiento"
            description="Esta acción no se puede deshacer."
        >
            <div className="px-5 py-4">
                {treatment && (
                    <div className="rounded-xl border border-ink-800 bg-ink-900/60 px-4 py-3">
                        <p className="text-sm font-medium tracking-tight text-ink-50">
                            {treatment.name}
                        </p>
                        <p className="mt-1 font-mono text-xs tabular-nums text-ink-400">
                            {treatment.description ?? "Sin descripción"}
                        </p>
                    </div>
                )}
                <p className="mt-3 text-sm leading-relaxed text-ink-300">
                    Se quitará del directorio de tratamientos de forma permanente y no podrá recuperarse.
                </p>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-ink-800 bg-ink-900/40 px-5 py-3">
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
                    disabled={isSubmitting || !treatment}
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
