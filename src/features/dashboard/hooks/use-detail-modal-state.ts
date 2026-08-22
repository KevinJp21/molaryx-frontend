"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DETAIL_MODAL_CLOSE_DELAY_MS = 200;

export const useDetailModalState = <T>() => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<T | null>(null);
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }
    };
  }, []);

  const openDetails = useCallback((item: T) => {
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current);
      clearTimeoutRef.current = null;
    }
    setSelected(item);
    setOpen(true);
  }, []);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      clearTimeoutRef.current = setTimeout(() => {
        setSelected(null);
        clearTimeoutRef.current = null;
      }, DETAIL_MODAL_CLOSE_DELAY_MS);
    }
  }, []);

  return { open, selected, openDetails, handleOpenChange };
};
