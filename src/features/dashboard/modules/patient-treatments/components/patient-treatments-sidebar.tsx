"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ClipboardList, Plus, Search } from "lucide-react";
import { Button, CustomFormSelect, Input } from "@/components";
import {
  PATIENT_TREATMENT_STATUS_SIDEBAR_OPTIONS,
  type TPatientTreatmentStatusFilter,
} from "../consts";

type TFilterForm = {
  idPatientTreatmentStatus: TPatientTreatmentStatusFilter;
};

type Props = {
  search: string;
  status: TPatientTreatmentStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TPatientTreatmentStatusFilter) => void;
  onCreateClick?: () => void;
  canCreate?: boolean;
};

export const PatientTreatmentsSidebar = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onCreateClick,
  canCreate = false,
}: Props) => {
  const [searchDraft, setSearchDraft] = useState(search);
  const methods = useForm<TFilterForm>({
    values: {
      idPatientTreatmentStatus: status,
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

  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col overflow-hidden border-r border-ink-200 lg:flex">
      <div className="scrollbar-hide flex h-full flex-col overflow-y-auto bg-linear-to-b from-ink-50 via-ink-50 to-ink-100/40 py-4">
        {canCreate && onCreateClick && (
          <div className="mb-5 px-4">
            <Button
              type="button"
              className="h-12 w-full justify-center gap-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-accent-500/20 active:scale-[0.98]"
              onClick={onCreateClick}
            >
              <Plus className="size-5" />
              <span className="text-sm">Asignar tratamiento</span>
            </Button>
          </div>
        )}

        {!canCreate && (
          <div className="mb-5 flex items-center gap-2.5 px-4 text-ink-600">
            <ClipboardList className="size-4 shrink-0" strokeWidth={1.75} />
            <span className="text-xs">Filtros del listado</span>
          </div>
        )}

        <div className="mb-5 px-4">
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-ink-600">
            Buscar
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-600" />
            <Input
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Paciente, tratamiento…"
              className="rounded-xl border-ink-300 bg-ink-100/80 py-2.5 pl-9"
              aria-label="Buscar planes de tratamiento"
            />
          </div>
        </div>

        <FormProvider {...methods}>
          <div className="px-4">
            <CustomFormSelect
              name="idPatientTreatmentStatus"
              label="Estado"
              placeholder="Todos"
              items={PATIENT_TREATMENT_STATUS_SIDEBAR_OPTIONS.map((option) => ({
                name: option.label,
                value: option.value,
              }))}
              onChange={(value) => {
                if (value == null) return;
                onStatusChange(value as TPatientTreatmentStatusFilter);
              }}
            />
          </div>
        </FormProvider>
      </div>
    </aside>
  );
};
