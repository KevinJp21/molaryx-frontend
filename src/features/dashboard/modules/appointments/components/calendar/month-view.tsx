"use client";

import { memo, useMemo } from "react";
import type { MouseEvent } from "react";
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { getMonthGrid, WEEK_STARTS_ON } from "../../utils/get-month-grid";
import type { TAppointmentCalendarEvent } from "../../types";
import { DraggableEvent, DroppableCell } from "./dnd";

type Props = {
  currentDate: Date;
  events: TAppointmentCalendarEvent[];
  readonly?: boolean;
  onEventClick: (event: TAppointmentCalendarEvent) => void;
  onEventContextMenu?: (event: TAppointmentCalendarEvent, mouse: MouseEvent) => void;
  onDateClick: (date: Date) => void;
};

const MonthEventItem = memo(
  ({
    event,
    readonly,
    onEventClick,
    onEventContextMenu,
  }: {
    event: TAppointmentCalendarEvent;
    readonly?: boolean;
    onEventClick: (event: TAppointmentCalendarEvent) => void;
    onEventContextMenu?: (event: TAppointmentCalendarEvent, mouse: MouseEvent) => void;
  }) => (
    <DraggableEvent event={event} disabled={readonly}>
      <div
        role="button"
        tabIndex={0}
        title={event.title}
        className="cursor-pointer truncate rounded-lg px-2.5 py-1.5 text-xs shadow-sm transition-all duration-200 hover:z-10 hover:scale-[1.02] hover:shadow-md"
        style={{
          backgroundColor: `${event.color}20`,
          color: event.color,
          borderLeft: `3px solid ${event.color}`,
        }}
        onClick={(clickEvent) => {
          clickEvent.stopPropagation();
          onEventClick(event);
        }}
        onKeyDown={(keyEvent) => {
          if (keyEvent.key === "Enter" || keyEvent.key === " ") {
            keyEvent.preventDefault();
            onEventClick(event);
          }
        }}
        onContextMenu={(mouseEvent) => onEventContextMenu?.(event, mouseEvent)}
      >
        <span className="font-medium">{event.title}</span>
      </div>
    </DraggableEvent>
  ),
);

MonthEventItem.displayName = "MonthEventItem";

export const MonthView = ({
  currentDate,
  events,
  readonly,
  onEventClick,
  onEventContextMenu,
  onDateClick,
}: Props) => {
  const days = useMemo(() => getMonthGrid(currentDate), [currentDate]);

  const weekDays = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(currentDate, { weekStartsOn: WEEK_STARTS_ON }),
        end: endOfWeek(currentDate, { weekStartsOn: WEEK_STARTS_ON }),
      }),
    [currentDate],
  );

  const eventsByDay = useMemo(() => {
    const map = new Map<string, TAppointmentCalendarEvent[]>();
    for (const event of events) {
      const key = format(event.start, "yyyy-MM-dd");
      const list = map.get(key);
      if (list) list.push(event);
      else map.set(key, [event]);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.start.getTime() - b.start.getTime());
    }
    return map;
  }, [events]);

  return (
    <div className="scrollbar-hide flex h-full min-w-200 flex-col overflow-hidden rounded-2xl bg-ink-950 shadow-sm ring-1 ring-ink-700/60 md:min-w-0">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl">
        <div className="h-full overflow-y-auto">
        <div className="sticky top-0 z-20 grid grid-cols-7 border-b border-ink-800 bg-ink-900">
          {weekDays.map((day, index) => (
            <div
              key={day.toISOString()}
              className={cn(
                "py-3 text-center text-xs font-semibold uppercase tracking-wider text-ink-400",
                index > 0 && "border-l border-ink-800",
              )}
            >
              {format(day, "EEE", { locale: es })}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7" style={{ gridAutoRows: "130px" }}>
          {days.map((day) => {
            const dayKey = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDay.get(dayKey) ?? [];
            const inMonth = isSameMonth(day, currentDate);

            return (
              <DroppableCell
                key={day.toISOString()}
                id={day.toISOString()}
                date={day}
                onClick={() => onDateClick(day)}
                className={cn(
                  "group relative flex h-32.5 cursor-pointer flex-col gap-1.5 overflow-hidden border-b border-r border-ink-800 p-2 text-left transition-all duration-200 nth-[7n]:border-r-0",
                  !inMonth && "bg-ink-900/40 text-ink-400",
                  isToday(day) && "bg-accent-50 ring-1 ring-inset ring-accent-200",
                )}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200",
                      isToday(day)
                        ? "bg-accent-500 text-white shadow-md shadow-accent-500/30"
                        : "group-hover:bg-accent-100",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="rounded-full bg-ink-800 px-1.5 py-0.5 text-[10px] font-medium text-ink-400">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                <div className="scrollbar-hide flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden">
                  {dayEvents.slice(0, 4).map((event) => (
                    <MonthEventItem
                      key={`${event.id}-${dayKey}`}
                      event={event}
                      readonly={readonly}
                      onEventClick={onEventClick}
                      onEventContextMenu={onEventContextMenu}
                    />
                  ))}
                  {dayEvents.length > 4 && (
                    <span className="rounded-md bg-accent-50 px-2 py-1 text-center text-[10px] font-semibold text-accent-600 transition-colors hover:bg-accent-100">
                      +{dayEvents.length - 4} más
                    </span>
                  )}
                </div>
              </DroppableCell>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
};
