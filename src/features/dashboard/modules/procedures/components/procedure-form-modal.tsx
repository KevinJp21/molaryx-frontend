'use client';

import { useEffect } from 'react';
import { SquarePen, Layers } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseModal, Button, CustomFormField, CustomFormSelect, CustomFormTextarea, Spinner } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store';
import {
    postCreateProcedure,
    putUpdateProcedure,
    resetPostCreateProcedure,
    resetPutUpdateProcedure,
    selectPostCreateProcedure,
    selectPutUpdateProcedure,
} from '@/store/procedures/procedures-slice';
import { IProceduresItems } from '../interfaces';
import {
    PROCEDURE_FORM_DEFAULT_VALUES,
    ProcedureFormSchema,
    TProcedureForm,
    TProcedureFormValues,
} from '../schemas';
import { toast } from 'sonner';

type Props = {
    open: boolean;
    onOpenChange: (next: boolean) => void;
    procedure?: IProceduresItems | null;
    onSuccess?: () => void;
};

const toFormValues = (procedure?: IProceduresItems | null): TProcedureForm => {
    if (!procedure) return PROCEDURE_FORM_DEFAULT_VALUES;

    return {
        name: procedure.name,
        description: procedure.description ?? "",
        referencePrice: procedure.referencePrice,
        isActive: procedure.isActive,
    };
};

export const ProcedureFormModal = ({
    open,
    onOpenChange,
    procedure = null,
    onSuccess,
}: Props) => {
    const dispatch = useAppDispatch();
    const isEdit = Boolean(procedure);
    const {
        status: postCreateProcedureStatus,
        message: postCreateProcedureMessage,
        error: postCreateProcedureError,
    } = useAppSelector(selectPostCreateProcedure);
    const {
        status: putUpdateProcedureStatus,
        message: putUpdateProcedureMessage,
        error: putUpdateProcedureError,
    } = useAppSelector(selectPutUpdateProcedure);
    const isSubmitting = isEdit
        ? putUpdateProcedureStatus === 'loading'
        : postCreateProcedureStatus === 'loading';

    const methods = useForm<TProcedureForm, unknown, TProcedureFormValues>({
        mode: 'onTouched',
        resolver: zodResolver(ProcedureFormSchema),
        defaultValues: PROCEDURE_FORM_DEFAULT_VALUES,
    });

    const { reset, handleSubmit } = methods;

    useEffect(() => {
        if (open) {
            reset(toFormValues(procedure));
        }
    }, [open, procedure, reset]);

    const handleDialogOpenChange = (next: boolean) => {
        if (!next) {
            reset(PROCEDURE_FORM_DEFAULT_VALUES);
            if (isEdit) {
                if (putUpdateProcedureStatus !== 'idle') {
                    dispatch(resetPutUpdateProcedure());
                }
            } else {
                if (postCreateProcedureStatus !== 'idle') {
                    dispatch(resetPostCreateProcedure());
                }
            }
        }
        onOpenChange(next);
    };

    const onSubmit = (data: TProcedureFormValues) => {
        if (isEdit && procedure) {
            dispatch(putUpdateProcedure({
                ...data,
                idProcedure: procedure.idProcedure,
            }));
            return;
        }

        const { isActive: _isActive, ...createData } = data;
        dispatch(postCreateProcedure(createData));
    };

    useEffect(() => {
        if (isEdit) return;

        if (postCreateProcedureStatus === 'error') {
            toast.error(postCreateProcedureMessage, {
                description: postCreateProcedureError,
            });
            dispatch(resetPostCreateProcedure());
        }
        if (postCreateProcedureStatus === 'success') {
            toast.success(postCreateProcedureMessage);
            handleDialogOpenChange(false);
            dispatch(resetPostCreateProcedure());
            onSuccess?.();
        }
    }, [postCreateProcedureStatus, isEdit, dispatch]);

    useEffect(() => {
        if (!isEdit) return;

        if (putUpdateProcedureStatus === 'error') {
            toast.error(putUpdateProcedureMessage, {
                description: putUpdateProcedureError,
            });
            dispatch(resetPutUpdateProcedure());
        }
        if (putUpdateProcedureStatus === 'success') {
            toast.success(putUpdateProcedureMessage);
            handleDialogOpenChange(false);
            dispatch(resetPutUpdateProcedure());
            onSuccess?.();
        }
    }, [putUpdateProcedureStatus, isEdit, dispatch]);

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
            title={isEdit ? 'Editar procedimiento' : 'Nuevo procedimiento'}
            description={
                isEdit
                    ? 'Actualiza los datos del procedimiento.'
                    : 'Agrega un procedimiento al catálogo del consultorio.'
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
                            <CustomFormField
                                name="referencePrice"
                                label="Precio de referencia (opcional)"
                                placeholder="0"
                                mode="currency"
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
                                    {isEdit ? 'Guardando cambios...' : 'Guardando procedimiento...'}
                                </>
                            ) : isEdit ? (
                                'Guardar cambios'
                            ) : (
                                'Guardar procedimiento'
                            )}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </BaseModal>
    );
};
