"use client";

import type { MouseEvent } from "react";
import { differenceInMinutes, format, isSameDay, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { formatAxisHour, formatEventTime } from "../../utils/format-time";
import type { TAppointmentCalendarEvent, TCalendarResource } from "../../types";
import { CalendarEmptyState } from "./calendar-empty-state";
import { DraggableEvent, DroppableCell } from "./dnd";

type Props = {
  currentDate: Date;
  events: TAppointmentCalendarEvent[];
  resources: TCalendarResource[];
  readonly?: boolean;
  onEventClick: (event: TAppointmentCalendarEvent) => void;
  onEventContextMenu: (event: TAppointmentCalendarEvent, mouse: MouseEvent) => void;
  onTimeSlotClick: (date: Date, resourceId: string) => void;
  onCreateClick: () => void;
};

const HOURS = Array.from({ length: 24 }, (_, index) => index);
const QUARTERS = [0, 15, 30, 45];
const HOUR_WIDTH = 100;

const initials = (label: string) =>
  label
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export const ResourceView = ({
  currentDate,
  events,
  resources,
  readonly,
  onEventClick,
  onEventContextMenu,
  onTimeSlotClick,
  onCreateClick,
}: Props) => {
  if (resources.length === 0) {
    return (
      <div className="h-full overflow-hidden rounded-2xl bg-ink-950 shadow-sm ring-1 ring-ink-700/60">
        <CalendarEmptyState view="resource" onCreateClick={onCreateClick} />
      </div>
    );
  }

  const getEventStyle = (event: TAppointmentCalendarEvent) => {
    const dayStart = startOfDay(currentDate);
    const startMinutes = differenceInMinutes(event.start, dayStart);
    const durationMinutes = differenceInMinutes(event.end, event.start);

    return {
      left: `${(startMinutes / 60) * HOUR_WIDTH}px`,
      width: `${Math.max((durationMinutes / 60) * HOUR_WIDTH, 8)}px`,
    };
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-ink-950 shadow-sm ring-1 ring-ink-700/60">
      <div className="shrink-0 border-b border-ink-800 bg-ink-900/40 px-4 py-3 text-center">
        <h2 className="text-sm font-semibold capitalize text-ink-50">
          {format(currentDate, "EEEE d 'de' MMMM yyyy", { locale: es })}
        </h2>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="min-w-fit">
          <div className="sticky top-0 z-30 flex border-b border-ink-800 bg-ink-900/80 backdrop-blur-sm">
            <div className="sticky left-0 z-30 w-48 shrink-0 border-r border-ink-800 bg-ink-900 p-4 text-sm font-semibold text-ink-50">
              Profesionales
            </div>
            <div className="flex" style={{ width: HOURS.length * HOUR_WIDTH }}>
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="shrink-0 border-r border-ink-800 p-2 text-xs font-medium text-ink-400"
                  style={{ width: HOUR_WIDTH }}
                >
                  {formatAxisHour(hour)}
                </div>
              ))}
            </div>
          </div>

          {resources.map((resource) => {
            const resourceEvents = events.filter(
              (event) =>
                event.resourceId === resource.id && isSameDay(event.start, currentDate),
            );

            return (
              <div key={resource.id} className="flex min-h-[100px] border-b border-ink-800">
                <div className="sticky left-0 z-20 flex w-48 shrink-0 items-center gap-3 border-r border-ink-800 bg-ink-950 p-4">
                  <span className="flex size-8 items-center justify-center rounded-full bg-accent-100 text-xs font-bold text-accent-600">
                    {initials(resource.label)}
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-ink-50">
                      {resource.label}
                    </span>
                    <span className="text-xs text-ink-400">
                      {resourceEvents.length}{" "}
                      {resourceEvents.length === 1 ? "cita" : "citas"}
                    </span>
                  </div>
                </div>

                <div className="relative flex" style={{ width: HOURS.length * HOUR_WIDTH }}>
                  {HOURS.map((hour) => (
                    <div key={hour} className="flex h-full shrink-0" style={{ width: HOUR_WIDTH }}>
                      {QUARTERS.map((minute) => {
                        const slotDate = new Date(currentDate);
                        slotDate.setHours(hour, minute, 0, 0);

                        return (
                          <DroppableCell
                            key={minute}
                            id={`${resource.id}-${slotDate.toISOString()}`}
                            date={slotDate}
                            resourceId={resource.id}
                            className="h-full flex-1 border-r border-ink-800/40 transition-colors last:border-ink-800"
                            onClick={() => onTimeSlotClick(slotDate, resource.id)}
                          />
                        );
                      })}
                    </div>
                  ))}

                  {resourceEvents.map((event) => (
                    <DraggableEvent
                      key={event.id}
                      event={event}
                      disabled={readonly}
                      className="absolute bottom-2 top-2 z-10 overflow-hidden rounded-md border px-2 py-1 text-xs font-medium shadow-sm transition-all hover:brightness-95"
                      style={{
                        ...getEventStyle(event),
                        backgroundColor: event.color,
                        borderColor: "rgba(0,0,0,0.1)",
                        color: "#fff",
                      }}
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        title={`${event.title} · ${formatEventTime(event.start)}`}
                        className="size-full cursor-pointer truncate"
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
                        onContextMenu={(mouseEvent) => onEventContextMenu(event, mouseEvent)}
                      >
                        {event.patientName || event.title}
                      </div>
                    </DraggableEvent>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
