"use client";

import { useEffect, useState } from "react";
import { Check, ClipboardList, Plus, Search } from "lucide-react";
import { Button, Input } from "@/components";
import { cn } from "@/lib/utils";
import {
  PATIENT_TREATMENT_STATUS_SIDEBAR_OPTIONS,
  type TPatientTreatmentStatusFilter,
} from "../consts";

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
    <aside className="hidden h-full w-64 shrink-0 flex-col overflow-hidden border-r border-ink-800 lg:flex">
      <div className="scrollbar-hide flex h-full flex-col overflow-y-auto bg-linear-to-b from-ink-950 via-ink-950 to-ink-900/40 py-4">
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
          <div className="mb-5 flex items-center gap-2.5 px-4 text-ink-400">
            <ClipboardList className="size-4 shrink-0" strokeWidth={1.75} />
            <span className="text-xs">Filtros del listado</span>
          </div>
        )}

        <div className="mb-5 px-4">
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-ink-400">
            Buscar
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" />
            <Input
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Paciente, tratamiento…"
              className="rounded-xl border-ink-700 bg-ink-900/80 py-2.5 pl-9"
              aria-label="Buscar planes de tratamiento"
            />
          </div>
        </div>

        <div className="px-4">
          <div className="rounded-2xl bg-ink-900/60 p-3">
            <p className="mb-2 px-2 text-sm font-semibold text-ink-50">Estado</p>
            <div className="space-y-1">
              {PATIENT_TREATMENT_STATUS_SIDEBAR_OPTIONS.map((option) => {
                const isActive = status === option.value;

                return (
                  <Button
                    key={String(option.value)}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onStatusChange(option.value)}
                    className="group h-auto w-full justify-start gap-3 rounded-xl px-2 py-2 font-medium hover:bg-accent-500/10"
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200",
                        isActive ? "border-transparent" : "border-ink-600 bg-ink-950",
                      )}
                      style={{
                        backgroundColor: isActive ? option.color : undefined,
                      }}
                    >
                      {isActive && (
                        <Check className="size-3.5 text-white" strokeWidth={3} />
                      )}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink-100">
                      {option.label}
                    </span>
                    <span
                      className="size-2 rounded-full opacity-60 transition-opacity group-hover:opacity-100"
                      style={{ backgroundColor: option.color }}
                    />
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
