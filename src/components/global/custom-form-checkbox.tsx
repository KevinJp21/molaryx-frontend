'use client'

import { Controller, useFormContext } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { InputErrorMessage } from './input-error-message'

type Props = {
  name: string
  label: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
  className?: string
}

export const CustomFormCheckbox = ({
  name,
  label,
  description,
  disabled = false,
  className,
}: Props) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const showError = Boolean(fieldState.error)
        const id = name.replace(/\./g, '-')

        return (
          <div className={cn('flex flex-col gap-1.5', className)}>
            <div className="flex items-start gap-3">
              <Checkbox
                id={id}
                name={field.name}
                checked={Boolean(field.value)}
                disabled={disabled}
                aria-invalid={showError}
                onCheckedChange={(checked) => {
                  field.onChange(checked === true)
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                className="mt-0.5"
              />
              <div className="min-w-0 flex-1">
                <label
                  htmlFor={id}
                  className={cn(
                    'cursor-pointer text-sm leading-snug text-ink-800',
                    disabled && 'cursor-not-allowed opacity-50',
                  )}
                >
                  {label}
                </label>
                {description && (
                  <p className="mt-1 text-xs leading-relaxed text-ink-600">
                    {description}
                  </p>
                )}
              </div>
            </div>
            {showError && (
              <InputErrorMessage message={fieldState.error?.message} />
            )}
          </div>
        )
      }}
    />
  )
}

export default CustomFormCheckbox
