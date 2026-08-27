"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  ListTodo,
  Menu,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components";
import { cn } from "@/lib/utils";
import type { TCalendarView } from "../../types";

type Props = {
  currentDate: Date;
  view: TCalendarView;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: TCalendarView) => void;
  onMenuClick: () => void;
};

const VIEWS: { key: TCalendarView; label: string; icon: LucideIcon }[] = [
  { key: "month", label: "Mes", icon: CalendarDays },
  { key: "week", label: "Semana", icon: CalendarRange },
  { key: "day", label: "Día", icon: Calendar },
  { key: "agenda", label: "Agenda", icon: ListTodo },
  { key: "resource", label: "Profesionales", icon: Users },
];

export const CalendarHeader = ({
  currentDate,
  view,
  onPrev,
  onNext,
  onToday,
  onViewChange,
  onMenuClick,
}: Props) => {
  return (
    <div className="flex min-h-16 flex-col items-center justify-between gap-3 border-b border-ink-200 bg-linear-to-r from-ink-50 via-ink-50 to-ink-100/60 px-3 py-3 md:flex-row md:gap-0 md:px-5">
      <div className="flex w-full items-center justify-between gap-2 md:w-auto md:justify-start">
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden size-10 rounded-xl text-ink-600 hover:text-ink-950 lg:inline-flex"
            onClick={onMenuClick}
            aria-label="Mostrar u ocultar el panel lateral"
          >
            <Menu className="size-5" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToday}
            className="hidden h-9 rounded-xl px-5 text-sm font-medium hover:border-accent-300 hover:bg-accent-50 hover:text-accent-600 sm:inline-flex"
          >
            Hoy
          </Button>

          <div className="flex items-center rounded-xl bg-ink-100 p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onPrev}
              className="size-8 rounded-lg hover:bg-ink-50"
              aria-label="Periodo anterior"
            >
              <ChevronLeft className="size-4 text-ink-600" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onNext}
              className="size-8 rounded-lg hover:bg-ink-50"
              aria-label="Periodo siguiente"
            >
              <ChevronRight className="size-4 text-ink-600" />
            </Button>
          </div>

          <h2 className="ml-1 whitespace-nowrap text-lg font-semibold capitalize tracking-tight text-ink-950 md:ml-3 md:text-xl">
            {format(currentDate, "MMMM yyyy", { locale: es })}
          </h2>
        </div>
      </div>

      <div className="flex w-full items-center justify-end md:w-auto">
        <div className="flex items-center rounded-xl bg-ink-100 p-1">
          {VIEWS.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onViewChange(key)}
              title={label}
              className={cn(
                "h-8 gap-1.5 rounded-lg px-3 text-xs transition-all duration-200",
                view === key
                  ? "bg-ink-50 font-medium text-ink-950 shadow-sm ring-1 ring-ink-300/70"
                  : "text-ink-700 hover:bg-ink-50/50 hover:text-ink-950",
              )}
            >
              <Icon className="size-3.5" />
              <span className="hidden lg:inline">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
