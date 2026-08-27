"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Plus, Search } from "lucide-react";
import { Button, CustomFormSelect, Input, type TSelectItem } from "@/components";
import {
  TEAM_ROLE_FILTER_OPTIONS,
  TEAM_STATUS_FILTER_OPTIONS,
  type TTeamRoleFilter,
  type TTeamStatusFilter,
} from "../consts";

const ALL_VALUE = "all" as const;

const ROLE_FILTER_ITEMS: TSelectItem<TTeamRoleFilter>[] = [
  { name: "Todos", value: ALL_VALUE },
  ...TEAM_ROLE_FILTER_OPTIONS.map((option) => ({
    name: option.label,
    value: option.value,
  })),
];

type TFilterForm = {
  idUserStatus: TTeamStatusFilter;
  idUserRole: TTeamRoleFilter;
};

type Props = {
  search: string;
  status: TTeamStatusFilter;
  role: TTeamRoleFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TTeamStatusFilter) => void;
  onRoleChange: (value: TTeamRoleFilter) => void;
  onCreateClick?: () => void;
  canCreate?: boolean;
};

export const TeamSidebar = ({
  search,
  status,
  role,
  onSearchChange,
  onStatusChange,
  onRoleChange,
  onCreateClick,
  canCreate = false,
}: Props) => {
  const [searchDraft, setSearchDraft] = useState(search);
  const methods = useForm<TFilterForm>({
    values: {
      idUserStatus: status,
      idUserRole: role,
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
              <span className="text-sm">Agregar miembro</span>
            </Button>
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
              placeholder="Nombre, usuario, correo…"
              className="rounded-xl border-ink-300 bg-ink-100/80 py-2.5 pl-9"
              aria-label="Buscar miembros"
            />
          </div>
        </div>

        <FormProvider {...methods}>
          <div className="flex flex-col gap-4 px-4">
            <CustomFormSelect
              name="idUserStatus"
              label="Estado"
              placeholder="Todos"
              items={TEAM_STATUS_FILTER_OPTIONS.map((option) => ({
                name: option.label,
                value: option.value,
              }))}
              onChange={(value) => {
                if (value == null) return;
                onStatusChange(value as TTeamStatusFilter);
              }}
            />
            <CustomFormSelect
              name="idUserRole"
              label="Rol"
              placeholder="Todos"
              items={ROLE_FILTER_ITEMS}
              onChange={(value) => {
                if (value == null) return;
                onRoleChange(value);
              }}
            />
          </div>
        </FormProvider>
      </div>
    </aside>
  );
};
