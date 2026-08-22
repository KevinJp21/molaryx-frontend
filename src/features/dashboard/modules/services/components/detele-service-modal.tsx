'use client';

import { useEffect } from 'react';
import { Trash } from 'lucide-react';
import { BaseModal, Button, Spinner } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store';
import {
    deleteService,
    resetDeleteService,
    selectDeleteService,
} from '@/store/services/services-slice';
import { toast } from 'sonner';
import { IServicesItems } from '../interfaces';

type Props = {
    open: boolean;
    onOpenChange: (next: boolean) => void;
    service: IServicesItems | null;
    onSuccess?: () => void;
};

export const DeleteServiceModal = ({ open, onOpenChange, service, onSuccess }: Props) => {
    const dispatch = useAppDispatch();
    const { status, message } = useAppSelector(selectDeleteService);
    const isSubmitting = status === 'loading';

    const handleDialogOpenChange = (next: boolean) => {
        if (!next) {
            if (status !== 'idle') {
                dispatch(resetDeleteService());
            }
        }
        onOpenChange(next);
    };

    const onDelete = () => {
        if (!service) return;
        dispatch(deleteService(service.idService));
    };

    useEffect(() => {
        if (status === 'error') {
            toast.error(message);
            dispatch(resetDeleteService());
        }
        if (status === 'success') {
            toast.success(message);
            handleDialogOpenChange(false);
            dispatch(resetDeleteService());
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
            title="Eliminar servicio"
            description="Esta acción no se puede deshacer."
        >
            <div className="px-5 py-4">
                {service && (
                    <div className="rounded-xl border border-ink-800 bg-ink-900/60 px-4 py-3">
                        <p className="text-sm font-medium tracking-tight text-ink-50">
                            {service.name}
                        </p>
                        <p className="mt-1 font-mono text-xs tabular-nums text-ink-400">
                            {service.description ?? "Sin descripción"}
                        </p>
                    </div>
                )}
                <p className="mt-3 text-sm leading-relaxed text-ink-300">
                    Se quitará del directorio de servicios de forma permanente y no podrá recuperarse.
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
                    disabled={isSubmitting || !service}
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
