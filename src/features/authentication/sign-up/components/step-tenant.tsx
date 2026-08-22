'use client';

import { CustomFormField, CustomFormSelect } from '@/components';
import { useAppSelector } from '@/store';
import { selectGetIdentificationTypes } from '@/store/masters/masters-slice';
import { useFormContext } from 'react-hook-form';

export const StepTenant = () => {
  const { trigger } = useFormContext();
  const { data, status } = useAppSelector(selectGetIdentificationTypes);
  const isLoading = status === 'loading' || status === 'idle';

  const excludeIdentificationType = [3]
  const identificationTypes = (data && status === 'success' ? data : []).filter((data) => !excludeIdentificationType.includes(data.idIdentificationType));

  return (
    <div>
      <h1 className="font-semibold text-3xl tracking-tight text-ink-50">Datos de tu consultorio</h1>
      <p className="mt-2 text-sm text-ink-300">
        Esta información identifica a tu consultorio dentro de Molaryx.
      </p>

      <div className="mt-7 flex flex-col gap-3">
        <CustomFormField
          name="tenant.consultoryName"
          label="Nombre del consultorio"
          placeholder="Consultorio Odontológico Sonrisa"
        />
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <CustomFormSelect
            items={identificationTypes.map((item) => ({
              name: `${item.name} (${item.code})`,
              value: item.idIdentificationType,
            }))}
            name="tenant.idIdentificationType"
            label="Tipo de identificación"
            placeholder={isLoading ? 'Cargando...' : 'Selecciona un tipo de identificación'}
            disabled={isLoading}
            onChange={() => {
              void trigger('tenant.identificationNumber');
            }}
          />
          <CustomFormField
            type="text"
            mode='digits'
            name="tenant.identificationNumber"
            label="Número de identificación"
            placeholder="1234567890"
          />
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <CustomFormField
            type="text"
            mode='text'
            name="tenant.email"
            label="Correo electrónico"
            placeholder="ejemplo@correo.com"
          />
          <CustomFormField
            type="text"
            mode='text'
            name="tenant.phoneNumber"
            label="Teléfono del consultorio"
            placeholder="3123456789"
          />
        </div>
        <CustomFormField
          type="text"
          mode='text'
          name="tenant.address"
          label="Dirección del consultorio"
          placeholder="Calle 123, Ciudad, País"
        />
      </div>
    </div>
  );
};

export default StepTenant;
