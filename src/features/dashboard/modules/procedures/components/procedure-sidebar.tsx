"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Plus, RotateCcw, Search } from "lucide-react";
import { Button, CustomFormSelect, Input } from "@/components";
import { PROCEDURE_STATUS_FILTER_OPTIONS, type TProcedureStatusFilter } from "../consts";

type TFilterForm = {
    isActive: TProcedureStatusFilter;
};

type TProps = {
    status: TProcedureStatusFilter;
    search: string;
    onStatusChange: (value: TProcedureStatusFilter) => void;
    onSearchChange: (value: string) => void;
    onCreateClick?: () => void;
    canCreate?: boolean;
    canView?: boolean;
}

export const ProcedureSidebar = ({
    status,
    search,
    onStatusChange,
    onSearchChange,
    onCreateClick,
    canCreate = false,
}: TProps) => {
    const [searchDraft, setSearchDraft] = useState(search);
    const methods = useForm<TFilterForm>({
        values: {
            isActive: status
        }
    });

    useEffect(() => {
        setSearchDraft(search);
    }, [search]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            if (searchDraft !== search) onSearchChange(searchDraft);
        }, 300);
        return () => window.clearTimeout(timer);
    }, [searchDraft, search, onSearchChange]);

    const hasActiveFilters = Boolean(searchDraft.trim()) || status !== "all";

    const handleResetFilters = () => {
        setSearchDraft("");
        methods.reset({ isActive: "all" });
        onSearchChange("");
        onStatusChange("all");
    };

    return (
        <aside className="hidden h-full w-64 shrink-0 flex-col overflow-hidden border-r border-ink-200 lg:flex">
            <div className="scrollbar-hide flex h-full flex-col overflow-y-auto bg-linear-to-b from-ink-50 via-ink-50 to-ink-100/40 py-4">
                {canCreate && onCreateClick && (
                    <div className="mb-5 px-4">
                        <Button
                            className="w-full"
                            onClick={onCreateClick}
                        >
                            <Plus className="size-5" />
                            <span className="text-sm">Agregar procedimiento</span>
                        </Button>
                    </div>
                )}

                <div className="mb-5 px-4">
                    <label className="mb-2 block text-xs font-medium tracking-wider text-ink-800">
                        Buscar
                    </label>
                    <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-600" />
                        <Input
                            value={searchDraft}
                            onChange={(event) => setSearchDraft(event.target.value)}
                            placeholder="Procedimiento, descripción..."
                            className="rounded-xl border-ink-300 bg-ink-100/80 py-2.5 pl-9"
                            aria-label="Buscar procedimientos"
                        />
                    </div>
                </div>

                <FormProvider {...methods}>
                    <div className="px-4">
                        <CustomFormSelect
                            name="isActive"
                            label="Estado"
                            placeholder="Todos"
                            items={PROCEDURE_STATUS_FILTER_OPTIONS.map((option) => ({
                                name: option.label,
                                value: option.value,
                            }))}
                            onChange={(value) => {
                                if (value == null) return;
                                onStatusChange(value as TProcedureStatusFilter);
                            }}
                        />
                    </div>
                </FormProvider>

                <div className="mt-auto w-full px-4">
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleResetFilters}
                        disabled={!hasActiveFilters}
                        className="w-full gap-2"
                    >
                        <RotateCcw className="size-4" />
                        Reiniciar filtros
                    </Button>
                </div>
            </div>
        </aside>
    )
}