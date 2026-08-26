'use client'

import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { Input, InputErrorMessage } from '@/components'
import { EyeOff, Eye } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export const CustomPasswordFormField = ({ name, label, errorMessage, showForgotPassword = false }: { name: string; label: string; errorMessage?: string; showForgotPassword?: boolean }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <div className='flex flex-col gap-1.5'>
                    <span className='flex justify-between items-center '>
                        <label htmlFor={name} className='text-[13px] font-medium text-ink-200'>{label}</label>
                        {showForgotPassword && (
                            <Link href='/forgot-password' className='text-accent-400 font-medium text-xs leading-5 tracking-normal hover:underline'>
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </span>
                    <div className='relative'>
                        <Input
                            {...field}
                            value={field.value ?? ''}
                            type={showPassword ? 'text' : 'password'}
                            placeholder='••••••••'
                            aria-invalid={!!fieldState.error}
                            className={cn(
                                'w-full',
                                fieldState.error && 'border-coral-500 ring-[3px] ring-coral-500/20',
                            )}
                        />
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-ink-300"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {(errorMessage || fieldState.error) && (
                        <InputErrorMessage
                            message={errorMessage || fieldState.error?.message?.toString()}
                        />
                    )}
                </div>
            )}
        />
    )
}

export default CustomPasswordFormField;