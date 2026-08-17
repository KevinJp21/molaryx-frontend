'use client';

import { useEffect } from 'react';
import { SquarePen, Layers } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseModal, Button, CustomFormField, CustomFormSelect, CustomFormTextarea, Spinner } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store';
import { ITreatmentsItems } from '../interfaces';
import {
    TREATMENT_FORM_DEFAULT_VALUES,
    TreatmentFormSchema,
    TTreatmentForm,
    TTreatmentFormValues,
} from '../schemas';
import { toast } from 'sonner';
import { postCreateTreatment, putUpdateTreatment, resetPostCreateTreatment, resetPutUpdateTreatment, selectPostCreateTreatment, selectPutUpdateTreatment } from '@/store/treatments/treatments-slice';

type Props = {
    open: boolean;
    onOpenChange: (next: boolean) => void;
    treatment?: ITreatmentsItems | null;
    onSuccess?: () => void;
};

const toFormValues = (treatment?: ITreatmentsItems | null): TTreatmentForm => {
    if (!treatment) return TREATMENT_FORM_DEFAULT_VALUES;

    return {
        name: treatment.name,
        description: treatment.description ?? "",
        isActive: treatment.isActive,
    };
};

export const TreatmentsFormModal = ({
    open,
    onOpenChange,
    treatment = null,
    onSuccess,
}: Props) => {
    const dispatch = useAppDispatch();
    const isEdit = Boolean(treatment);
    const {
        status: postCreateTreatmentStatus,
        message: postCreateTreatmentMessage,
        error: postCreateTreatmentError,
    } = useAppSelector(selectPostCreateTreatment);
    const {
        status: putUpdateTreatmentStatus,
        message: putUpdateTreatmentMessage,
        error: putUpdateTreatmentError,
    } = useAppSelector(selectPutUpdateTreatment);
    const isSubmitting = isEdit
        ? putUpdateTreatmentStatus === 'loading'
        : postCreateTreatmentStatus === 'loading';

    const methods = useForm<TTreatmentForm, unknown, TTreatmentFormValues>({
        mode: 'onTouched',
        resolver: zodResolver(TreatmentFormSchema),
        defaultValues: TREATMENT_FORM_DEFAULT_VALUES,
    });

    const { reset, handleSubmit } = methods;

    useEffect(() => {
        if (open) {
            reset(toFormValues(treatment));
        }
    }, [open, treatment, reset]);

    const handleDialogOpenChange = (next: boolean) => {
        if (!next) {
            reset(TREATMENT_FORM_DEFAULT_VALUES);
            if (isEdit) {
                if (putUpdateTreatmentStatus !== 'idle') {
                    dispatch(resetPutUpdateTreatment());
                }
            } else {
                if (postCreateTreatmentStatus !== 'idle') {
                    dispatch(resetPostCreateTreatment());
                }
            }
        }
        onOpenChange(next);
    };

    const onSubmit = (data: TTreatmentFormValues) => {
        if (isEdit && treatment) {
            dispatch(putUpdateTreatment({
                ...data,
                idTreatment: treatment.idTreatment,
            }));
            return;
        }

        const { isActive: _isActive, ...createData } = data;
        dispatch(postCreateTreatment(createData));
    };

    useEffect(() => {
        if (isEdit) return;

        if (postCreateTreatmentStatus === 'error') {
            toast.error(postCreateTreatmentMessage, {
                description: postCreateTreatmentError,
            });
            dispatch(resetPostCreateTreatment());
        }
        if (postCreateTreatmentStatus === 'success') {
            toast.success(postCreateTreatmentMessage);
            handleDialogOpenChange(false);
            dispatch(resetPostCreateTreatment());
            onSuccess?.();
        }
    }, [postCreateTreatmentStatus, isEdit, dispatch]);

    useEffect(() => {
        if (!isEdit) return;

        if (putUpdateTreatmentStatus === 'error') {
            toast.error(putUpdateTreatmentMessage, {
                description: putUpdateTreatmentError,
            });
            dispatch(resetPutUpdateTreatment());
        }
        if (putUpdateTreatmentStatus === 'success') {
            toast.success(putUpdateTreatmentMessage);
            handleDialogOpenChange(false);
            dispatch(resetPutUpdateTreatment());
            onSuccess?.();
        }
    }, [putUpdateTreatmentStatus, isEdit, dispatch]);

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
            title={isEdit ? 'Editar tratamiento' : 'Nuevo tratamiento'}
            description={
                isEdit
                    ? 'Actualiza los datos del tratamiento.'
                    : 'Agrega un tratamiento al catálogo del consultorio.'
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
