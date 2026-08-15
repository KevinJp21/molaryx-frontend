"use client";

import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import type { TAppointmentCalendarEvent } from "../../../types";

type Props = HTMLAttributes<HTMLDivElement> & {
  event: TAppointmentCalendarEvent;
  disabled?: boolean;
  children: ReactNode;
};

export const DraggableEvent = ({
  event,
  disabled,
  children,
  className,
  style: propStyle,
  ...props
}: Props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: event.id, data: { event }, disabled });

  const style: CSSProperties = {
    ...propStyle,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 100 : propStyle?.zIndex,
    opacity: isDragging ? 0 : propStyle?.opacity,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      {...props}
      className={cn("touch-none", className)}
    >
      {children}
    </div>
  );
};
