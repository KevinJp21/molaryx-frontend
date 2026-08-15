"use client";

import { useCallback, useRef, useState } from "react";
import type { CSSProperties, ReactNode, TouchEvent, MouseEvent } from "react";
import { cn } from "@/lib/utils";
import type { TAppointmentCalendarEvent } from "../../../types";

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
    (pointerEvent: MouseEvent | TouchEvent) => {
      pointerEvent.preventDefault();
      pointerEvent.stopPropagation();

      const clientY =
        "touches" in pointerEvent
          ? pointerEvent.touches[0].clientY
          : pointerEvent.clientY;

      startYRef.current = clientY;
      startHeightRef.current = containerRef.current?.offsetHeight ?? 0;
      currentHeightRef.current = null;
      setIsResizing(true);

      const handleMove = (moveEvent: globalThis.MouseEvent | globalThis.TouchEvent) => {
        const moveClientY =
          "touches" in moveEvent
            ? moveEvent.touches[0].clientY
            : moveEvent.clientY;

        const snapInterval = hourHeight / 4;
        const snappedDelta =
          Math.round((moveClientY - startYRef.current) / snapInterval) *
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

        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("touchend", handleEnd);
    },
    [event, hourHeight, minDuration, onResize],
  );

  return (
    <div
      ref={containerRef}
      className={cn("group relative", className)}
      style={{
        ...style,
        height: resizeHeight !== null ? `${resizeHeight}px` : style?.height,
      }}
    >
      {children}

      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 z-20 flex h-3 items-center justify-center opacity-0 transition-opacity",
          readonly ? "cursor-default" : "cursor-ns-resize group-hover:opacity-100",
          isResizing && "opacity-100",
        )}
        onMouseDown={readonly ? undefined : handleResizeStart}
        onTouchStart={readonly ? undefined : handleResizeStart}
      >
        <span
          className={cn(
            "h-1 w-8 rounded-full transition-all",
            isResizing ? "bg-accent-500" : "bg-ink-500/40 group-hover:bg-accent-500/60",
          )}
        />
      </div>

      {isResizing && (
        <div className="pointer-events-none absolute inset-0 rounded-md border-2 border-dashed border-accent-500 bg-accent-500/5" />
      )}
    </div>
  );
};
