"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FileDownIcon, Plus, RotateCcw, Search } from "lucide-react";
import { Button, CustomFormField, Input } from "@/components";
import { formatDate } from "@/utils";

type TFilterForm = {
  from: string;
  to: string;
};

type Props = {
  search: string;
  from: string;
  to: string;
  onSearchChange: (value: string) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onCreate?: () => void;
  canCreate?: boolean;
  onExport?: () => void;
  canView?: boolean;
};

export const ClinicalRecordsSidebar = ({
  search,
  from,
  to,
  onSearchChange,
  onFromChange,
  onToChange,
  onCreate,
  canCreate = false,
  onExport,
  canView = false,
}: Props) => {
  const [searchDraft, setSearchDraft] = useState(search);
  const methods = useForm<TFilterForm>({
    values: {
      from,
      to,
    },
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

  /* Se evalúa sobre searchDraft (no sobre search) para que el botón reaccione
   de inmediato aunque el debounce de 300ms aún no haya emitido el valor. */
  const hasActiveFilters = Boolean(searchDraft.trim() || from || to);

  const handleResetFilters = () => {
    setSearchDraft("");
    methods.reset({ from: "", to: "" });
    onSearchChange("");
    onFromChange("");
    onToChange("");
  };

  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col overflow-hidden border-r border-ink-200 lg:flex">
      <div className="scrollbar-hide flex h-full flex-col items-center overflow-y-auto bg-linear-to-b from-ink-50 via-ink-50 to-ink-100/40 py-4">
        {canView && onExport && (
          <div className="mb-5 w-full px-4">
            <Button
              variant="destructive"
              onClick={onExport}
              className="w-full"
            >
              <FileDownIcon className="h-4 w-4" />
              Exportar historia clínica
            </Button>
          </div>
        )}

        {canCreate && onCreate && (
          <div className="mb-5 w-full px-4">
            <Button onClick={onCreate} className="w-full">
              <Plus className="size-5" />
              <span className="text-sm">Crear registro clínico</span>
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
              placeholder="Nombre, cédula, teléfono…"
              className="rounded-xl border-ink-300 bg-ink-100/80 py-2.5 pl-9"
              aria-label="Buscar pacientes"
            />
          </div>
        </div>

        <FormProvider {...methods}>
          <div className="flex w-full flex-col gap-3 px-4">
            <CustomFormField
              name="from"
              label="Desde"
              placeholder="Fecha inicial"
              type="date"
              onChange={(date) => onFromChange(date ? formatDate(date, "yyyy-MM-dd") : "")}
            />
            <CustomFormField
              name="to"
              label="Hasta"
              placeholder="Fecha final"
              type="date"
              onChange={(date) => onToChange(date ? formatDate(date, "yyyy-MM-dd") : "")}
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
  );
};
