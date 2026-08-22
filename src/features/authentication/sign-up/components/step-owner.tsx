'use client';

import { useFormContext } from 'react-hook-form';
import { CustomFormField, CustomFormSelect, CustomPasswordFormField } from '@/components';
import { useAppSelector } from '@/store';
import { selectGetIdentificationTypes } from '@/store/masters/masters-slice';

export const StepOwner = () => {
    const { trigger } = useFormContext();
    const { data, status } = useAppSelector(selectGetIdentificationTypes);
    const isLoading = status === 'loading' || status === 'idle';
    const excludeIdentificationType = [3, 4]
    const identificationTypes = (data && status === 'success' ? data : []).filter((data) => !excludeIdentificationType.includes(data.idIdentificationType));

    return (
        <div>
            <h1 className="font-semibold text-3xl tracking-tight text-ink-50">Tu cuenta</h1>
            <p className="mt-2 text-sm text-ink-300">
                Serás el administrador principal de este consultorio.
            </p>
            <div className="mt-7 flex flex-col gap-3">
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <CustomFormField
                        name='owner.firstName'
                        label='Nombre'
                        placeholder='Ingresa tu nombre'
                    />
                    <CustomFormField
                        name='owner.secondName'
                        label='Segundo nombre (opcional)'
                        placeholder='Ingresa tu segundo nombre'
                    />
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <CustomFormField
                        name='owner.firstSurname'
                        label='Apellido'
                        placeholder='Ingresa tu apellido'
                    />
                    <CustomFormField
                        name='owner.secondSurname'
                        label='Segundo apellido (opcional)'
                        placeholder='Ingresa tu segundo apellido'
                    />
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <CustomFormSelect
                        items={identificationTypes.map((item) => ({
                            name: `${item.name} (${item.code})`,
                            value: item.idIdentificationType,
                        }))}
                        name='owner.idIdentificationType'
                        label='Tipo de identificación'
                        placeholder={isLoading ? 'Cargando...' : 'Selecciona un tipo de identificación'}
                        disabled={isLoading}
                        onChange={() => {
                            void trigger('owner.identificationNumber');
                        }}
                    />
                    <CustomFormField
                        name='owner.identificationNumber'
                        label='Número de identificación'
                        placeholder='Ingresa tu número de identificación'
                        type='text'
                        mode='digits'
                    />
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <CustomFormField
                        name='owner.username'
                        label='Nombre de usuario'
                        placeholder='Ingresa tu nombre de usuario'
                        type='text'
                        mode='text'
                    />
                    <CustomFormField
                        name='owner.birthDate'
                        label='Fecha de nacimiento'
                        placeholder='Ingresa tu fecha de nacimiento'
                        type='date'
                    />
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <CustomFormField
                        name='owner.phoneNumber'
                        label='Número de teléfono'
                        placeholder='Ingresa tu número de teléfono'
                        type='text'
                        mode='digits'
                    />
                    <CustomFormField
                        name='owner.email'
                        label='Correo electrónico'
                        placeholder='Ingresa tu correo electrónico'
                        type='email'
                    />
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <CustomPasswordFormField
                        name='owner.password'
                        label='Contraseña'
                    />
                    <CustomPasswordFormField
                        name='owner.confirmPassword'
                        label='Confirmar contraseña'
                    />
                </div>
            </div>
        </div>
    );
};