"use client";

import { useEffect, useId, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import {
  DndContext,
  DragOverlay,
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
import {
  addDays,
  addMonths,
  addWeeks,
  differenceInMinutes,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getAppointments,
  putUpdateAppointment,
  resetPutUpdateAppointment,
  selectGetAppointments,
} from "@/store/appointments/appointments-slice";
import { colombiaToUtcIso } from "@/utils";
import {
  getAppointmentsRange,
  mapAppointmentsToCalendars,
  mapAppointmentsToEvents,
  mapAppointmentsToResources,
} from "../utils";
import { formatEventTime } from "../utils/format-time";
import { APPOINTMENT_STATUS } from "../consts/appointment-status";
import { useViewSwipe } from "../hooks";
import type {
  TAppointmentCalendarEvent,
  TCalendarFilter,
  TCalendarView,
} from "../types";
import {
  AppointmentEventModal,
  type TAppointmentModalMode,
} from "./appointment-event-modal";
import {
  AgendaView,
  CalendarHeader,
  CalendarSidebar,
  CalendarViewSkeleton,
  DayView,
  EventContextMenu,
  MonthView,
  ResourceView,
  WeekView,
  useEventContextMenu,
} from "./calendar";

const SYNC_PENDING =
  "El cambio se aplicó solo en pantalla: la sincronización con el servidor estará disponible pronto.";

const GRID_SIZE = 15;

type Override = { start: Date; end: Date };

export const AppointmentsCalendar = () => {
  const dispatch = useAppDispatch();
  const dndId = useId();
  const { data, status } = useAppSelector(selectGetAppointments);

  const [view, setView] = useState<TCalendarView>("week");
  const [date, setDate] = useState(() => new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inactiveStatusIds, setInactiveStatusIds] = useState<Record<string, boolean>>({});
  const [activeResourceId, setActiveResourceId] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [activeDragEvent, setActiveDragEvent] =
    useState<TAppointmentCalendarEvent | null>(null);
  const [dragPreview, setDragPreview] = useState<Override | null>(null);

  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: TAppointmentModalMode;
    event: TAppointmentCalendarEvent | null;
    initialDate?: Date;
  }>({ open: false, mode: "view", event: null });

  const {
    contextMenuEvent,
    contextMenuPosition,
    openContextMenu,
    closeContextMenu,
  } = useEventContextMenu();

  useEffect(() => {
    dispatch(getAppointments(getAppointmentsRange(date, view)));
  }, [dispatch, date, view]);

  // Un refetch descarta los movimientos aplicados solo en pantalla.
  const [syncedData, setSyncedData] = useState(data);
  if (data !== syncedData) {
    setSyncedData(data);
    setOverrides({});
  }

  const events = useMemo(() => {
    const base = mapAppointmentsToEvents(data);
    if (Object.keys(overrides).length === 0) return base;
    return base.map((event) =>
      overrides[event.id] ? { ...event, ...overrides[event.id] } : event,
    );
  }, [data, overrides]);

  const resources = useMemo(() => mapAppointmentsToResources(data), [data]);

  const calendars: TCalendarFilter[] = useMemo(
    () =>
      mapAppointmentsToCalendars(data).map((calendar) => ({
        ...calendar,
        active: !inactiveStatusIds[calendar.id],
      })),
    [data, inactiveStatusIds],
  );

  const visibleEvents = useMemo(
    () =>
      events.filter((event) => {
        if (inactiveStatusIds[event.calendarId]) return false;
        if (activeResourceId && event.resourceId !== activeResourceId) return false;
        return true;
      }),
    [activeResourceId, events, inactiveStatusIds],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );
  const modifiers: Modifier[] = [createSnapModifier(GRID_SIZE), restrictToWindowEdges];

  const goPrev = () => {
    setDate((current) => {
      if (view === "month") return subMonths(current, 1);
      if (view === "week") return subWeeks(current, 1);
      if (view === "agenda") return subDays(current, 7);
      return subDays(current, 1);
    });
  };

  const goNext = () => {
    setDate((current) => {
      if (view === "month") return addMonths(current, 1);
      if (view === "week") return addWeeks(current, 1);
      if (view === "agenda") return addDays(current, 7);
      return addDays(current, 1);
    });
  };

  const swipeRef = useViewSwipe<HTMLDivElement>(goPrev, goNext);

  const openEvent = (event: TAppointmentCalendarEvent) =>
    setModalState({ open: true, mode: "view", event });

  const openCreate = (initialDate?: Date) =>
    setModalState({
      open: true,
      mode: "create",
      event: null,
      initialDate: initialDate ?? new Date(),
    });

  const closeModal = () => setModalState((current) => ({ ...current, open: false }));

  const applyOverride = (event: TAppointmentCalendarEvent, start: Date, end: Date) => {
    setOverrides((current) => ({ ...current, [event.id]: { start, end } }));
  };

  const clearOverride = (eventId: string) => {
    setOverrides((current) => {
      if (!(eventId in current)) return current;
      const next = { ...current };
      delete next[eventId];
      return next;
    });
  };

  const refreshAppointments = () => {
    dispatch(getAppointments(getAppointmentsRange(date, view)));
  };

  /** Optimistic UI + persistencia en API para drag/resize. */
  const syncAppointmentSchedule = async (
    event: TAppointmentCalendarEvent,
    start: Date,
    end: Date,
    successMessage: string,
  ) => {
    applyOverride(event, start, end);

    const result = await dispatch(
      putUpdateAppointment({
        idAppointment: Number(event.id),
        idAppointmentStatus: Number(event.calendarId),
        idPatient: event.idPatient,
        idUser: event.idUser,
        idService: event.idService,
        startAt: colombiaToUtcIso(start),
        endAt: colombiaToUtcIso(end),
        notes: event.description || undefined,
      }),
    );

    if (
      putUpdateAppointment.fulfilled.match(result) &&
      result.payload.success
    ) {
      toast.success(successMessage);
      dispatch(resetPutUpdateAppointment());
      refreshAppointments();
      return;
    }

    clearOverride(event.id);
    const message = putUpdateAppointment.fulfilled.match(result)
      ? result.payload.message
      : "No se pudo actualizar la cita";
    const description = putUpdateAppointment.fulfilled.match(result)
      ? result.payload.error
      : undefined;
    toast.error(message, { description });
    dispatch(resetPutUpdateAppointment());
  };

  /** "Eliminar" en UI: marca la cita como cancelada. */
  const cancelAppointment = async (event: TAppointmentCalendarEvent) => {
    const result = await dispatch(
      putUpdateAppointment({
        idAppointment: Number(event.id),
        idAppointmentStatus: APPOINTMENT_STATUS.CANCELLED,
        idPatient: event.idPatient,
        idUser: event.idUser,
        idService: event.idService,
        startAt: colombiaToUtcIso(event.start),
        endAt: colombiaToUtcIso(event.end),
        notes: event.description || undefined,
      }),
    );

    if (
      putUpdateAppointment.fulfilled.match(result) &&
      result.payload.success
    ) {
      toast.success(result.payload.message || "Cita cancelada");
      dispatch(resetPutUpdateAppointment());
      refreshAppointments();
      return true;
    }

    const message = putUpdateAppointment.fulfilled.match(result)
      ? result.payload.message
      : "No se pudo cancelar la cita";
    const description = putUpdateAppointment.fulfilled.match(result)
      ? result.payload.error
      : undefined;
    toast.error(message, { description });
    dispatch(resetPutUpdateAppointment());
    return false;
  };

  // Horario en el que quedaría la cita si se soltara sobre esa celda.
  const getDropRange = (
    draggedEvent: TAppointmentCalendarEvent,
    overDate: Date,
  ): Override => {
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

  const handleEventResize = (event: TAppointmentCalendarEvent, newEnd: Date) => {
    if (differenceInMinutes(newEnd, event.start) < 15) return;
    void syncAppointmentSchedule(
      event,
      event.start,
      newEnd,
      "Duración actualizada",
    );
  };

  const handleEventContextMenu = (
    event: TAppointmentCalendarEvent,
    mouseEvent: MouseEvent,
  ) => openContextMenu(event, mouseEvent);

  const isLoading = status === "loading" || status === "idle";

  const renderView = () => {
    if (view === "month") {
      return (
        <MonthView
          currentDate={date}
          events={visibleEvents}
          onEventClick={openEvent}
          onEventContextMenu={handleEventContextMenu}
          onDateClick={(nextDate) => {
            setDate(nextDate);
            setView("day");
          }}
        />
      );
    }

    if (view === "week") {
      return (
        <WeekView
          currentDate={date}
          events={visibleEvents}
          onEventClick={openEvent}
          onEventContextMenu={handleEventContextMenu}
          onTimeSlotClick={openCreate}
          onEventResize={handleEventResize}
          onEventResizePreview={handleEventResizePreview}
        />
      );
    }

    if (view === "day") {
      return (
        <DayView
          currentDate={date}
          events={visibleEvents}
          onEventClick={openEvent}
          onEventContextMenu={handleEventContextMenu}
          onTimeSlotClick={openCreate}
          onEventResize={handleEventResize}
          onEventResizePreview={handleEventResizePreview}
        />
      );
    }

    if (view === "agenda") {
      return (
        <AgendaView
          currentDate={date}
          events={visibleEvents}
          onEventClick={openEvent}
          onEventContextMenu={handleEventContextMenu}
          onCreateClick={() => openCreate()}
        />
      );
    }

    return (
      <ResourceView
        currentDate={date}
        events={visibleEvents}
        resources={
          activeResourceId
            ? resources.filter((resource) => resource.id === activeResourceId)
            : resources
        }
        onEventClick={openEvent}
        onEventContextMenu={handleEventContextMenu}
        onTimeSlotClick={(slotDate) => openCreate(slotDate)}
        onCreateClick={() => openCreate()}
      />
    );
  };

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      modifiers={modifiers}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full min-h-160 flex-col overflow-hidden rounded-2xl bg-ink-950 shadow-[0_1px_0_rgba(14,14,23,0.04),0_24px_48px_-28px_rgba(124,77,255,0.45)] ring-1 ring-ink-700/70">
        <CalendarHeader
          currentDate={date}
          view={view}
          onPrev={goPrev}
          onNext={goNext}
          onToday={() => setDate(new Date())}
          onViewChange={setView}
          onMenuClick={() => setIsSidebarOpen((open) => !open)}
        />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <CalendarSidebar
            isOpen={isSidebarOpen}
            currentDate={date}
            calendars={calendars}
            resources={resources}
            activeResourceId={activeResourceId}
            onDateChange={setDate}
            onViewChange={setView}
            onCalendarToggle={(id, active) =>
              setInactiveStatusIds((current) => ({ ...current, [id]: !active }))
            }
            onResourceChange={setActiveResourceId}
            onCreateClick={() => openCreate()}
          />

          <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
            <div
              ref={swipeRef}
              className="min-h-0 flex-1 touch-pan-y overflow-auto p-0 md:p-3"
            >
              <div className="h-full min-w-full">
                {isLoading ? (
                  <CalendarViewSkeleton view={view} />
                ) : (
                  <div
                    key={`${view}-${date.toDateString()}`}
                    className="h-full animate-in fade-in-0 zoom-in-[0.99] duration-200"
                  >
                    {renderView()}
                  </div>
                )}
              </div>
            </div>

            <Button
              type="button"
              onClick={() => openCreate()}
              aria-label="Nueva cita"
              className="absolute right-6 bottom-6 z-40 size-14 rounded-full shadow-lg shadow-accent-500/30 md:hidden"
            >
              <Plus className="size-6" />
            </Button>
          </div>
        </div>
      </div>

      <AppointmentEventModal
        open={modalState.open}
        mode={modalState.mode}
        event={modalState.event}
        initialDate={modalState.initialDate}
        onModeChange={(mode) => setModalState((current) => ({ ...current, mode }))}
        onClose={closeModal}
        onSuccess={() => {
          closeModal();
          refreshAppointments();
        }}
        onDelete={async (event) => {
          const cancelled = await cancelAppointment(event);
          if (cancelled) closeModal();
        }}
      />

      <EventContextMenu
        event={contextMenuEvent}
        position={contextMenuPosition}
        onClose={closeContextMenu}
        onEdit={(event) => setModalState({ open: true, mode: "edit", event })}
        onDuplicate={() => toast.info(SYNC_PENDING)}
        onDelete={(event) => {
          void cancelAppointment(event);
        }}
      />

      <DragOverlay dropAnimation={null}>
        {activeDragEvent && (
          <div
            className="overflow-hidden rounded-lg border-2 shadow-2xl backdrop-blur-sm"
            style={{
              backgroundColor: `${activeDragEvent.color}e0`,
              borderColor: `${activeDragEvent.color}80`,
              color: "#fff",
              width: view === "month" ? "100%" : "150px",
              height:
                view === "month"
                  ? undefined
                  : `${(differenceInMinutes(activeDragEvent.end, activeDragEvent.start) / 60) * (view === "day" ? 80 : 60)}px`,
              boxShadow: `0 20px 40px -15px ${activeDragEvent.color}66, 0 10px 20px -10px rgba(0,0,0,0.2)`,
              transform: "rotate(-2deg) scale(1.02)",
            }}
          >
            <div className="flex h-full flex-col p-2.5">
              <p className="truncate text-sm font-semibold">{activeDragEvent.title}</p>
              {view !== "month" && (
                <p className="mt-0.5 text-xs font-semibold tabular-nums">
                  {formatEventTime(dragPreview?.start ?? activeDragEvent.start)} -{" "}
                  {formatEventTime(dragPreview?.end ?? activeDragEvent.end)}
                </p>
              )}
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
