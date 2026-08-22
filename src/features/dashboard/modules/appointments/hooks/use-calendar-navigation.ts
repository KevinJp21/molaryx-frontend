"use client";

import { useState } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { useViewSwipe } from "./use-swipe-gesture";
import type { TCalendarView } from "../types";

export const useCalendarNavigation = () => {
  const [view, setView] = useState<TCalendarView>("week");
  const [date, setDate] = useState(() => new Date());

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

  const goToday = () => setDate(new Date());

  const swipeRef = useViewSwipe<HTMLDivElement>(goPrev, goNext);

  return {
    view,
    setView,
    date,
    setDate,
    goPrev,
    goNext,
    goToday,
    swipeRef,
  };
};
