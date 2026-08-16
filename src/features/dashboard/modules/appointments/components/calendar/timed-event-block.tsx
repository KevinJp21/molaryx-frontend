"use client";

import type { MouseEvent } from "react";
import { differenceInMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import { formatEventTime } from "../../utils/format-time";
import type { TAppointmentCalendarEvent } from "../../types";
import { DraggableEvent, ResizableEvent } from "./dnd";

type Props = {
  event: TAppointmentCalendarEvent;
  hourHeight: number;
  overlappingCount: number;
  index: number;
  readonly?: boolean;
  compact?: boolean;
  onClick: (event: TAppointmentCalendarEvent) => void;
  onContextMenu: (event: TAppointmentCalendarEvent, mouse: MouseEvent) => void;
  onResize?: (event: TAppointmentCalendarEvent, newEnd: Date) => void;
  onResizePreview?: (event: TAppointmentCalendarEvent, newEnd: Date) => void;
};

export const TimedEventBlock = ({
  event,
  hourHeight,
  overlappingCount,
  index,
  readonly,
  compact = true,
  onClick,
  onContextMenu,
  onResize,
  onResizePreview,
}: Props) => {
  const durationMinutes = Math.max(15, differenceInMinutes(event.end, event.start));
  const startMinutes = event.start.getHours() * 60 + event.start.getMinutes();
  const top = (startMinutes / 60) * hourHeight;
  const height = (durationMinutes / 60) * hourHeight;
  const isShort = durationMinutes < (compact ? 60 : 45);
  const widthPercent = 100 / overlappingCount;
  const leftPercent = index * widthPercent;

  return (
    <DraggableEvent
      event={event}
      disabled={readonly}
      className={cn("absolute z-10 transition-shadow", readonly && "cursor-default")}
      style={
        compact
          ? {
              top: `${top}px`,
              height: `${Math.max(height, 20)}px`,
              left: `${leftPercent}%`,
              width: `${widthPercent}%`,
              paddingRight: overlappingCount > 1 ? "2px" : "0",
            }
          : {
              top: `${top}px`,
              height: `${Math.max(height, 28)}px`,
              left: `calc(${leftPercent}% + 4px)`,
              width: `calc(${widthPercent}% - 8px)`,
              paddingRight: overlappingCount > 1 ? "2px" : "0",
            }
      }
    >
      {({ listeners, attributes }) => (
      <ResizableEvent
        event={event}
        hourHeight={hourHeight}
        onResize={onResize}
        onResizePreview={onResizePreview}
        readonly={readonly}
        className="h-full"
        style={{ height: "100%" }}
      >
        <div
          title={
            overlappingCount > 1
              ? `${event.title} (${index + 1}/${overlappingCount})`
              : event.title
          }
          {...listeners}
          {...attributes}
          onClick={(clickEvent) => {
            clickEvent.stopPropagation();
            onClick(event);
          }}
          onKeyDown={(keyEvent) => {
            if (keyEvent.key === "Enter" || keyEvent.key === " ") {
              keyEvent.preventDefault();
              onClick(event);
            }
          }}
          onContextMenu={(mouseEvent) => onContextMenu(event, mouseEvent)}
          className={cn(
            "group relative h-full overflow-hidden rounded-md border shadow-sm transition-all hover:z-20 hover:shadow-md",
            isShort
              ? compact
                ? "flex items-center justify-center px-1"
                : "flex items-center px-2"
              : compact
                ? "p-2"
                : "px-3 py-2",
            !readonly && "pb-4",
          )}
          style={{
            backgroundColor: `${event.color}15`,
            borderColor: `${event.color}40`,
            borderLeftWidth: overlappingCount > 1 ? 4 : 3,
            borderLeftColor: event.color,
          }}
        >
          <div className="flex h-full w-full flex-col overflow-hidden">
            <p
              className={cn(
                "truncate font-semibold leading-tight text-ink-50",
                isShort && compact ? "text-center text-xs" : compact ? "text-xs" : "text-sm",
              )}
            >
              {event.title}
            </p>
            {!isShort && (
              <>
                <p
                  className={cn(
                    "mt-0.5 truncate font-medium leading-tight text-ink-400",
                    compact ? "text-[10px]" : "text-xs",
                  )}
                >
                  {formatEventTime(event.start)} - {formatEventTime(event.end)}
                </p>
                {event.description && height > (compact ? 50 : 60) && (
                  <p
                    className={cn(
                      "mt-1 truncate leading-tight text-ink-400/80",
                      compact ? "text-[10px]" : "text-xs",
                    )}
                  >
                    {event.description}
                  </p>
                )}
              </>
            )}
            {overlappingCount > 1 && !isShort && (
              <span
                className={cn(
                  "absolute right-1 top-1 flex items-center justify-center rounded-full border border-ink-700 bg-ink-950/80 font-bold text-ink-400 shadow-sm",
                  compact ? "size-4 text-[9px]" : "size-5 text-[10px]",
                )}
              >
                {overlappingCount}
              </span>
            )}
          </div>
        </div>
      </ResizableEvent>
      )}
    </DraggableEvent>
  );
};
