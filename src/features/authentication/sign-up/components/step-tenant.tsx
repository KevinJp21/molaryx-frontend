'use client';

import { useFormContext } from 'react-hook-form';
import { useAppSelector } from '@/store';
import { selectGetIdentificationTypes } from '@/store/masters/masters-slice';
import type { TSignUpForm } from '../schemas';

export const StepTenant = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<TSignUpForm>();

  const { data: identificationTypes } = useAppSelector(selectGetIdentificationTypes);

  return (
    <div>
      <h1 className="font-semibold text-3xl tracking-tight text-ink-50">Datos de tu consultorio</h1>
      <p className="mt-2 text-sm text-ink-300">
        Esta información identifica a tu consultorio dentro de Molaryx.
      </p>

      <div className="mt-7 flex flex-col gap-5">
        
      </div>
    </div>
  );
};

export default StepTenant;
