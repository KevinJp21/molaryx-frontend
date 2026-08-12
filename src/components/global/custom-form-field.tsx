'use client'

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { InputErrorMessage } from "./input-error-message"

type FieldMode = 'text' | 'digits' | 'currency' | 'number' | 'decimal' | 'percentage' | 'amount'

type Props = {
    name: string
    label: string
    placeholder?: string
    type?: "text" | "email" | "date"
    mode?: FieldMode
    onChange?: (e: any) => void
    calendarProps?: any
    disabled?: boolean
}

export const CustomFormField = ({
    name,
    label,
    placeholder = '',
    type = 'text',
    mode = 'text',
    onChange,
    calendarProps,
    disabled = false,
}: Props) => {

    const [isOpen, setIsOpen] = useState(false);
    const { control } = useFormContext()

    const formatters = {
        currency: new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }),
        number: new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0,
            useGrouping: false,
        }),
        amount: new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            useGrouping: true,
        }),
        decimal: new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 4,
            useGrouping: false,
        }),
        percentage: new Intl.NumberFormat('es-CO', {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }),
    };

    const isValidNumber = (value: unknown) =>
        value !== '' && value !== null && value !== undefined && !isNaN(Number(value))

    const formatValue = (value: any) => {
        if (mode === 'text' || mode === 'digits') return value ?? ''
        if (mode === 'decimal') {
            if (value === '' || value === null || value === undefined) return ''
            if (typeof value === 'string' && /^\d+\.$/.test(value)) {
                return value.replace('.', ',')
            }
            if (!isValidNumber(value)) return ''
            return formatters.decimal.format(Number(value))
        }
        if (!isValidNumber(value)) return ''

        switch (mode) {
            case 'currency':
                return formatters.currency.format(Number(value))
            case 'number':
                return formatters.number.format(Number(value))
            case 'amount':
                return formatters.amount.format(Number(value))
            case 'percentage':
                return String(value)
            default:
                return value || ''
        }
    }

    const parseDecimalTyping = (input: string) => {
        let s = input.replace(/\s/g, '')
        if (s === '') return ''
        const hasComma = s.includes(',')
        const hasDot = s.includes('.')
        if (hasComma && hasDot) {
            s =
                s.lastIndexOf(',') > s.lastIndexOf('.')
                    ? s.replace(/\./g, '').replace(',', '.')
                    : s.replace(/,/g, '')
        } else if (hasComma) {
            s = s.replace(',', '.')
        }
        return s
    }

    const parseValue = (raw: string) => {
        switch (mode) {
            case 'digits':
            case 'amount':
                return raw.replace(/\D/g, '')
            case 'currency':
            case 'number':
                return raw.replace(/[.$,\s]/g, '')
            case 'decimal':
                return parseDecimalTyping(raw)
            case 'percentage':
                return raw.replace(/\s|%/g, '').replace(',', '.')
            default:
                return raw
        }
    }

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={name} className="text-[13px] font-medium text-ink-200">
                        {label}
                    </label>

                    {type === 'date' ? (
                        <Popover
                            open={isOpen}
                            onOpenChange={(open) => {
                                setIsOpen(open)
                                if (!open) field.onBlur()
                            }}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    ref={field.ref}
                                    type="button"
                                    variant={"outline"}
                                    disabled={disabled}
                                    id={name}
                                    aria-invalid={!!fieldState.error && fieldState.isTouched}
                                    className={cn(
                                        "h-auto w-full justify-start rounded-xl border border-ink-700 bg-ink-900 px-3.5 py-2.5 text-left text-sm font-normal text-ink-50 shadow-none",
                                        "hover:bg-ink-900 hover:border-ink-600 hover:text-ink-50",
                                        "focus-visible:border-accent-500 focus-visible:ring-[3px] focus-visible:ring-accent-500/20",
                                        !field.value && "text-ink-400",
                                        fieldState.error && fieldState.isTouched && "border-coral-500 ring-[3px] ring-coral-500/20",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-ink-400" />
                                    {field.value ? format(new Date(`${field.value}T00:00:00`), "PPP", { locale: es }) : <span>{placeholder}</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value ? new Date(`${field.value}T00:00:00`) : undefined}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        field.onChange(date ? format(date, "yyyy-MM-dd") : '')
                                        field.onBlur()
                                        onChange?.(date)
                                        setIsOpen(false)
                                    }}
                                    {...calendarProps}
                                />
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <div className="relative">
                            <Input
                                {...field}
                                id={name}
                                type={type}
                                inputMode={mode === 'digits' ? 'numeric' : undefined}
                                placeholder={placeholder}
                                disabled={disabled}
                                aria-invalid={!!fieldState.error && fieldState.isTouched}
                                className={cn(mode === 'percentage' && 'pr-8')}
                                value={formatValue(field.value)}
                                onChange={(e) => {
                                    const raw = parseValue(e.target.value)
                                    onChange?.(e)

                                    if (raw === '') {
                                        field.onChange('')
                                        return
                                    }

                                    if (mode === 'text' || mode === 'digits') {
                                        field.onChange(raw)
                                        return;
                                    }

                                    if (mode === 'percentage') {
                                        const normalized = raw.replace(',', '.')

                                        // Permitir escribir "1." temporalmente
                                        if (/^\d{1,2}\.$/.test(normalized)) {
                                            field.onChange(normalized)
                                            return
                                        }

                                        // Enteros: 1–2 dígitos | Decimales: máx 2
                                        const isValid = /^(?:\d{1,2})(?:\.\d{1,2})?$/.test(normalized)

                                        if (isValid) {
                                            const num = Number(normalized)
                                            if (!isNaN(num) && num >= 0 && num <= 99.99) {
                                                field.onChange(num)
                                            }
                                        }

                                        return;
                                    }

                                    if (mode === 'decimal') {
                                        const normalized = raw
                                        if (normalized === '') {
                                            field.onChange('')
                                            return
                                        }
                                        if (/^\d+\.$/.test(normalized)) {
                                            field.onChange(normalized)
                                            return
                                        }
                                        const decOk = /^\d+(\.\d{0,4})?$/.test(normalized)
                                        if (decOk) {
                                            const num = Number(normalized)
                                            if (!isNaN(num)) {
                                                field.onChange(num)
                                            }
                                        }
                                        return
                                    }

                                    if (!isNaN(Number(raw))) {
                                        field.onChange(Number(raw))
                                        return;
                                    }
                                }}
                            />
                            {mode === 'percentage' && field.value && (
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink-400">
                                    %
                                </span>
                            )}
                        </div>
                    )}

                    {fieldState.error && fieldState.isTouched && (
                        <InputErrorMessage message={fieldState.error?.message} />
                    )}
                </div>
            )}
        />
    )
}

export default CustomFormField
