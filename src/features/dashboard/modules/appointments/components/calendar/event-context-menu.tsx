"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { Copy, Edit3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TAppointmentCalendarEvent } from "../../types";

type Action = {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
};

type Props = {
  event: TAppointmentCalendarEvent | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onEdit: (event: TAppointmentCalendarEvent) => void;
  onDuplicate: (event: TAppointmentCalendarEvent) => void;
  onDelete: (event: TAppointmentCalendarEvent) => void;
};

const MENU_WIDTH = 200;
const ACTION_HEIGHT = 44;

export const EventContextMenu = ({
  event,
  position,
  onClose,
  onEdit,
  onDuplicate,
  onDelete,
}: Props) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!position) return;

    const handleKeyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [position, onClose]);

  useEffect(() => {
    if (!position) return;

    const handleClickOutside = (mouseEvent: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(mouseEvent.target as Node)) {
        onClose();
      }
    };

    // Se difiere para que el propio click derecho no cierre el menú al instante.
    const timeout = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [position, onClose]);

  if (!event || !position) return null;

  const actions: Action[] = [
    {
      id: "edit",
      label: "Editar",
      icon: <Edit3 className="size-4" />,
      onClick: () => {
        onEdit(event);
        onClose();
      },
    },
    {
      id: "duplicate",
      label: "Duplicar",
      icon: <Copy className="size-4" />,
      onClick: () => {
        onDuplicate(event);
        onClose();
      },
    },
    {
      id: "delete",
      label: "Eliminar",
      icon: <Trash2 className="size-4" />,
      variant: "danger",
      onClick: () => {
        onDelete(event);
        onClose();
      },
    },
  ];

  const adjusted = {
    x: Math.min(position.x, window.innerWidth - MENU_WIDTH),
    y: Math.min(position.y, window.innerHeight - (actions.length * ACTION_HEIGHT + 80)),
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] min-w-[180px] overflow-hidden rounded-xl border border-ink-750 bg-ink-950 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150"
      style={{ left: adjusted.x, top: adjusted.y }}
    >
      <div className="border-b border-ink-800 bg-ink-900/60 px-3 py-2">
        <div className="flex items-center gap-2">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: event.color }}
          />
          <span className="truncate text-sm font-medium text-ink-50">{event.title}</span>
        </div>
      </div>

      <div className="py-1">
        {actions.map((action, index) => (
          <Fragment key={action.id}>
            {index > 0 && action.variant === "danger" && (
              <div className="my-1 h-px bg-ink-800" />
            )}
            <button
              type="button"
              onClick={action.onClick}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors",
                action.variant === "danger"
                  ? "text-coral-600 hover:bg-coral-500/10"
                  : "text-ink-100 hover:bg-accent-50",
              )}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export const useEventContextMenu = () => {
  const [state, setState] = useState<{
    event: TAppointmentCalendarEvent | null;
    position: { x: number; y: number } | null;
  }>({ event: null, position: null });

  const openContextMenu = useCallback(
    (event: TAppointmentCalendarEvent, mouseEvent: ReactMouseEvent) => {
      mouseEvent.preventDefault();
      mouseEvent.stopPropagation();
      setState({ event, position: { x: mouseEvent.clientX, y: mouseEvent.clientY } });
    },
    [],
  );

  const closeContextMenu = useCallback(
    () => setState({ event: null, position: null }),
    [],
  );

  return {
    contextMenuEvent: state.event,
    contextMenuPosition: state.position,
    openContextMenu,
    closeContextMenu,
  };
};
