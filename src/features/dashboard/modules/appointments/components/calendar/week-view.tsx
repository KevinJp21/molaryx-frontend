"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { eachDayOfInterval, endOfWeek, format, isSameDay, isToday, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { WEEK_STARTS_ON } from "../../utils/get-month-grid";
import { formatAxisHour, formatEventTime } from "../../utils/format-time";
import type { TAppointmentCalendarEvent } from "../../types";
import { TimedEventBlock } from "./timed-event-block";
import { DroppableCell } from "./dnd";

type Props = {
  currentDate: Date;
  events: TAppointmentCalendarEvent[];
  readonly?: boolean;
  onEventClick: (event: TAppointmentCalendarEvent) => void;
  onEventContextMenu: (event: TAppointmentCalendarEvent, mouse: MouseEvent) => void;
  onTimeSlotClick: (date: Date) => void;
  onEventResize?: (event: TAppointmentCalendarEvent, newEnd: Date) => void;
};

const HOURS = Array.from({ length: 24 }, (_, index) => index);
const QUARTERS = [0, 15, 30, 45];
const HOUR_HEIGHT = 60;
const HEADER_HEIGHT = 80;

const overlappingGroup = (
  event: TAppointmentCalendarEvent,
  dayEvents: TAppointmentCalendarEvent[],
) =>
  dayEvents
    .filter(
      (candidate) =>
        candidate.start.getTime() < event.end.getTime() &&
        candidate.end.getTime() > event.start.getTime(),
    )
    .sort(
      (a, b) => a.start.getTime() - b.start.getTime() || a.id.localeCompare(b.id),
    );

export const WeekView = ({
  currentDate,
  events,
  readonly,
  onEventClick,
  onEventContextMenu,
  onTimeSlotClick,
  onEventResize,
}: Props) => {
  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate, { weekStartsOn: WEEK_STARTS_ON }),
    end: endOfWeek(currentDate, { weekStartsOn: WEEK_STARTS_ON }),
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = Math.max(
        0,
        (new Date().getHours() - 4) * HOUR_HEIGHT,
      );
    }
  }, []);

  const nowOffset = ((now.getHours() * 60 + now.getMinutes()) / 60) * HOUR_HEIGHT;
  const showNowBadge = weekDays.some((day) => isToday(day));

  return (
    <div className="flex h-full min-w-200 flex-col overflow-hidden rounded-2xl bg-ink-950 shadow-sm ring-1 ring-ink-700/60 md:min-w-0">
      <div
        ref={scrollRef}
        className="scrollbar-hide relative min-h-0 flex-1 scroll-smooth overflow-y-auto overflow-x-hidden rounded-2xl"
        style={{ scrollbarGutter: "stable" }}
      >
        <div className="sticky top-0 z-20 flex border-b border-ink-800 bg-ink-900">
          <div className="flex w-16 shrink-0 items-center justify-center border-r border-ink-800 bg-ink-900/60 px-1 py-3 text-center font-semibold text-ink-400">
            <span className="flex flex-col items-center leading-tight">
              <span className="text-[11px]">{formatEventTime(now)}</span>
              <span className="text-[9px] opacity-75">(local)</span>
            </span>
          </div>
          <div className="grid flex-1 grid-cols-7">
            {weekDays.map((day, index) => (
              <div
                key={day.toISOString()}
                className={cn("px-2 py-3 text-center", index > 0 && "border-l border-ink-800")}
              >
                <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                  {format(day, "EEE", { locale: es })}
                </div>
                <div
                  className={cn(
                    "mx-auto flex size-9 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200",
                    isToday(day)
                      ? "scale-110 bg-accent-500 text-white shadow-lg shadow-accent-500/30"
                      : "text-ink-50 hover:bg-accent-50",
                  )}
                >
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex min-w-full" style={{ height: HOURS.length * HOUR_HEIGHT }}>
          <div className="relative w-16 shrink-0 border-r border-ink-800 bg-ink-900/40">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="relative box-border w-full pr-3 text-right text-[11px] font-medium tabular-nums text-ink-400"
                style={{ height: HOUR_HEIGHT }}
              >
                <span className="block -translate-y-1/2">
                  {hour !== 0 && formatAxisHour(hour)}
                </span>
              </div>
            ))}
          </div>

          <div className="relative grid flex-1 grid-cols-7">
            {weekDays.map((day, dayIndex) => {
              const dayEvents = events.filter((event) => isSameDay(event.start, day));

              return (
                <div
                  key={day.toISOString()}
                  className={cn("relative h-full", dayIndex > 0 && "border-l border-ink-800")}
                >
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="relative box-border w-full border-b border-dashed border-ink-800"
                      style={{ height: HOUR_HEIGHT }}
                    >
                      {QUARTERS.map((minute) => {
                        const cellDate = new Date(day);
                        cellDate.setHours(hour, minute, 0, 0);

                        return (
                          <DroppableCell
                            key={minute}
                            id={cellDate.toISOString()}
                            date={cellDate}
                            className="absolute left-0 right-0 z-0 w-full transition-colors"
                            style={{ height: "25%", top: `${(minute / 60) * 100}%` }}
                          >
                            <div
                              role="button"
                              tabIndex={-1}
                              aria-label={`Nueva cita el ${format(cellDate, "d 'de' MMMM", { locale: es })} a las ${formatEventTime(cellDate)}`}
                              className="size-full cursor-pointer bg-transparent"
                              onClick={() => onTimeSlotClick(cellDate)}
                            />
                          </DroppableCell>
                        );
                      })}
                    </div>
                  ))}

                  {dayEvents.map((event) => {
                    const group = overlappingGroup(event, dayEvents);
                    const index = group.findIndex((item) => item.id === event.id);

                    return (
                      <TimedEventBlock
                        key={event.id}
                        event={event}
                        hourHeight={HOUR_HEIGHT}
                        overlappingCount={group.length}
                        index={Math.max(0, index)}
                        readonly={readonly}
                        onClick={onEventClick}
                        onContextMenu={onEventContextMenu}
                        onResize={onEventResize}
                      />
                    );
                  })}

                  {isToday(day) && (
                    <div
                      className="pointer-events-none absolute left-0 right-0 z-20 flex items-center"
                      style={{ top: `${nowOffset}px` }}
                    >
                      <span className="absolute -left-1.5 size-3 animate-pulse rounded-full bg-accent-500 shadow-lg shadow-accent-500/40 ring-2 ring-ink-950" />
                      <span className="h-0.5 w-full bg-linear-to-r from-accent-500 via-accent-500 to-accent-500/50" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {showNowBadge && (
          <div
            className="pointer-events-none absolute left-0 z-30 flex w-16 justify-end pr-2"
            style={{ top: `${nowOffset + HEADER_HEIGHT}px` }}
          >
            <span className="-translate-y-1/2 rounded-md bg-accent-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-md">
              {formatEventTime(now)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
