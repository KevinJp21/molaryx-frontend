'use client'

import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Input, InputErrorMessage } from '@/components'
import { EyeOff, Eye} from 'lucide-react'
import { cn } from '@/lib/utils'

export const CustomPasswordFormField = ({ name, label, errorMessage }: { name: string; label: string; errorMessage?: string }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-3'>
                        <span className='flex justify-between items-center '>
                            <label htmlFor={name} className='text-[13px] font-medium text-ink-200'>{label}</label>
                        </span>
                        <div className='relative'>
                            <Input
                                {...field}
                                value={field.value ?? ''}
                                type={showPassword ? 'text' : 'password'}
                                placeholder='••••••••'
                                className={cn('w-full')}
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-ink-300"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {(errorMessage || fieldState.error && fieldState.isTouched) && (
                        <InputErrorMessage message={errorMessage || fieldState.error?.message?.toString()} />
                    )}
                </div>
            )}
        />
    )
}

export default CustomPasswordFormField;