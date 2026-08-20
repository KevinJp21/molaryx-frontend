'use client'

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { InputErrorMessage } from "./input-error-message";

export type TSelectItem<T extends string | number | boolean> = {
    name: string;
    value: T;
    image?: string;
    disabled?: boolean;
};

interface Props<T extends string | number | boolean> {
    label: string;
    placeholder: string;
    /** Página actual (o listado completo). Con `onLoadMore` se acumula. */
    items: TSelectItem<T>[];
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
     * Reinicia el acumulado de paginación.
     */
    onSearch?: (query: string) => void;
    searchDebounceMs?: number;
    isSearching?: boolean;
    /** Opción que escribe `null` en el formulario (Radix no admite value vacío). */
    emptyLabel?: string;
    /**
     * Paginación: botón “Cargar más” en el footer del listado.
     * Preferir `usePaginatedSelect` (`@/hooks`) en el padre para Page/Search/hasMore.
     * Este select acumula los `items` nuevos entre páginas.
     */
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoadingMore?: boolean;
    /** Cambia (p. ej. idPatient) para vaciar el acumulado y volver a página 1. */
    resetKey?: string | number | null;
}

const EMPTY_SELECT_VALUE = "__empty__";

const mergeUniqueItems = <T extends string | number | boolean>(
    current: TSelectItem<T>[],
    incoming: TSelectItem<T>[],
) => {
    const seen = new Set(current.map((item) => String(item.value)));
    const next = [...current];
    for (const item of incoming) {
        const key = String(item.value);
        if (seen.has(key)) continue;
        seen.add(key);
        next.push(item);
    }
    return next;
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
    onLoadMore,
    hasMore = false,
    isLoadingMore = false,
    resetKey,
}: Props<T>) => {
    const { control, trigger } = useFormContext();
    const hasError = Boolean(errorMessage);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedCache, setSelectedCache] = useState<TSelectItem<T> | null>(null);
    const [accumulatedItems, setAccumulatedItems] = useState<TSelectItem<T>[]>(items);
    /** Evita el anillo :focus-visible tras escribir en el buscador y seleccionar. */
    const [hideFocusStyles, setHideFocusStyles] = useState(false);
    const skipSearchOnOpen = useRef(false);
    const hadRemoteSearchRef = useRef(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const selectionRef = useRef({ start: 0, end: 0 });
    const onSearchRef = useRef(onSearch);
    const onLoadMoreRef = useRef(onLoadMore);
    const mergeModeRef = useRef<"replace" | "append">("replace");
    onSearchRef.current = onSearch;
    onLoadMoreRef.current = onLoadMore;

    const infinite = Boolean(onLoadMore);
    const itemsKey = items.map((item) => String(item.value)).join("|");
    const itemsRef = useRef(items);
    itemsRef.current = items;

    useEffect(() => {
        mergeModeRef.current = "replace";
        // Sembrar con la página actual; vaciar a [] dejaba el listado
        // vacío si itemsKey no cambiaba después.
        setAccumulatedItems(itemsRef.current);
    }, [resetKey]);

    useEffect(() => {
        if (!infinite) {
            setAccumulatedItems(items);
            return;
        }

        setAccumulatedItems((current) => {
            if (mergeModeRef.current === "append") {
                return mergeUniqueItems(current, items);
            }
            // Evita vaciar el listado mientras llega la respuesta del GET.
            if (items.length === 0 && current.length > 0) {
                return current;
            }
            return items;
        });
    }, [itemsKey, infinite]); // eslint-disable-line react-hooks/exhaustive-deps -- items via itemsKey

    useEffect(() => {
        if (!onSearchRef.current || !searchable) return;

        if (open && !skipSearchOnOpen.current) {
            skipSearchOnOpen.current = true;
            return;
        }

        if (!open) return;

        const timeoutId = window.setTimeout(() => {
            mergeModeRef.current = "replace";
            const query = search.trim();
            hadRemoteSearchRef.current = query.length > 0;
            onSearchRef.current?.(query);
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

    const requestLoadMore = () => {
        if (!hasMore || isLoadingMore || isSearching) return;
        mergeModeRef.current = "append";
        onLoadMoreRef.current?.();
    };

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

    const displayItems =
        infinite && accumulatedItems.length > 0 ? accumulatedItems : items;

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
                    const selectedFromItems = displayItems.find(
                        (item) => String(item.value) === String(field.value),
                    );
                    const selectedItem = selectedFromItems ?? (
                        selectedCache && String(selectedCache.value) === String(field.value)
                            ? selectedCache
                            : null
                    );

                    const sourceItems = onSearch
                        ? displayItems
                        : searchable && search.trim()
                            ? displayItems.filter((item) =>
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
                            : displayItems;

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
                                        // Evita el debounce duplicado al abrir.
                                        skipSearchOnOpen.current = true;
                                        setHideFocusStyles(false);
                                        setSearch("");
                                        // Resincroniza si el acumulado quedó vacío con datos en Redux.
                                        if (infinite && itemsRef.current.length > 0) {
                                            setAccumulatedItems((current) =>
                                                current.length > 0
                                                    ? current
                                                    : itemsRef.current,
                                            );
                                        }
                                        // Si había búsqueda remota, al reabrir pedimos la lista base
                                        // para no dejar solo el resultado filtrado.
                                        if (onSearchRef.current && hadRemoteSearchRef.current) {
                                            hadRemoteSearchRef.current = false;
                                            mergeModeRef.current = "replace";
                                            onSearchRef.current("");
                                        }
                                        return;
                                    }
                                    setSearch("");
                                    if (searchable) clearTriggerFocus();
                                }}
                                onValueChange={(val) => {
                                    if (val === EMPTY_SELECT_VALUE) {
                                        setSelectedCache(null);
                                        field.onChange(null);
                                        onChange?.(null);
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
                                        "max-h-80 w-(--radix-select-trigger-width) rounded-xl border-ink-700 bg-ink-950 text-ink-50 shadow-md",
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
                                    footer={
                                        infinite && hasMore ? (
                                            <div
                                                className="border-t border-ink-800 bg-ink-950 p-2"
                                                onPointerDown={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                                onKeyDown={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    type="button"
                                                    disabled={isLoadingMore || isSearching}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        requestLoadMore();
                                                    }}
                                                    className="w-full rounded-lg px-2 py-1.5 text-center text-xs font-medium text-accent-400 transition-colors hover:bg-ink-850 hover:text-accent-300 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {isLoadingMore ? "Cargando más..." : "Cargar más"}
                                                </button>
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
