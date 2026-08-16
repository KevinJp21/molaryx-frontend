"use client";

import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import type { TAppointmentCalendarEvent } from "../../../types";

export type TDragActivators = {
  listeners: ReturnType<typeof useDraggable>["listeners"];
  attributes: ReturnType<typeof useDraggable>["attributes"];
};

type Props = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  event: TAppointmentCalendarEvent;
  disabled?: boolean;
  children: ReactNode | ((activators: TDragActivators) => ReactNode);
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

  const bindToRoot = typeof children !== "function";
  const content =
    typeof children === "function" ? children({ listeners, attributes }) : children;

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
      {...(bindToRoot ? listeners : undefined)}
      {...(bindToRoot ? attributes : undefined)}
      {...props}
      className={cn("touch-none", className)}
    >
      {content}
    </div>
  );
};
