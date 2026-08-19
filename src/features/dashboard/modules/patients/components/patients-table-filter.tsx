'use client';

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

import {
    Button,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    CustomFormField,
    CustomFormSelect,
} from "@/components";
import { IS_ACTIVE_STATUS } from "@/features/dashboard/consts/is-active-status";
import { TGetPatientsParams } from "../actions";

type TPatientsTableFilterProps = {
    params: TGetPatientsParams;
    onFiltersChange: (filters: TGetPatientsParams) => void;
};

type TFormValues = {
    searchTerm: string;
    isActive: boolean | typeof ALL_STATUSES_VALUE;
};

const ALL_STATUSES_VALUE = "all";

const STATUS_ITEMS = [
    { value: ALL_STATUSES_VALUE, name: "Todos" },
    ...IS_ACTIVE_STATUS.map((s) => ({ value: s.value, name: s.name })),
];

export const PatientsTableFilter = ({
    params,
    onFiltersChange,
}: TPatientsTableFilterProps) => {
    const [open, setOpen] = useState(false);

    const filterForm = useForm<TFormValues>({
        defaultValues: {
            searchTerm: params.Search ?? "",
            isActive: params.IsActive ?? ALL_STATUSES_VALUE,
        },
    });

    const { watch, reset } = filterForm;

    const searchTerm = watch("searchTerm");
    const isActive = watch("isActive");

    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const queryParams: TGetPatientsParams = {};
        const term = debouncedSearch?.trim();
        if (term) queryParams.Search = term;
        if (isActive !== ALL_STATUSES_VALUE) queryParams.IsActive = isActive;
        onFiltersChange(queryParams);
    }, [debouncedSearch, isActive, onFiltersChange]);

    const handleReset = () => {
        reset({ searchTerm: "", isActive: ALL_STATUSES_VALUE });
    };

    const activeCount = [
        isActive !== ALL_STATUSES_VALUE ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <FormProvider {...filterForm}>
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink-800 px-4 py-3">
                    <div className="w-full max-w-75">
                        <CustomFormField
                            name="searchTerm"
                            label="Buscar"
                            type="text"
                            placeholder="Nombre, cédula, teléfono…"
                        />
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setOpen(true)}
                        className="relative gap-2"
                    >
                        <SlidersHorizontal className="size-4" />
                        Filtros
                        {activeCount > 0 && (
                            <span className="flex size-5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                                {activeCount}
                            </span>
                        )}
                    </Button>
                </div>

                <SheetContent>
                    <form className="flex h-full flex-col">
                        <SheetHeader>
                            <SheetTitle>Filtros</SheetTitle>
                            <SheetDescription>
                                Filtra la lista de pacientes por los criterios que necesites.
                            </SheetDescription>
                        </SheetHeader>

                        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6">
                            <CustomFormSelect
                                name="isActive"
                                label="Estado"
                                placeholder="Todos"
                                items={STATUS_ITEMS.map((s) => ({
                                    value: s.value,
                                    name: s.name,
                                }))}
                            />
                        </div>

                        <SheetFooter>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleReset}
                                className="w-full gap-2"
                            >
                                <RotateCcw className="size-4" />
                                Reiniciar filtros
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </FormProvider>
        </Sheet>
    );
};
