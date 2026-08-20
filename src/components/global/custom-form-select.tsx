'use client'

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { InputErrorMessage } from "./input-error-message";

interface Props<T extends string | number | boolean> {
    label: string;
    placeholder: string;
    items: Item<T>[];
    itemBadge?: boolean;
    errorMessage?: string;
    onChange?: (e: T | null) => void;
    name: string;
    disabled?: boolean;
    className?: string;
    defaultValue?: T;
    /** Muestra un campo de búsqueda dentro del listado. */
    searchable?: boolean;
    searchPlaceholder?: string;
    /**
     * Búsqueda remota. Si se define, el padre actualiza `items`
     * (p. ej. con el param Search de la API). Sin filtro local.
     */
    onSearch?: (query: string) => void;
    searchDebounceMs?: number;
    isSearching?: boolean;
    /** Opción que escribe `null` en el formulario (Radix no admite value vacío). */
    emptyLabel?: string;
}

const EMPTY_SELECT_VALUE = "__empty__";

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
    searchable = false,
    searchPlaceholder = "Buscar...",
    onSearch,
    searchDebounceMs = 300,
    isSearching = false,
    emptyLabel,
}: Props<T>) => {
    const { control, trigger } = useFormContext();
    const hasError = Boolean(errorMessage);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedCache, setSelectedCache] = useState<Item<T> | null>(null);
    /** Evita el anillo :focus-visible tras escribir en el buscador y seleccionar. */
    const [hideFocusStyles, setHideFocusStyles] = useState(false);
    const skipSearchOnOpen = useRef(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const selectionRef = useRef({ start: 0, end: 0 });
    const onSearchRef = useRef(onSearch);
    onSearchRef.current = onSearch;

    const itemsKey = items.map((item) => String(item.value)).join("|");

    useEffect(() => {
        if (!onSearchRef.current || !searchable) return;

        if (open && !skipSearchOnOpen.current) {
            skipSearchOnOpen.current = true;
            return;
        }

        if (!open) return;

        const timeoutId = window.setTimeout(() => {
            onSearchRef.current?.(search.trim());
        }, searchDebounceMs);

        return () => window.clearTimeout(timeoutId);
    }, [search, open, searchable, searchDebounceMs]);

    useEffect(() => {
        if (!open || !searchable) return;
        const frameId = requestAnimationFrame(() => {
            searchInputRef.current?.focus({ preventScroll: true });
        });
        return () => cancelAnimationFrame(frameId);
    }, [open, searchable]);

    // Tras cada respuesta de búsqueda Radix mueve el foco a un item;
    // lo devolvemos al input sin perder el cursor.
    useLayoutEffect(() => {
        if (!open || !searchable) return;

        const restore = () => {
            const input = searchInputRef.current;
            if (!input) return;
            const { start, end } = selectionRef.current;
            input.focus({ preventScroll: true });
            try {
                input.setSelectionRange(start, end);
            } catch {
                // ignore
            }
        };

        restore();
        const frameId = requestAnimationFrame(restore);
        return () => cancelAnimationFrame(frameId);
    }, [itemsKey, isSearching, open, searchable]);

    const rememberSelection = (el: HTMLInputElement) => {
        selectionRef.current = {
            start: el.selectionStart ?? el.value.length,
            end: el.selectionEnd ?? el.value.length,
        };
    };

    const clearTriggerFocus = () => {
        setHideFocusStyles(true);
        window.setTimeout(() => {
            triggerRef.current?.blur();
        }, 50);
    };

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
                    const selectedFromItems = items.find(
                        (item) => String(item.value) === String(field.value),
                    );
                    const selectedItem = selectedFromItems ?? (
                        selectedCache && String(selectedCache.value) === String(field.value)
                            ? selectedCache
                            : null
                    );

                    const sourceItems = onSearch
                        ? items
                        : searchable && search.trim()
                            ? items.filter((item) =>
                                  item.name
                                      .normalize("NFD")
                                      .replace(/\p{M}/gu, "")
                                      .toLowerCase()
                                      .includes(
                                          search
                                              .normalize("NFD")
                                              .replace(/\p{M}/gu, "")
                                              .toLowerCase()
                                              .trim(),
                                      ),
                              )
                            : items;

                    const listItems = (() => {
                        let next = sourceItems;
                        if (selectedItem) {
                            const alreadyIncluded = sourceItems.some(
                                (item) => String(item.value) === String(selectedItem.value),
                            );
                            next = alreadyIncluded ? sourceItems : [selectedItem, ...sourceItems];
                        }
                        if (emptyLabel) {
                            return [
                                { name: emptyLabel, value: EMPTY_SELECT_VALUE as T },
                                ...next.filter(
                                    (item) => String(item.value) !== EMPTY_SELECT_VALUE,
                                ),
                            ];
                        }
                        return next;
                    })();

                    return (
                        <>
                            <Select
                                disabled={disabled}
                                open={open}
                                onOpenChange={(nextOpen) => {
                                    setOpen(nextOpen);
                                    if (nextOpen) {
                                        skipSearchOnOpen.current = false;
                                        setHideFocusStyles(false);
                                        return;
                                    }
                                    // Solo limpia el texto local; el GET lo hace el padre
                                    // al montar / al buscar, no al cerrar el listado.
                                    setSearch("");
                                    if (searchable) clearTriggerFocus();
                                }}
                                onValueChange={(val) => {
                                    if (val === EMPTY_SELECT_VALUE) {
                                        setSelectedCache(null);
                                        onChange?.(null);
                                        field.onChange(null);
                                        field.onBlur();
                                        void trigger(name);
                                        if (searchable) clearTriggerFocus();
                                        return;
                                    }
                                    const nextItem = listItems.find(
                                        (item) => String(item.value) === val,
                                    );
                                    if (nextItem) {
                                        setSelectedCache(nextItem);
                                        onChange?.(nextItem.value);
                                        field.onChange(nextItem.value);
                                        field.onBlur();
                                        void trigger(name);
                                        if (searchable) clearTriggerFocus();
                                    }
                                }}
                                value={
                                    field.value === undefined || field.value === null || field.value === ""
                                        ? emptyLabel
                                            ? EMPTY_SELECT_VALUE
                                            : ""
                                        : String(field.value)
                                }
                            >
                                <SelectTrigger
                                    ref={triggerRef}
                                    id={name}
                                    disabled={disabled}
                                    aria-invalid={invalid}
                                    style={
                                        hideFocusStyles
                                            ? { outline: "none", boxShadow: "none" }
                                            : undefined
                                    }
                                    className={cn(
                                        "h-auto w-full min-w-0 rounded-xl border border-ink-700 bg-ink-900 px-3.5 py-2.5 text-sm text-ink-50 shadow-none outline-none",
                                        "transition-[border-color,box-shadow] duration-200",
                                        "data-placeholder:text-ink-400",
                                        "focus-visible:border-accent-500 focus-visible:ring-[3px] focus-visible:ring-accent-500/20",
                                        "aria-invalid:border-coral-500 aria-invalid:ring-[3px] aria-invalid:ring-coral-500/20",
                                        "disabled:cursor-not-allowed disabled:opacity-70",
                                        "[&_svg]:text-ink-400",
                                        hideFocusStyles &&
                                            "border-ink-700! ring-0! outline-none! focus:border-ink-700! focus:ring-0! focus:outline-none! focus-visible:border-ink-700! focus-visible:ring-0! focus-visible:outline-none!",
                                        className,
                                    )}
                                >
                                    <SelectValue placeholder={placeholder}>
                                        {selectedItem?.name}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent
                                    className={cn(
                                        "max-h-50 w-(--radix-select-trigger-width) rounded-xl border-ink-700 bg-ink-950 text-ink-50 shadow-md",
                                    )}
                                    onCloseAutoFocus={(e) => {
                                        e.preventDefault();
                                        if (searchable) clearTriggerFocus();
                                    }}
                                    header={
                                        searchable ? (
                                            <div
                                                className="border-b border-ink-800 bg-ink-950 p-2"
                                                onPointerDown={(e) => e.stopPropagation()}
                                                onKeyDown={(e) => e.stopPropagation()}
                                            >
                                                <div className="relative">
                                                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-400" />
                                                    <Input
                                                        ref={searchInputRef}
                                                        value={search}
                                                        onChange={(e) => {
                                                            rememberSelection(e.currentTarget);
                                                            setSearch(e.target.value);
                                                        }}
                                                        onSelect={(e) => {
                                                            rememberSelection(e.currentTarget);
                                                        }}
                                                        onKeyDown={(e) => e.stopPropagation()}
                                                        onKeyUp={(e) => {
                                                            rememberSelection(e.currentTarget);
                                                        }}
                                                        onPointerDown={(e) => e.stopPropagation()}
                                                        placeholder={searchPlaceholder}
                                                        className="rounded-lg py-2 pr-3 pl-8 text-[13px]"
                                                        aria-label={searchPlaceholder}
                                                    />
                                                </div>
                                            </div>
                                        ) : undefined
                                    }
                                >
                                    {listItems.length === 0 ? (
                                        <div className="px-3 py-2.5 text-sm text-ink-400">
                                            {isSearching ? "Buscando..." : "Sin resultados"}
                                        </div>
                                    ) : (
                                        listItems.map(({ name: itemName, value, disabled: itemDisabled }, index) =>
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
                                        )
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
