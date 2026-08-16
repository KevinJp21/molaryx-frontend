"use client";

import { useCallback, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { TAppointmentCalendarEvent } from "../../../types";

const RESIZE_HANDLE_PX = 16;

type Props = {
  event: TAppointmentCalendarEvent;
  hourHeight: number;
  minDuration?: number;
  onResize?: (event: TAppointmentCalendarEvent, newEnd: Date) => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  readonly?: boolean;
};

export const ResizableEvent = ({
  event,
  hourHeight,
  minDuration = 15,
  onResize,
  children,
  className,
  style,
  readonly,
}: Props) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHeight, setResizeHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  const currentHeightRef = useRef<number | null>(null);

  const handleResizeStart = useCallback(
    (pointerEvent: PointerEvent<HTMLDivElement>) => {
      pointerEvent.preventDefault();
      pointerEvent.stopPropagation();

      startYRef.current = pointerEvent.clientY;
      startHeightRef.current = containerRef.current?.offsetHeight ?? 0;
      currentHeightRef.current = null;
      setIsResizing(true);

      const handleMove = (moveEvent: globalThis.PointerEvent) => {
        moveEvent.preventDefault();
        const snapInterval = hourHeight / 4;
        const snappedDelta =
          Math.round((moveEvent.clientY - startYRef.current) / snapInterval) *
          snapInterval;

        const nextHeight = Math.max(
          (minDuration / 60) * hourHeight,
          startHeightRef.current + snappedDelta,
        );

        currentHeightRef.current = nextHeight;
        setResizeHeight(nextHeight);
      };

      const handleEnd = () => {
        setIsResizing(false);

        const finalHeight = currentHeightRef.current;
        if (finalHeight !== null && onResize) {
          const minutesDiff =
            ((finalHeight - startHeightRef.current) / hourHeight) * 60;
          const newEnd = new Date(event.end);
          newEnd.setMinutes(newEnd.getMinutes() + minutesDiff);
          if (newEnd > event.start) onResize(event, newEnd);
        }

        currentHeightRef.current = null;
        setResizeHeight(null);

        document.removeEventListener("pointermove", handleMove);
        document.removeEventListener("pointerup", handleEnd);
        document.removeEventListener("pointercancel", handleEnd);
      };

      document.addEventListener("pointermove", handleMove);
      document.addEventListener("pointerup", handleEnd);
      document.addEventListener("pointercancel", handleEnd);
    },
    [event, hourHeight, minDuration, onResize],
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{
        ...style,
        height: resizeHeight !== null ? `${resizeHeight}px` : style?.height,
      }}
    >
      {children}

      {!readonly && (
        <div
          role="separator"
          aria-orientation="horizontal"
          aria-label="Cambiar duración de la cita"
          className={cn(
            "absolute inset-x-0 bottom-0 z-20 flex cursor-ns-resize items-center justify-center touch-none",
            isResizing ? "bg-accent-500/10" : "hover:bg-accent-500/8",
          )}
          style={{ height: RESIZE_HANDLE_PX }}
          onPointerDown={handleResizeStart}
          onClick={(clickEvent) => clickEvent.stopPropagation()}
        >
          <span
            className={cn(
              "h-1 w-8 rounded-full transition-colors",
              isResizing ? "bg-accent-500" : "bg-ink-500/50 hover:bg-accent-500/70",
            )}
          />
        </div>
      )}

      {isResizing && (
        <div className="pointer-events-none absolute inset-0 rounded-md border-2 border-dashed border-accent-500 bg-accent-500/5" />
      )}
    </div>
  );
};
