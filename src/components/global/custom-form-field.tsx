'use client'

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format, isValid, parse } from "date-fns"
import { es } from "date-fns/locale"
import { formatDate } from "@/utils"
import { InputErrorMessage } from "./input-error-message"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type FieldMode = 'text' | 'digits' | 'currency' | 'number' | 'decimal' | 'percentage' | 'amount'
type FieldType = "text" | "email" | "date" | "datetime"

type Props = {
    name: string
    label: string
    placeholder?: string
    type?: FieldType
    mode?: FieldMode
    onChange?: (e: any) => void
    calendarProps?: any
    disabled?: boolean
}

const parseFieldDate = (value: unknown): Date | undefined => {
    if (!value || typeof value !== "string") return undefined

    const datetime = parse(value, "yyyy-MM-dd'T'HH:mm", new Date())
    if (isValid(datetime)) return datetime

    const dateOnly = parse(value, "yyyy-MM-dd", new Date())
    if (isValid(dateOnly)) return dateOnly

    const fallback = new Date(value)
    return isValid(fallback) ? fallback : undefined
}

const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))

const to12HourParts = (date: Date): { hour: string; minute: string; period: "AM" | "PM" } => {
    const hours24 = date.getHours()
    const period: "AM" | "PM" = hours24 >= 12 ? "PM" : "AM"
    const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12

    return {
        hour: String(hour12).padStart(2, "0"),
        minute: String(date.getMinutes()).padStart(2, "0"),
        period,
    }
}

const to24HourValue = (hour12: string, minute: string, period: "AM" | "PM") => {
    let hours = Number(hour12) % 12
    if (period === "PM") hours += 12
    return `${String(hours).padStart(2, "0")}:${minute}`
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

    const isDateType = type === 'date' || type === 'datetime'

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                const selectedDate = parseFieldDate(field.value)
                const timeValue = selectedDate ? format(selectedDate, "HH:mm") : "00:00"
                const timeParts: ReturnType<typeof to12HourParts> = selectedDate
                    ? to12HourParts(selectedDate)
                    : { hour: "12", minute: "00", period: "AM" }
                const displayValue = selectedDate
                    ? type === "datetime"
                        ? formatDate(selectedDate, "PPP · HH:mm", { hour12: true })
                        : format(selectedDate, "PPP", { locale: es })
                    : null

                const commitDate = (date: Date | undefined, time = timeValue) => {
                    if (!date) {
                        field.onChange('')
                        onChange?.(undefined)
                        return
                    }

                    if (type === "datetime") {
                        const [hours, minutes] = time.split(":").map(Number)
                        const next = new Date(date)
                        next.setHours(hours || 0, minutes || 0, 0, 0)
                        const value = format(next, "yyyy-MM-dd'T'HH:mm")
                        field.onChange(value)
                        onChange?.(next)
                        return
                    }

                    const value = format(date, "yyyy-MM-dd")
                    field.onChange(value)
                    onChange?.(date)
                }

                const commitTimeParts = (
                    hour: string,
                    minute: string,
                    period: "AM" | "PM",
                ) => {
                    commitDate(
                        selectedDate ?? new Date(),
                        to24HourValue(hour, minute, period),
                    )
                }

                return (
                <div className="flex flex-col gap-1.5">
                    <label htmlFor={name} className="text-[13px] font-medium text-ink-200">
                        {label}
                    </label>

                    {isDateType ? (
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
                                    {displayValue ?? <span>{placeholder}</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        commitDate(date, timeValue)
                                        field.onBlur()
                                        if (type === "date") setIsOpen(false)
                                    }}
                                    {...calendarProps}
                                />
                                {type === "datetime" && (
                                    <div className="border-t border-ink-800 p-3">
                                        <p className="mb-1.5 text-[11px] font-medium text-ink-300">
                                            Hora
                                        </p>
                                        <div className="grid grid-cols-3 gap-2">
                                            <Select
                                                value={timeParts.hour}
                                                disabled={disabled}
                                                onValueChange={(hour) =>
                                                    commitTimeParts(
                                                        hour,
                                                        timeParts.minute,
                                                        timeParts.period,
                                                    )
                                                }
                                            >
                                                <SelectTrigger aria-label="Hora" className="h-auto">
                                                    <SelectValue placeholder="HH" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {HOUR_OPTIONS.map((hour) => (
                                                        <SelectItem key={hour} value={hour}>
                                                            {hour}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Select
                                                value={timeParts.minute}
                                                disabled={disabled}
                                                onValueChange={(minute) =>
                                                    commitTimeParts(
                                                        timeParts.hour,
                                                        minute,
                                                        timeParts.period,
                                                    )
                                                }
                                            >
                                                <SelectTrigger aria-label="Minutos" className="h-auto">
                                                    <SelectValue placeholder="MM" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {MINUTE_OPTIONS.map((minute) => (
                                                        <SelectItem key={minute} value={minute}>
                                                            {minute}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Select
                                                value={timeParts.period}
                                                disabled={disabled}
                                                onValueChange={(period) =>
                                                    commitTimeParts(
                                                        timeParts.hour,
                                                        timeParts.minute,
                                                        period as "AM" | "PM",
                                                    )
                                                }
                                            >
                                                <SelectTrigger aria-label="AM/PM" className="h-auto">
                                                    <SelectValue placeholder="AM/PM" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="AM">AM</SelectItem>
                                                    <SelectItem value="PM">PM</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}
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
                                        const isValidPct = /^(?:\d{1,2})(?:\.\d{1,2})?$/.test(normalized)

                                        if (isValidPct) {
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
                )
            }}
        />
    )
}

export default CustomFormField
