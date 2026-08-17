"use client";

import { useEffect, useMemo, useState } from "react";
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
import type {
  TAppointmentCalendarEvent,
  TCalendarFilter,
  TCalendarView,
  TScheduleOverride,
} from "../types";

type Params = {
  date: Date;
  view: TCalendarView;
};

export const useCalendarEvents = ({ date, view }: Params) => {
  const dispatch = useAppDispatch();
  const { data, status } = useAppSelector(selectGetAppointments);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inactiveStatusIds, setInactiveStatusIds] = useState<
    Record<string, boolean>
  >({});
  const [activeResourceId, setActiveResourceId] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, TScheduleOverride>>(
    {},
  );

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
        if (activeResourceId && event.resourceId !== activeResourceId)
          return false;
        return true;
      }),
    [activeResourceId, events, inactiveStatusIds],
  );

  const applyOverride = (
    event: TAppointmentCalendarEvent,
    start: Date,
    end: Date,
  ) => {
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

  const isLoading = status === "loading" || status === "idle";

  return {
    events,
    visibleEvents,
    resources,
    calendars,
    isLoading,
    isSidebarOpen,
    setIsSidebarOpen,
    activeResourceId,
    setActiveResourceId,
    setInactiveStatusIds,
    applyOverride,
    clearOverride,
    refreshAppointments,
  };
};
