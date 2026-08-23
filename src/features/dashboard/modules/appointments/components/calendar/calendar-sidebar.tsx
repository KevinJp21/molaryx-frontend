"use client";

import { useState } from "react";
import { Check, ChevronDown, Plus, Users } from "lucide-react";
import { Button } from "@/components";
import { cn } from "@/lib/utils";
import { MiniCalendar } from "./mini-calendar";
import type { TCalendarFilter, TCalendarResource, TCalendarView } from "../../types";

type Props = {
  isOpen: boolean;
  currentDate: Date;
  calendars: TCalendarFilter[];
  resources: TCalendarResource[];
  activeResourceId: string | null;
  onDateChange: (date: Date) => void;
  onViewChange: (view: TCalendarView) => void;
  onCalendarToggle: (id: string, active: boolean) => void;
  onResourceChange: (id: string | null) => void;
  onCreateClick: () => void;
  canCreate?: boolean;
};

export const CalendarSidebar = ({
  isOpen,
  currentDate,
  calendars,
  resources,
  activeResourceId,
  onDateChange,
  onViewChange,
  onCalendarToggle,
  onResourceChange,
  onCreateClick,
  canCreate = false,
}: Props) => {
  const [statusesOpen, setStatusesOpen] = useState(true);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const activeResourceLabel =
    resources.find((resource) => resource.id === activeResourceId)?.label ??
    "Todos los profesionales";

  return (
    <aside
      className={cn(
        "hidden h-full shrink-0 overflow-hidden border-r border-ink-800 transition-[width,opacity] duration-300 ease-in-out lg:block",
        isOpen ? "w-64 opacity-100" : "w-0 opacity-0",
      )}
    >
      <div className="scrollbar-hide flex h-full w-64 flex-col overflow-y-auto bg-linear-to-b from-ink-950 via-ink-950 to-ink-900/40 py-4">
        {canCreate && (
          <div className="mb-6 px-4">
            <Button
              type="button"
              className="h-12 w-full justify-center gap-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-accent-500/20 active:scale-[0.98]"
              onClick={onCreateClick}
            >
              <Plus className="size-5" />
              <span className="text-sm">Nueva cita</span>
            </Button>
          </div>
        )}

        <MiniCalendar
          currentDate={currentDate}
          onDateChange={onDateChange}
          onViewChange={onViewChange}
        />

        <div className="mt-5 flex-1 space-y-5 px-4">
          <div className="rounded-2xl bg-ink-900/60 p-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setStatusesOpen((open) => !open)}
              className="-m-1 mb-2 h-auto w-full justify-between rounded-xl p-2 hover:bg-accent-50"
            >
              <span className="text-sm font-semibold text-ink-50">Estados</span>
              <ChevronDown
                className={cn(
                  "size-4 text-ink-400 transition-transform duration-200",
                  statusesOpen && "rotate-180",
                )}
              />
            </Button>

            {statusesOpen && (
              <div className="space-y-1">
                {calendars.length === 0 ? (
                  <p className="px-2 py-2 text-xs text-ink-400">
                    Sin estados en este periodo
                  </p>
                ) : (
                  calendars.map((calendar) => {
                    const isActive = calendar.active ?? true;

                    return (
                      <Button
                        key={calendar.id}
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onCalendarToggle(calendar.id, !isActive)}
                        className="group h-auto w-full justify-start gap-3 rounded-xl px-2 py-2 font-medium hover:bg-accent-50"
                      >
                        <span
                          className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200",
                            isActive ? "border-transparent" : "border-ink-600 bg-ink-950",
                          )}
                          style={{
                            backgroundColor: isActive ? calendar.color : undefined,
                          }}
                        >
                          {isActive && <Check className="size-3.5 text-white" strokeWidth={3} />}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink-100">
                          {calendar.label}
                        </span>
                        <span
                          className="size-2 rounded-full opacity-60 transition-opacity group-hover:opacity-100"
                          style={{ backgroundColor: calendar.color }}
                        />
                      </Button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto px-4 pt-5">
          <div className="rounded-2xl bg-ink-900/60 p-3">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-lg bg-accent-100 p-1.5 text-accent-600">
                <Users className="size-4" />
              </span>
              <span className="text-sm font-semibold text-ink-50">Profesional</span>
            </div>

            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setResourcesOpen((open) => !open)}
                className="h-auto w-full justify-between rounded-xl bg-accent-50 py-2.5 pr-3 pl-4 text-ink-50 hover:bg-accent-100"
              >
                <span className="mr-2 min-w-0 flex-1 truncate text-left font-medium">
                  {activeResourceLabel}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 text-ink-400 transition-transform duration-200",
                    resourcesOpen && "rotate-180",
                  )}
                />
              </Button>

              {resourcesOpen && (
                <>
                  <div
                    role="presentation"
                    className="fixed inset-0 z-40"
                    onClick={() => setResourcesOpen(false)}
                  />
                  <div className="absolute bottom-full left-0 z-50 mb-2 max-h-65 w-full overflow-y-auto rounded-xl border border-ink-750 bg-ink-950 p-1.5 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
                    {[{ id: null, label: "Todos los profesionales" }, ...resources].map(
                      (resource) => (
                        <Button
                          key={resource.id ?? "all"}
                          type="button"
                          variant={activeResourceId === resource.id ? "default" : "ghost"}
                          size="sm"
                          onClick={() => {
                            onResourceChange(resource.id);
                            setResourcesOpen(false);
                          }}
                          className={cn(
                            "h-auto w-full justify-start truncate rounded-lg px-3 py-2.5",
                            activeResourceId !== resource.id && "text-ink-100 hover:bg-accent-50",
                          )}
                        >
                          {resource.label}
                        </Button>
                      ),
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
