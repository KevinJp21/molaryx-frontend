'use client';

import { useEffect } from 'react';
import { SquarePen, Layers } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseModal, Button, CustomFormField, CustomFormSelect, CustomFormTextarea, Spinner } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store';
import {
    postCreateService,
    putUpdateService,
    resetPostCreateService,
    resetPutUpdateService,
    selectPostCreateService,
    selectPutUpdateService,
} from '@/store/services/services-slice';
import { IServicesItems } from '../interfaces';
import {
    SERVICE_FORM_DEFAULT_VALUES,
    ServiceFormSchema,
    TServiceForm,
    TServiceFormValues,
} from '../schemas';
import { toast } from 'sonner';

type Props = {
    open: boolean;
    onOpenChange: (next: boolean) => void;
    service?: IServicesItems | null;
    onSuccess?: () => void;
};

const toFormValues = (service?: IServicesItems | null): TServiceForm => {
    if (!service) return SERVICE_FORM_DEFAULT_VALUES;

    return {
        name: service.name,
        description: service.description ?? "",
        isActive: service.isActive,
    };
};

export const ServiceFormModal = ({
    open,
    onOpenChange,
    service = null,
    onSuccess,
}: Props) => {
    const dispatch = useAppDispatch();
    const isEdit = Boolean(service);
    const {
        status: postCreateServiceStatus,
        message: postCreateServiceMessage,
        error: postCreateServiceError,
    } = useAppSelector(selectPostCreateService);
    const {
        status: putUpdateServiceStatus,
        message: putUpdateServiceMessage,
        error: putUpdateServiceError,
    } = useAppSelector(selectPutUpdateService);
    const isSubmitting = isEdit
        ? putUpdateServiceStatus === 'loading'
        : postCreateServiceStatus === 'loading';

    const methods = useForm<TServiceForm, unknown, TServiceFormValues>({
        mode: 'onTouched',
        resolver: zodResolver(ServiceFormSchema),
        defaultValues: SERVICE_FORM_DEFAULT_VALUES,
    });

    const { reset, handleSubmit } = methods;

    useEffect(() => {
        if (open) {
            reset(toFormValues(service));
        }
    }, [open, service, reset]);

    const handleDialogOpenChange = (next: boolean) => {
        if (!next) {
            reset(SERVICE_FORM_DEFAULT_VALUES);
            if (isEdit) {
                if (putUpdateServiceStatus !== 'idle') {
                    dispatch(resetPutUpdateService());
                }
            } else {
                if (postCreateServiceStatus !== 'idle') {
                    dispatch(resetPostCreateService());
                }
            }
        }
        onOpenChange(next);
    };

    const onSubmit = (data: TServiceFormValues) => {
        if (isEdit && service) {
            dispatch(putUpdateService({
                ...data,
                idService: service.idService,
            }));
            return;
        }

        const { isActive: _isActive, ...createData } = data;
        dispatch(postCreateService(createData));
    };

    useEffect(() => {
        if (isEdit) return;

        if (postCreateServiceStatus === 'error') {
            toast.error(postCreateServiceMessage, {
                description: postCreateServiceError,
            });
            dispatch(resetPostCreateService());
        }
        if (postCreateServiceStatus === 'success') {
            toast.success(postCreateServiceMessage);
            handleDialogOpenChange(false);
            dispatch(resetPostCreateService());
            onSuccess?.();
        }
    }, [postCreateServiceStatus, isEdit, dispatch]);

    useEffect(() => {
        if (!isEdit) return;

        if (putUpdateServiceStatus === 'error') {
            toast.error(putUpdateServiceMessage, {
                description: putUpdateServiceError,
            });
            dispatch(resetPutUpdateService());
        }
        if (putUpdateServiceStatus === 'success') {
            toast.success(putUpdateServiceMessage);
            handleDialogOpenChange(false);
            dispatch(resetPutUpdateService());
            onSuccess?.();
        }
    }, [putUpdateServiceStatus, isEdit, dispatch]);

    return (
        <BaseModal
            open={open}
            onOpenChange={handleDialogOpenChange}
            icon={
                isEdit ? (
                    <SquarePen className="size-3.5" strokeWidth={2} />
                ) : (
                    <Layers className="size-3.5" strokeWidth={2} />
                )
            }
            title={isEdit ? 'Editar servicio' : 'Nuevo servicio'}
            description={
                isEdit
                    ? 'Actualiza los datos del servicio.'
                    : 'Agrega un servicio al catálogo del consultorio.'
            }
        >
            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                        <div className="flex flex-col gap-3">
                            <CustomFormField
                                name="name"
                                label="Nombre"
                                placeholder="Ingresa el nombre"
                            />
                            <CustomFormTextarea
                                name="description"
                                label="Descripción"
                                placeholder="Ingresa la descripción"
                            />
                            {isEdit && (
                                <CustomFormSelect
                                    name="isActive"
                                    label="Estado"
                                    placeholder="Selecciona el estado"
                                    items={[
                                        { name: 'Activo', value: true },
                                        { name: 'Inactivo', value: false },
                                    ]}
                                />
                            )}
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
                        <Button
                            type="submit"
                            size="sm"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Spinner className="size-4" />
                                    {isEdit ? 'Guardando cambios...' : 'Guardando servicio...'}
                                </>
                            ) : isEdit ? (
                                'Guardar cambios'
                            ) : (
                                'Guardar servicio'
                            )}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </BaseModal>
    );
};
