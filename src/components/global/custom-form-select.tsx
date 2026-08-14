'use client'

import { Controller, useFormContext } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { InputErrorMessage } from "./input-error-message";

interface Props<T extends string | number | boolean> {
    label: string;
    placeholder: string;
    items: Item<T>[];
    itemBadge?: boolean;
    errorMessage?: string;
    onChange?: (e: T) => void;
    name: string;
    disabled?: boolean;
    className?: string;
    defaultValue?: T;
}

type Item<T extends string | number | boolean> = {
    name: string,
    value: T,
    image?: string,
    disabled?: boolean
};

export const CustomFormSelect = <T extends string | number | boolean>({
    placeholder,
    items,
    label,
    itemBadge = false,
    name,
    errorMessage,
    onChange,
    disabled,
    className,
    defaultValue,
}: Props<T>) => {
    const { control, trigger } = useFormContext();
    const hasError = Boolean(errorMessage);

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={name} className="text-sm font-medium text-ink-200">
                {label}
            </label>

            <Controller
                control={control}
                name={name}
                defaultValue={defaultValue}
                render={({ field, fieldState }) => {
                    const invalid = hasError || Boolean(fieldState.error && fieldState.isTouched);

                    return (
                        <>
                            <Select
                                disabled={disabled}
                                onValueChange={(val) => {
                                    const selectedItem = items.find(
                                        (item) => String(item.value) === val,
                                    );
                                    if (selectedItem) {
                                        onChange?.(selectedItem.value);
                                        field.onChange(selectedItem.value);
                                        field.onBlur();
                                        void trigger(name);
                                    }
                                }}
                                value={
                                    field.value !== undefined && field.value !== null
                                        ? String(field.value)
                                        : ""
                                }
                            >
                                <SelectTrigger
                                    id={name}
                                    disabled={disabled}
                                    aria-invalid={invalid}
                                    className={cn(
                                        "h-auto w-full min-w-0 rounded-xl border border-ink-700 bg-ink-900 px-3.5 py-2.5 text-sm text-ink-50 shadow-none",
                                        "transition-[border-color,box-shadow] duration-200",
                                        "data-placeholder:text-ink-400",
                                        "focus-visible:border-accent-500 focus-visible:ring-[3px] focus-visible:ring-accent-500/20",
                                        "aria-invalid:border-coral-500 aria-invalid:ring-[3px] aria-invalid:ring-coral-500/20",
                                        "disabled:cursor-not-allowed disabled:opacity-70",
                                        "[&_svg]:text-ink-400",
                                        className,
                                    )}
                                >
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                                <SelectContent
                                    className={cn(
                                        "max-h-50 w-(--radix-select-trigger-width) overflow-y-auto rounded-xl border-ink-700 bg-ink-950 text-ink-50 shadow-md",
                                    )}
                                >
                                    {items.map(({ name: itemName, value, disabled: itemDisabled }, index) =>
                                        itemBadge ? (
                                            <SelectItem
                                                key={`${value}-${index}`}
                                                value={String(value)}
                                                disabled={itemDisabled}
                                                className="rounded-lg text-ink-50 focus:bg-ink-850 focus:text-ink-50"
                                            >
                                                <Badge>{itemName}</Badge>
                                            </SelectItem>
                                        ) : (
                                            <SelectItem
                                                key={`${value}-${index}`}
                                                value={String(value)}
                                                disabled={itemDisabled}
                                                className="rounded-lg text-ink-50 focus:bg-ink-850 focus:text-ink-50"
                                            >
                                                {itemName}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                            {fieldState.error && fieldState.isTouched && (
                                <InputErrorMessage message={fieldState.error.message} />
                            )}
                        </>
                    );
                }}
            />
        </div>
    );
}

export default CustomFormSelect;
