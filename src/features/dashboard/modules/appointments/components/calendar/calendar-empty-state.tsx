"use client";

import {
  Calendar,
  CalendarClock,
  CalendarDays,
  ListTodo,
  Plus,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TCalendarView } from "../../types";

type Props = {
  view: TCalendarView;
  onCreateClick?: () => void;
  className?: string;
};

const VIEW_ICON: Record<TCalendarView, LucideIcon> = {
  month: Calendar,
  week: CalendarDays,
  day: CalendarClock,
  agenda: ListTodo,
  resource: Users,
};

const VIEW_TITLE: Record<TCalendarView, string> = {
  month: "Sin citas este mes",
  week: "Sin citas esta semana",
  day: "Sin citas este día",
  agenda: "Sin citas próximas",
  resource: "Sin citas asignadas",
};

const VIEW_DESCRIPTION: Record<TCalendarView, string> = {
  month: "La agenda del mes está libre. Crea la primera cita para empezar.",
  week: "No hay nada programado esta semana. Crea una cita para organizar la agenda.",
  day: "El día está libre. Agenda una cita para aprovecharlo.",
  agenda: "No hay citas próximas. Planifica con anticipación creando una nueva.",
  resource: "Ningún profesional tiene citas asignadas en esta fecha.",
};

export const CalendarEmptyState = ({ view, onCreateClick, className }: Props) => {
  const Icon = VIEW_ICON[view];

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[400px] flex-col items-center justify-center px-6 py-12",
        className,
      )}
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 scale-150 rounded-full bg-gradient-to-br from-accent-500/5 via-transparent to-accent-500/5 blur-3xl" />
        <div className="relative rounded-3xl border border-ink-800 bg-gradient-to-br from-ink-900/60 to-ink-900/20 p-6">
          <Icon className="size-16 text-ink-500/40" strokeWidth={1.5} />
        </div>
      </div>

      <div className="max-w-sm text-center">
        <h3 className="mb-2 text-lg font-semibold text-ink-50">{VIEW_TITLE[view]}</h3>
        <p className="mb-6 text-sm leading-relaxed text-ink-400">
          {VIEW_DESCRIPTION[view]}
        </p>

        {onCreateClick && (
          <button
            type="button"
            onClick={onCreateClick}
            className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent-500/20 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-accent-500/30 active:scale-95"
          >
            <Plus className="size-4" />
            Nueva cita
          </button>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
        <span className="absolute left-1/4 top-1/4 size-2 rounded-full bg-accent-500/20" />
        <span className="absolute right-1/3 top-1/3 size-3 rounded-full bg-accent-500/10" />
        <span className="absolute bottom-1/4 left-1/3 size-2 rounded-full bg-accent-500/15" />
        <span className="absolute bottom-1/3 right-1/4 size-4 rounded-full bg-accent-500/5" />
      </div>
    </div>
  );
};
