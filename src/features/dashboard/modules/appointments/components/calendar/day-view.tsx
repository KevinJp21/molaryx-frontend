"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { format, isSameDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
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
const HOUR_HEIGHT = 80;

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

export const DayView = ({
  currentDate,
  events,
  readonly,
  onEventClick,
  onEventContextMenu,
  onTimeSlotClick,
  onEventResize,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(() => new Date());
  const dayEvents = events.filter((event) => isSameDay(event.start, currentDate));

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = Math.max(
        0,
        (new Date().getHours() - 3) * HOUR_HEIGHT,
      );
    }
  }, []);

  const nowOffset = ((now.getHours() * 60 + now.getMinutes()) / 60) * HOUR_HEIGHT;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-ink-950 shadow-sm ring-1 ring-ink-700/60">
      <div className="shrink-0 border-b border-ink-800 bg-ink-900/40 px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-xl font-semibold capitalize text-ink-50">
            {format(currentDate, "EEEE d 'de' MMMM yyyy", { locale: es })}
          </h2>
          {isToday(currentDate) && (
            <span className="rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-white shadow-md shadow-accent-500/20">
              Hoy
            </span>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="scrollbar-hide relative flex-1 overflow-y-auto">
        <div className="relative flex" style={{ height: HOURS.length * HOUR_HEIGHT }}>
          <div className="relative w-20 shrink-0 border-r border-ink-800 bg-ink-900/40">
            {HOURS.map((hour) => (
              <div key={hour} className="relative w-full" style={{ height: HOUR_HEIGHT }}>
                {hour !== 0 && (
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-md bg-ink-950 px-1.5 text-[11px] font-medium tabular-nums text-ink-400">
                    {formatAxisHour(hour)}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="relative flex-1">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="relative box-border border-b border-dashed border-ink-800"
                style={{ height: HOUR_HEIGHT }}
              >
                {QUARTERS.map((minute) => {
                  const cellDate = new Date(currentDate);
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
                        aria-label={`Nueva cita a las ${formatEventTime(cellDate)}`}
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
                  compact={false}
                  onClick={onEventClick}
                  onContextMenu={onEventContextMenu}
                  onResize={onEventResize}
                />
              );
            })}

            {isToday(currentDate) && (
              <div
                className="pointer-events-none absolute left-0 right-0 z-20 flex items-center"
                style={{ top: `${nowOffset}px` }}
              >
                <span className="absolute -left-1.5 size-3 animate-pulse rounded-full bg-accent-500 shadow-lg shadow-accent-500/40 ring-2 ring-ink-950" />
                <span className="h-0.5 w-full bg-gradient-to-r from-accent-500 via-accent-500 to-accent-500/50" />
              </div>
            )}
          </div>
        </div>

        {isToday(currentDate) && (
          <div
            className="pointer-events-none absolute left-0 z-30 flex w-20 justify-center"
            style={{ top: `${nowOffset}px` }}
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
