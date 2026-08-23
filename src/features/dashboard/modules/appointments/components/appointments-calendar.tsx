"use client";

import { useId } from "react";
import type { MouseEvent } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components";
import { useAppSelector } from "@/store";
import { selectGetUserData } from "@/store/authentication/authentication-slice";
import { checkCanCreate, checkCanUpdate } from "@/features/dashboard/utils";
import { PERMISSION_MODULES } from "@/features/dashboard/consts";
import {
  useAppointmentModalState,
  useAppointmentMutations,
  useCalendarDnd,
  useCalendarEvents,
  useCalendarNavigation,
} from "../hooks";
import type { TAppointmentCalendarEvent } from "../types";
import { AppointmentEventModal } from "./appointment-event-modal";
import {
  AgendaView,
  CalendarDragOverlayCard,
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

export const AppointmentsCalendar = () => {
  const dndId = useId();
  const { data: userData } = useAppSelector(selectGetUserData);
  const canCreate = checkCanCreate(
    userData?.permissions,
    PERMISSION_MODULES.APPOINTMENTS,
  );
  const canUpdate = checkCanUpdate(
    userData?.permissions,
    PERMISSION_MODULES.APPOINTMENTS,
  );

  const {
    view,
    setView,
    date,
    setDate,
    goPrev,
    goNext,
    goToday,
    swipeRef,
  } = useCalendarNavigation();

  const {
    events,
    visibleEvents,
    resources,
    calendars,
    isLoading,
    hasError,
    message,
    error,
    isSidebarOpen,
    setIsSidebarOpen,
    activeResourceId,
    setActiveResourceId,
    setInactiveStatusIds,
    applyOverride,
    clearOverride,
    refreshAppointments,
  } = useCalendarEvents({ date, view });

  const { syncAppointmentSchedule, cancelAppointment } =
    useAppointmentMutations({
      applyOverride,
      clearOverride,
      refreshAppointments,
    });

  const {
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
  } = useCalendarDnd({
    view,
    events,
    applyOverride,
    syncAppointmentSchedule,
  });

  const {
    modalState,
    openEvent,
    openCreate,
    openEdit,
    closeModal,
    setMode,
  } = useAppointmentModalState();

  const {
    contextMenuEvent,
    contextMenuPosition,
    openContextMenu,
    closeContextMenu,
  } = useEventContextMenu();

  const handleEventContextMenu = (
    event: TAppointmentCalendarEvent,
    mouseEvent: MouseEvent,
  ) => openContextMenu(event, mouseEvent);

  const handleTimeSlotClick = canCreate
    ? (slotDate: Date) => openCreate(slotDate)
    : undefined;

  const handleResourceTimeSlotClick = canCreate
    ? (slotDate: Date) => openCreate(slotDate)
    : undefined;

  const renderView = () => {
    if (view === "month") {
      return (
        <MonthView
          currentDate={date}
          events={visibleEvents}
          onEventClick={openEvent}
          onEventContextMenu={canUpdate ? handleEventContextMenu : undefined}
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
          onEventContextMenu={canUpdate ? handleEventContextMenu : undefined}
          onTimeSlotClick={handleTimeSlotClick}
          onEventResize={canUpdate ? handleEventResize : undefined}
          onEventResizePreview={canUpdate ? handleEventResizePreview : undefined}
        />
      );
    }

    if (view === "day") {
      return (
        <DayView
          currentDate={date}
          events={visibleEvents}
          onEventClick={openEvent}
          onEventContextMenu={canUpdate ? handleEventContextMenu : undefined}
          onTimeSlotClick={handleTimeSlotClick}
          onEventResize={canUpdate ? handleEventResize : undefined}
          onEventResizePreview={canUpdate ? handleEventResizePreview : undefined}
        />
      );
    }

    if (view === "agenda") {
      return (
        <AgendaView
          currentDate={date}
          events={visibleEvents}
          onEventClick={openEvent}
          onEventContextMenu={canUpdate ? handleEventContextMenu : undefined}
          onCreateClick={canCreate ? () => openCreate() : undefined}
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
        onEventContextMenu={canUpdate ? handleEventContextMenu : undefined}
        onTimeSlotClick={handleResourceTimeSlotClick}
        onCreateClick={canCreate ? () => openCreate() : undefined}
      />
    );
  };

  const calendarBody = (
    <div className="flex h-full min-h-160 flex-col overflow-hidden rounded-2xl bg-ink-950 shadow-[0_1px_0_rgba(14,14,23,0.04),0_24px_48px_-28px_rgba(124,77,255,0.45)] ring-1 ring-ink-700/70">
      <CalendarHeader
        currentDate={date}
        view={view}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
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
          canCreate={canCreate}
        />

        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <div
            ref={swipeRef}
            className="min-h-0 flex-1 touch-pan-y overflow-auto p-0 md:p-3"
          >
            <div className="h-full min-w-full">
              {isLoading ? (
                <CalendarViewSkeleton view={view} />
              ) : hasError ? (
                <div className="flex h-full items-center justify-center p-6">
                  <div className="flex max-w-md flex-col gap-1 text-center text-sm text-coral-500">
                    <span>{message}</span>
                    {error && (
                      <span className="text-xs opacity-90">{error}</span>
                    )}
                  </div>
                </div>
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

          {canCreate && (
            <Button
              type="button"
              onClick={() => openCreate()}
              aria-label="Nueva cita"
              className="absolute right-6 bottom-6 z-40 size-14 rounded-full shadow-lg shadow-accent-500/30 md:hidden"
            >
              <Plus className="size-6" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {canUpdate ? (
        <DndContext
          id={dndId}
          sensors={sensors}
          modifiers={modifiers}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragCancel={handleDragCancel}
          onDragEnd={handleDragEnd}
        >
          {calendarBody}
          <DragOverlay dropAnimation={null}>
            {activeDragEvent && (
              <CalendarDragOverlayCard
                event={activeDragEvent}
                view={view}
                preview={dragPreview}
              />
            )}
          </DragOverlay>
        </DndContext>
      ) : (
        calendarBody
      )}

      <AppointmentEventModal
        open={modalState.open}
        mode={modalState.mode}
        event={modalState.event}
        initialDate={modalState.initialDate}
        onModeChange={setMode}
        onClose={closeModal}
        onSuccess={() => {
          closeModal();
          refreshAppointments();
        }}
        onDelete={async (event) => {
          const cancelled = await cancelAppointment(event);
          if (cancelled) closeModal();
        }}
        canCreate={canCreate}
        canUpdate={canUpdate}
      />

      {canUpdate && (
        <EventContextMenu
          event={contextMenuEvent}
          position={contextMenuPosition}
          onClose={closeContextMenu}
          onEdit={openEdit}
          onDuplicate={() => toast.info(SYNC_PENDING)}
          onDelete={(event) => {
            void cancelAppointment(event);
          }}
        />
      )}
    </>
  );
};
