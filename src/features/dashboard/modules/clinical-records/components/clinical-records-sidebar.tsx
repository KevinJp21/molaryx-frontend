"use client";

import { useEffect, useState } from "react";
import { FileDownIcon, Plus, Search } from "lucide-react";
import { Button, Input } from "@/components";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  onCreate?: () => void;
  canCreate?: boolean;
  onExport?: () => void;
  canView?: boolean;
};

export const ClinicalRecordsSidebar = ({
  search,
  onSearchChange,
  onCreate,
  canCreate = false,
  onExport,
  canView = false,
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
    <aside className="hidden h-full w-64 shrink-0 flex-col overflow-hidden border-r border-ink-200 lg:flex">
      <div className="scrollbar-hide flex h-full flex-col items-center overflow-y-auto bg-linear-to-b from-ink-50 via-ink-50 to-ink-100/40 py-4">
        {canView && onExport && (
          <div className="mb-5 px-4 w-full">
          <Button 
            variant="destructive" 
            onClick={onExport} className="w-full"
          >
            <FileDownIcon className="h-4 w-4" />
            Exportar historia clínica
          </Button>
          </div>
        )}

        {canCreate && onCreate && (
          <div className="mb-5 px-4 w-full">
            <Button
              onClick={onCreate}
              className="w-full"
            >
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
      </div>
    </aside>
  );
};
