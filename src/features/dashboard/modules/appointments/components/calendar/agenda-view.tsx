"use client";

import { useMemo } from "react";
import type { MouseEvent } from "react";
import {
  addDays,
  format,
  isSameDay,
  isToday,
  isTomorrow,
  startOfDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronRight, Clock, Stethoscope, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration, formatEventTime } from "../../utils/format-time";
import { AGENDA_RANGE_DAYS } from "../../utils/get-appointments-range";
import type { TAppointmentCalendarEvent } from "../../types";
import { CalendarEmptyState } from "./calendar-empty-state";

type Props = {
  currentDate: Date;
  events: TAppointmentCalendarEvent[];
  onEventClick: (event: TAppointmentCalendarEvent) => void;
  onEventContextMenu?: (event: TAppointmentCalendarEvent, mouse: MouseEvent) => void;
  onCreateClick?: () => void;
};

const getDateLabel = (date: Date) => {
  if (isToday(date)) return "Hoy";
  if (isTomorrow(date)) return "Mañana";
  return format(date, "EEEE", { locale: es });
};

export const AgendaView = ({
  currentDate,
  events,
  onEventClick,
  onEventContextMenu,
  onCreateClick,
}: Props) => {
  const groupedEvents = useMemo(() => {
    const startDate = startOfDay(currentDate);
    const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
    const groups: { date: Date; events: TAppointmentCalendarEvent[] }[] = [];

    for (let index = 0; index < AGENDA_RANGE_DAYS; index += 1) {
      const day = addDays(startDate, index);
      const dayEvents = sorted.filter((event) => isSameDay(event.start, day));
      if (dayEvents.length > 0) groups.push({ date: day, events: dayEvents });
    }

    return groups;
  }, [currentDate, events]);

  return (
    <div className="flex h-full flex-col overflow-y-auto rounded-2xl bg-ink-950 shadow-sm ring-1 ring-ink-700/60">
      {groupedEvents.length === 0 ? (
        <CalendarEmptyState view="agenda" onCreateClick={onCreateClick} />
      ) : (
        <div className="mx-auto w-full max-w-3xl px-4 pb-10 md:px-6">
          {groupedEvents.map((group) => (
            <div key={group.date.toISOString()} className="relative">
              <div className="sticky top-0 z-10 border-b border-ink-800 bg-ink-950/95 py-4 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex size-16 flex-col items-center justify-center rounded-2xl transition-all",
                      isToday(group.date)
                        ? "bg-accent-500 text-white shadow-lg shadow-accent-500/30"
                        : "bg-ink-900 text-ink-50",
                    )}
                  >
                    <span className="text-2xl font-bold leading-none">
                      {format(group.date, "d")}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wide opacity-80">
                      {format(group.date, "MMM", { locale: es })}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={cn(
                        "text-lg font-semibold capitalize",
                        isToday(group.date) ? "text-accent-600" : "text-ink-50",
                      )}
                    >
                      {getDateLabel(group.date)}
                    </span>
                    <span className="text-sm text-ink-400">
                      {group.events.length}{" "}
                      {group.events.length === 1 ? "cita" : "citas"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 py-4">
                {group.events.map((event) => (
                  <div
                    key={event.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onEventClick(event)}
                    onKeyDown={(keyEvent) => {
                      if (keyEvent.key === "Enter" || keyEvent.key === " ") {
                        keyEvent.preventDefault();
                        onEventClick(event);
                      }
                    }}
                    onContextMenu={(mouseEvent) => onEventContextMenu?.(event, mouseEvent)}
                    className="group relative flex cursor-pointer gap-4 rounded-2xl border border-ink-800 bg-ink-950 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-lg hover:shadow-accent-500/5"
                  >
                    <span
                      className="absolute bottom-3 left-0 top-3 w-1 rounded-full"
                      style={{ backgroundColor: event.color }}
                    />

                    <div className="flex min-w-19 flex-col items-center pl-2">
                      <span className="text-base font-semibold text-ink-50">
                        {format(event.start, "h:mm")}
                      </span>
                      <span className="text-xs uppercase text-ink-400">
                        {format(event.start, "a", { locale: es }).replace(/\./g, "")}
                      </span>
                      <span className="my-1 h-3 w-px bg-ink-700" />
                      <span className="text-xs font-medium text-ink-400/80">
                        {formatDuration(event.start, event.end)}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="line-clamp-1 text-base font-semibold text-ink-50 transition-colors group-hover:text-accent-600">
                          {event.patientName || event.title}
                        </h4>
                        <span
                          className="mt-1.5 size-3 shrink-0 rounded-full"
                          style={{ backgroundColor: event.color }}
                        />
                      </div>

                      {event.description && (
                        <p className="line-clamp-2 text-sm leading-relaxed text-ink-400">
                          {event.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <span className="flex items-center gap-1.5 text-xs text-ink-400">
                          <Clock className="size-3.5" />
                          {formatEventTime(event.start)} - {formatEventTime(event.end)}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-ink-400">
                          <Stethoscope className="size-3.5" />
                          {event.procedureNames}
                        </span>
                        {event.professionalName && (
                          <span className="flex items-center gap-1.5 text-xs text-ink-400">
                            <User className="size-3.5" />
                            {event.professionalName}
                          </span>
                        )}
                        <span
                          className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                          style={{
                            backgroundColor: `${event.color}1f`,
                            color: event.color,
                          }}
                        >
                          {event.statusLabel}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-ink-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
