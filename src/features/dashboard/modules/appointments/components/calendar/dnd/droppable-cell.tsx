"use client";

import type { CSSProperties, ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  date: Date;
  resourceId?: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

export const DroppableCell = ({
  id,
  date,
  resourceId,
  children,
  className,
  style,
  onClick,
}: Props) => {
  const { isOver, setNodeRef } = useDroppable({ id, data: { date, resourceId } });

  // Cada cuarto de hora se tiñe un poco más fuerte para dar sensación de rejilla.
  const minutes = date.getMinutes();
  const hoverClass =
    minutes === 0
      ? "hover:bg-accent-50/60"
      : minutes === 15
        ? "hover:bg-accent-50"
        : minutes === 30
          ? "hover:bg-accent-100/60"
          : "hover:bg-accent-100";

  const overClass =
    minutes === 0
      ? "bg-accent-50/60"
      : minutes === 15
        ? "bg-accent-50"
        : minutes === 30
          ? "bg-accent-100/60"
          : "bg-accent-100";

  return (
    <div
      ref={setNodeRef}
      className={cn(
        className,
        hoverClass,
        isOver && `${overClass} ring-2 ring-inset ring-accent-500`,
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
