'use client';

import { useEffect } from 'react';
import { Trash } from 'lucide-react';
import { BaseModal, Button, Spinner } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store';
import {
    deleteProcedure,
    resetDeleteProcedure,
    selectDeleteProcedure,
} from '@/store/procedures/procedures-slice';
import { toast } from 'sonner';
import { IProceduresItems } from '../interfaces';

type Props = {
    open: boolean;
    onOpenChange: (next: boolean) => void;
    procedure: IProceduresItems | null;
    onSuccess?: () => void;
};

export const DeleteProcedureModal = ({ open, onOpenChange, procedure, onSuccess }: Props) => {
    const dispatch = useAppDispatch();
    const { status, message } = useAppSelector(selectDeleteProcedure);
    const isSubmitting = status === 'loading';

    const handleDialogOpenChange = (next: boolean) => {
        if (!next) {
            if (status !== 'idle') {
                dispatch(resetDeleteProcedure());
            }
        }
        onOpenChange(next);
    };

    const onDelete = () => {
        if (!procedure) return;
        dispatch(deleteProcedure(procedure.idProcedure));
    };

    useEffect(() => {
        if (status === 'error') {
            toast.error(message);
            dispatch(resetDeleteProcedure());
        }
        if (status === 'success') {
            toast.success(message);
            handleDialogOpenChange(false);
            dispatch(resetDeleteProcedure());
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
            title="Eliminar procedimiento"
            description="Esta acción no se puede deshacer."
        >
            <div className="px-5 py-4">
                {procedure && (
                    <div className="rounded-xl border border-ink-200 bg-ink-100/60 px-4 py-3">
                        <p className="text-sm font-medium tracking-tight text-ink-950">
                            {procedure.name}
                        </p>
                        <p className="mt-1 font-mono text-xs tabular-nums text-ink-600">
                            {procedure.description ?? "Sin descripción"}
                        </p>
                    </div>
                )}
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                    Se quitará del directorio de procedimientos de forma permanente y no podrá recuperarse.
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
                    disabled={isSubmitting || !procedure}
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
