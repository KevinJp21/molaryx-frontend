"use client";

import { useState } from "react";
import type {
  TAppointmentCalendarEvent,
  TAppointmentModalMode,
} from "../types";

type ModalState = {
  open: boolean;
  mode: TAppointmentModalMode;
  event: TAppointmentCalendarEvent | null;
  initialDate?: Date;
};

const blurActiveElement = () => {
  const active = document.activeElement;
  if (active instanceof HTMLElement) active.blur();
};

export const useAppointmentModalState = () => {
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    mode: "view",
    event: null,
  });

  const openEvent = (event: TAppointmentCalendarEvent) => {
    blurActiveElement();
    setModalState({ open: true, mode: "view", event });
  };

  const openCreate = (initialDate?: Date) => {
    blurActiveElement();
    setModalState({
      open: true,
      mode: "create",
      event: null,
      initialDate: initialDate ?? new Date(),
    });
  };

  const openEdit = (event: TAppointmentCalendarEvent) => {
    blurActiveElement();
    setModalState({ open: true, mode: "edit", event });
  };

  const closeModal = () =>
    setModalState((current) => ({ ...current, open: false }));

  const setMode = (mode: TAppointmentModalMode) =>
    setModalState((current) => ({ ...current, mode }));

  return {
    modalState,
    openEvent,
    openCreate,
    openEdit,
    closeModal,
    setMode,
  };
};
