'use client'

import { Controller, useFormContext } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { InputErrorMessage } from "./input-error-message"

type Props = {
    name: string
    label: string
    placeholder?: string
    disabled?: boolean
    rows?: number
    className?: string
}

export const CustomFormTextarea = ({
    name,
    label,
    placeholder = '',
    disabled = false,
    rows = 4,
    className,
}: Props) => {
    const { control } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={name} className="text-[13px] font-medium text-ink-200">
                        {label}
                    </label>
                    <Textarea
                        {...field}
                        id={name}
                        rows={rows}
                        placeholder={placeholder}
                        disabled={disabled}
                        aria-invalid={!!fieldState.error && fieldState.isTouched}
                        className={className}
                        value={field.value ?? ''}
                        onChange={(event) => {
                            field.onChange(event.target.value)
                        }}
                    />
                    {fieldState.error && fieldState.isTouched && (
                        <InputErrorMessage message={fieldState.error.message} />
                    )}
                </div>
            )}
        />
    )
}

export default CustomFormTextarea
