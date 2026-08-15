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
import type { DragEndEvent, DragStartEvent, Modifier } from "@dnd-kit/core";
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
  selectGetAppointments,
} from "@/store/appointments/appointments-slice";
import {
  getAppointmentsRange,
  mapAppointmentsToCalendars,
  mapAppointmentsToEvents,
  mapAppointmentsToResources,
} from "../utils";
import { formatEventTime } from "../utils/format-time";
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

  const handleDragStart = ({ active }: DragStartEvent) => {
    const dragged = events.find((event) => event.id === active.id);
    if (dragged) setActiveDragEvent(dragged);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveDragEvent(null);
    if (!over) return;

    const draggedEvent = active.data.current?.event as
      | TAppointmentCalendarEvent
      | undefined;
    const overDate = over.data.current?.date as Date | undefined;
    if (!draggedEvent || !overDate) return;

    const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
    const newStart = new Date(overDate);

    if (view === "month") {
      newStart.setHours(
        draggedEvent.start.getHours(),
        draggedEvent.start.getMinutes(),
        0,
        0,
      );
    } else {
      newStart.setSeconds(0, 0);
    }

    if (newStart.getTime() === draggedEvent.start.getTime()) return;

    const newEnd = new Date(newStart.getTime() + duration);
    applyOverride(draggedEvent, newStart, newEnd);
    toast.info(`Cita movida a ${formatEventTime(newStart)}. ${SYNC_PENDING}`);
  };

  const handleEventResize = (event: TAppointmentCalendarEvent, newEnd: Date) => {
    if (differenceInMinutes(newEnd, event.start) < 15) return;
    applyOverride(event, event.start, newEnd);
    toast.info(`Duración actualizada. ${SYNC_PENDING}`);
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
        onSave={() => {
          closeModal();
          toast.info(SYNC_PENDING);
        }}
        onDelete={() => {
          closeModal();
          toast.info(SYNC_PENDING);
        }}
      />

      <EventContextMenu
        event={contextMenuEvent}
        position={contextMenuPosition}
        onClose={closeContextMenu}
        onEdit={(event) => setModalState({ open: true, mode: "edit", event })}
        onDuplicate={() => toast.info(SYNC_PENDING)}
        onDelete={() => toast.info(SYNC_PENDING)}
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
                <p className="mt-0.5 text-xs opacity-80">
                  {formatEventTime(activeDragEvent.start)} -{" "}
                  {formatEventTime(activeDragEvent.end)}
                </p>
              )}
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
