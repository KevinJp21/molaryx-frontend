"use client";

import { useMemo, useState } from "react";
import { addMonths, format, isSameDay, isSameMonth, isToday, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components";
import { cn } from "@/lib/utils";
import { getMonthGrid, WEEK_STARTS_ON } from "../../utils";
import type { TCalendarView } from "../../types";
import { eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns";

type Props = {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onViewChange: (view: TCalendarView) => void;
};

export const MiniCalendar = ({ currentDate, onDateChange, onViewChange }: Props) => {
  const [viewDate, setViewDate] = useState(currentDate);
  const [syncedDate, setSyncedDate] = useState(currentDate);

  // El mes visible sigue a la fecha activa salvo que se navegue con las flechas.
  if (currentDate !== syncedDate) {
    setSyncedDate(currentDate);
    setViewDate(currentDate);
  }

  const days = useMemo(() => getMonthGrid(viewDate), [viewDate]);
  const weekDays = useMemo(() => {
    const start = startOfWeek(viewDate, { weekStartsOn: WEEK_STARTS_ON });
    return eachDayOfInterval({
      start,
      end: endOfWeek(viewDate, { weekStartsOn: WEEK_STARTS_ON }),
    });
  }, [viewDate]);

  return (
    <div className="w-full px-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold capitalize text-ink-950">
          {format(viewDate, "MMMM yyyy", { locale: es })}
        </span>
        <div className="flex items-center rounded-lg bg-ink-100 p-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md"
            onClick={() => {
              const next = subMonths(viewDate, 1);
              setViewDate(next);
              onDateChange(next);
              onViewChange("month");
            }}
            aria-label="Mes anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md"
            onClick={() => {
              const next = addMonths(viewDate, 1);
              setViewDate(next);
              onDateChange(next);
              onViewChange("month");
            }}
            aria-label="Mes siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 text-center">
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="text-[10px] font-semibold uppercase text-ink-600"
          >
            {format(day, "EEEEE", { locale: es })}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-center">
        {days.map((day) => {
          const selected = isSameDay(day, currentDate);
          const inMonth = isSameMonth(day, viewDate);
          const today = isToday(day);

          return (
            <Button
              key={day.toISOString()}
              type="button"
              variant={selected ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => {
                onDateChange(day);
                onViewChange("day");
              }}
              className={cn(
                "mx-auto rounded-xl text-xs font-medium",
                !inMonth && "text-ink-500",
                inMonth && !selected && !today && "hover:bg-accent-100",
                selected && "scale-105 shadow-md shadow-accent-500/30",
                !selected && today && "bg-accent-100 text-accent-700 ring-1 ring-accent-300",
              )}
            >
              {format(day, "d")}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
