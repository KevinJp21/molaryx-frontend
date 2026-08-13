'use client';

import { useEffect } from 'react';
import {
    Root as DialogRoot,
    DialogPortal,
    DialogContent,
    DialogOverlay,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from '@radix-ui/react-dialog';
import { UserPlus, X } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Button, CustomFormField, CustomFormSelect, Spinner } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store';
import { getIdentificationTypes, selectGetIdentificationTypes } from '@/store/masters/masters-slice';
import { postCreatePatient, selectPostCreatePatient, resetPostCreatePatient } from '@/store/patients/patiens-slice';
import { getPatients } from '@/store/patients/patiens-slice';
import { IPostCreatePatientFormRequest } from '../interfaces';
import { NewPatientSchema, TNewPatientForm } from '../schemas';
import { toast } from 'sonner';

type Props = {
    open: boolean;
    onOpenChange: (next: boolean) => void;
};

export const NewPatientModal = ({ open, onOpenChange }: Props) => {
    const dispatch = useAppDispatch();
    const { data, status } = useAppSelector(selectGetIdentificationTypes);
    const { status: postCreatePatientStatus, message: postCreatePatientMessage, error: postCreatePatientError } = useAppSelector(selectPostCreatePatient);
    const isLoadingTypes = status === 'loading' || status === 'idle';
    const identificationTypes = (data && status === 'success' ? data : []).filter(
        (item) => ![4].includes(item.idIdentificationType),
    );

    const methods = useForm<TNewPatientForm, IPostCreatePatientFormRequest>({
        mode: 'onTouched',
        resolver: zodResolver(NewPatientSchema),
        defaultValues: {
            idIdentificationType: 1,
            identificationNumber: '',
            firstName: '',
            secondName: null,
            firstSurname: '',
            secondSurname: null,
            birthDate: '',
            phoneNumber: '',
            email: '',
        },
    });

    const { reset, handleSubmit } = methods;

    useEffect(() => {
        if (open && status !== 'success') {
            dispatch(getIdentificationTypes());
        }
    }, [open, status, dispatch]);

    const handleDialogOpenChange = (next: boolean) => {
        if (!next) reset();
        onOpenChange(next);
    };

    const onSubmit = async (data: IPostCreatePatientFormRequest) => {
        dispatch(postCreatePatient(data));
    }

    useEffect(() => {
        if (postCreatePatientStatus === 'error') {
            toast.error(postCreatePatientMessage, {
                description: postCreatePatientError,
            });
            dispatch(resetPostCreatePatient());
        }
        if (postCreatePatientStatus === 'success') {
            toast.success(postCreatePatientMessage);
            handleDialogOpenChange(false);
            dispatch(resetPostCreatePatient());
            dispatch(getPatients());
        }

    }, [postCreatePatientStatus, dispatch]);

    return (
        <DialogRoot open={open} onOpenChange={handleDialogOpenChange}>
            <DialogPortal>
                <DialogOverlay
                    className={cn(
                        'fixed inset-0 z-40 bg-ink-50/20 backdrop-blur-[2px]',
                        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
                        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
                    )}
                />
                <DialogContent
                    className={cn(
                        'fixed left-1/2 top-1/2 z-50 flex max-h-[min(92vh,840px)] w-[calc(100vw-1.5rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-ink-750 bg-ink-950 text-ink-100 shadow-[0_1px_0_rgba(14,14,23,0.04),0_24px_64px_-32px_rgba(124,77,255,0.45)]',
                        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                    )}
                >
                    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-ink-800 px-5 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-accent-500 ring-1 ring-inset ring-accent-500/20">
                                <UserPlus className="size-3.5" strokeWidth={2} />
                            </span>
                            <div className="min-w-0">
                                <DialogTitle className="text-sm font-medium tracking-tight text-ink-50">
                                    Nuevo paciente
                                </DialogTitle>
                                <DialogDescription className="text-xs text-ink-400">
                                    Ficha de ingreso al directorio del consultorio.
                                </DialogDescription>
                            </div>
                        </div>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label="Cerrar"
                            >
                                <X className="size-4" />
                            </Button>
                        </DialogClose>
                    </div>

                    <FormProvider {...methods}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex min-h-0 flex-1 flex-col"
                        >
                            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                                <div className="flex flex-col gap-3">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <CustomFormField
                                            name="firstName"
                                            label="Nombre"
                                            placeholder="Ingresa el nombre"
                                        />
                                        <CustomFormField
                                            name="secondName"
                                            label="Segundo nombre (opcional)"
                                            placeholder="Ingresa el segundo nombre"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <CustomFormField
                                            name="firstSurname"
                                            label="Apellido"
                                            placeholder="Ingresa el apellido"
                                        />
                                        <CustomFormField
                                            name="secondSurname"
                                            label="Segundo apellido (opcional)"
                                            placeholder="Ingresa el segundo apellido"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <CustomFormSelect
                                            items={identificationTypes.map((item) => ({
                                                name: `${item.name} (${item.code})`,
                                                value: item.idIdentificationType,
                                            }))}
                                            name="idIdentificationType"
                                            label="Tipo de identificación"
                                            placeholder={isLoadingTypes ? 'Cargando...' : 'Selecciona un tipo'}
                                            disabled={isLoadingTypes}
                                        />
                                        <CustomFormField
                                            name="identificationNumber"
                                            label="Número de identificación"
                                            placeholder="Ingresa el número de identificación"
                                            type="text"
                                            mode="digits"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <CustomFormField
                                            name="birthDate"
                                            label="Fecha de nacimiento"
                                            placeholder="Selecciona la fecha"
                                            type="date"
                                        />
                                        <CustomFormField
                                            name="phoneNumber"
                                            label="Número de teléfono"
                                            placeholder="Ingresa el teléfono"
                                            type="text"
                                            mode="digits"
                                        />
                                    </div>
                                    <CustomFormField
                                        name="email"
                                        label="Correo electrónico"
                                        placeholder="Ingresa el correo"
                                        type="email"
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
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={postCreatePatientStatus === 'loading'}
                                >
                                    {postCreatePatientStatus === 'loading' ? (
                                        <>
                                            <Spinner className="size-4" />
                                            Guardando paciente...
                                        </>
                                    ) : (
                                        'Guardar paciente'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </DialogContent>
            </DialogPortal>
        </DialogRoot>
    );
};
