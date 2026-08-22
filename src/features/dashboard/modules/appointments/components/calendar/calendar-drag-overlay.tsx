"use client";

import { differenceInMinutes } from "date-fns";
import { formatEventTime } from "../../utils/format-time";
import type {
  TAppointmentCalendarEvent,
  TCalendarView,
  TScheduleOverride,
} from "../../types";

type Props = {
  event: TAppointmentCalendarEvent;
  view: TCalendarView;
  preview: TScheduleOverride | null;
};

export const CalendarDragOverlayCard = ({ event, view, preview }: Props) => (
  <div
    className="overflow-hidden rounded-lg border-2 shadow-2xl backdrop-blur-sm"
    style={{
      backgroundColor: `${event.color}e0`,
      borderColor: `${event.color}80`,
      color: "#fff",
      width: view === "month" ? "100%" : "150px",
      height:
        view === "month"
          ? undefined
          : `${(differenceInMinutes(event.end, event.start) / 60) * (view === "day" ? 80 : 60)}px`,
      boxShadow: `0 20px 40px -15px ${event.color}66, 0 10px 20px -10px rgba(0,0,0,0.2)`,
      transform: "rotate(-2deg) scale(1.02)",
    }}
  >
    <div className="flex h-full flex-col p-2.5">
      <p className="truncate text-sm font-semibold">{event.title}</p>
      {view !== "month" && (
        <p className="mt-0.5 text-xs font-semibold tabular-nums">
          {formatEventTime(preview?.start ?? event.start)} -{" "}
          {formatEventTime(preview?.end ?? event.end)}
        </p>
      )}
    </div>
  </div>
);
