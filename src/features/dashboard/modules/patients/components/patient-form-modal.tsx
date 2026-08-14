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
import { SquarePen, UserPlus, X } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Button, CustomFormField, CustomFormSelect, Spinner } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store';
import { getIdentificationTypes, selectGetIdentificationTypes } from '@/store/masters/masters-slice';
import {
    getPatients,
    postCreatePatient,
    putUpdatePatient,
    resetPostCreatePatient,
    resetPutUpdatePatient,
    selectPostCreatePatient,
    selectPutUpdatePatient,
} from '@/store/patients/patiens-slice';
import { IPatientsItems } from '../interfaces';
import {
    PATIENT_FORM_DEFAULT_VALUES,
    PatientFormSchema,
    TPatientForm,
} from '../schemas';
import { toast } from 'sonner';

type Props = {
    open: boolean;
    onOpenChange: (next: boolean) => void;
    patient?: IPatientsItems | null;
};

const toOptionalName = (value?: string | null) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
};

const toFormValues = (patient?: IPatientsItems | null): TPatientForm => {
    if (!patient) return PATIENT_FORM_DEFAULT_VALUES;

    return {
        idIdentificationType: patient.idIdentificationType,
        identificationNumber: patient.identificationNumber,
        firstName: patient.firstName,
        secondName: toOptionalName(patient.secondName),
        firstSurname: patient.firstSurname,
        secondSurname: toOptionalName(patient.secondSurname),
        birthDate: patient.birthDate.slice(0, 10),
        phoneNumber: patient.phoneNumber,
        email: patient.email,
        isActive: patient.isActive,
    };
};

export const PatientFormModal = ({
    open,
    onOpenChange,
    patient = null,
}: Props) => {
    const dispatch = useAppDispatch();
    const isEdit = Boolean(patient);
    const { data, status } = useAppSelector(selectGetIdentificationTypes);
    const {
        status: postCreatePatientStatus,
        message: postCreatePatientMessage,
        error: postCreatePatientError,
    } = useAppSelector(selectPostCreatePatient);
    const {
        status: putUpdatePatientStatus,
        message: putUpdatePatientMessage,
        error: putUpdatePatientError,
    } = useAppSelector(selectPutUpdatePatient);
    const isLoadingTypes = status === 'loading' || status === 'idle';
    const isSubmitting = isEdit
        ? putUpdatePatientStatus === 'loading'
        : postCreatePatientStatus === 'loading';
    const identificationTypes = (data && status === 'success' ? data : []).filter(
        (item) => ![4].includes(item.idIdentificationType),
    );

    const methods = useForm<TPatientForm>({
        mode: 'onTouched',
        resolver: zodResolver(PatientFormSchema),
        defaultValues: PATIENT_FORM_DEFAULT_VALUES,
    });

    const { reset, handleSubmit } = methods;

    useEffect(() => {
        if (open && status !== 'success') {
            dispatch(getIdentificationTypes());
        }
    }, [open, status, dispatch]);

    useEffect(() => {
        if (open) {
            reset(toFormValues(patient));
        }
    }, [open, patient, reset]);

    const handleDialogOpenChange = (next: boolean) => {
        if (!next) {
            reset(PATIENT_FORM_DEFAULT_VALUES);
            dispatch(isEdit ? resetPutUpdatePatient() : resetPostCreatePatient());
        }
        onOpenChange(next);
    };

    const onSubmit = (data: TPatientForm) => {
        if (isEdit && patient) {
            dispatch(putUpdatePatient({
                ...data,
                idPatient: patient.idPatient,
            }));
            return;
        }

        const { isActive: _isActive, ...createData } = data;
        dispatch(postCreatePatient(createData));
    };

    useEffect(() => {
        if (isEdit) return;

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
    }, [postCreatePatientStatus, isEdit, dispatch]);

    useEffect(() => {
        if (!isEdit) return;

        if (putUpdatePatientStatus === 'error') {
            toast.error(putUpdatePatientMessage, {
                description: putUpdatePatientError,
            });
            dispatch(resetPutUpdatePatient());
        }
        if (putUpdatePatientStatus === 'success') {
            toast.success(putUpdatePatientMessage);
            handleDialogOpenChange(false);
            dispatch(resetPutUpdatePatient());
            dispatch(getPatients());
        }
    }, [putUpdatePatientStatus, isEdit, dispatch]);

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
                                {isEdit ? (
                                    <SquarePen className="size-3.5" strokeWidth={2} />
                                ) : (
                                    <UserPlus className="size-3.5" strokeWidth={2} />
                                )}
                            </span>
                            <div className="min-w-0">
                                <DialogTitle className="text-sm font-medium tracking-tight text-ink-50">
                                    {isEdit ? 'Editar paciente' : 'Nuevo paciente'}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-ink-400">
                                    {isEdit
                                        ? 'Actualiza los datos de la ficha del paciente.'
                                        : 'Ficha de ingreso al directorio del consultorio.'}
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
                                    <div className={cn('grid grid-cols-1 gap-4', isEdit && 'md:grid-cols-2')}>
                                        <CustomFormField
                                            name="email"
                                            label="Correo electrónico"
                                            placeholder="Ingresa el correo"
                                            type="email"
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
                                            {isEdit ? 'Guardando cambios...' : 'Guardando paciente...'}
                                        </>
                                    ) : isEdit ? (
                                        'Guardar cambios'
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
