"use client";

import { useState } from "react";
import {
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  Modifier,
} from "@dnd-kit/core";
import { createSnapModifier, restrictToWindowEdges } from "@dnd-kit/modifiers";
import { differenceInMinutes } from "date-fns";
import { formatEventTime } from "../utils/format-time";
import type {
  TAppointmentCalendarEvent,
  TCalendarView,
  TScheduleOverride,
} from "../types";

const GRID_SIZE = 15;

type Params = {
  view: TCalendarView;
  events: TAppointmentCalendarEvent[];
  applyOverride: (
    event: TAppointmentCalendarEvent,
    start: Date,
    end: Date,
  ) => void;
  syncAppointmentSchedule: (
    event: TAppointmentCalendarEvent,
    start: Date,
    end: Date,
    successMessage: string,
  ) => Promise<void>;
};

export const useCalendarDnd = ({
  view,
  events,
  applyOverride,
  syncAppointmentSchedule,
}: Params) => {
  const [activeDragEvent, setActiveDragEvent] =
    useState<TAppointmentCalendarEvent | null>(null);
  const [dragPreview, setDragPreview] = useState<TScheduleOverride | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );
  const modifiers: Modifier[] = [
    createSnapModifier(GRID_SIZE),
    restrictToWindowEdges,
  ];

  const getDropRange = (
    draggedEvent: TAppointmentCalendarEvent,
    overDate: Date,
  ): TScheduleOverride => {
    const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
    const start = new Date(overDate);

    if (view === "month") {
      start.setHours(
        draggedEvent.start.getHours(),
        draggedEvent.start.getMinutes(),
        0,
        0,
      );
    } else {
      start.setSeconds(0, 0);
    }

    return { start, end: new Date(start.getTime() + duration) };
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    const dragged = events.find((event) => event.id === active.id);
    if (!dragged) return;
    setActiveDragEvent(dragged);
    setDragPreview({ start: dragged.start, end: dragged.end });
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const draggedEvent = active.data.current?.event as
      | TAppointmentCalendarEvent
      | undefined;
    const overDate = over?.data.current?.date as Date | undefined;
    if (!draggedEvent || !overDate) return;

    const range = getDropRange(draggedEvent, overDate);
    setDragPreview((current) =>
      current && current.start.getTime() === range.start.getTime()
        ? current
        : range,
    );
  };

  const handleDragCancel = () => {
    setActiveDragEvent(null);
    setDragPreview(null);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveDragEvent(null);
    setDragPreview(null);
    if (!over) return;

    const draggedEvent = active.data.current?.event as
      | TAppointmentCalendarEvent
      | undefined;
    const overDate = over.data.current?.date as Date | undefined;
    if (!draggedEvent || !overDate) return;

    const { start, end } = getDropRange(draggedEvent, overDate);
    if (start.getTime() === draggedEvent.start.getTime()) return;

    void syncAppointmentSchedule(
      draggedEvent,
      start,
      end,
      `Cita movida a ${formatEventTime(start)}`,
    );
  };

  const handleEventResizePreview = (
    event: TAppointmentCalendarEvent,
    newEnd: Date,
  ) => {
    if (differenceInMinutes(newEnd, event.start) < 15) return;
    applyOverride(event, event.start, newEnd);
  };

  const handleEventResize = (
    event: TAppointmentCalendarEvent,
    newEnd: Date,
  ) => {
    if (differenceInMinutes(newEnd, event.start) < 15) return;
    void syncAppointmentSchedule(
      event,
      event.start,
      newEnd,
      "Duración actualizada",
    );
  };

  return {
    sensors,
    modifiers,
    activeDragEvent,
    dragPreview,
    handleDragStart,
    handleDragOver,
    handleDragCancel,
    handleDragEnd,
    handleEventResizePreview,
    handleEventResize,
  };
};
