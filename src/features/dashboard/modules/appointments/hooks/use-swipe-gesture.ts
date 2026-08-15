"use client";

import { useCallback, useEffect, useRef } from "react";

type Options = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  restraint?: number;
  allowedTime?: number;
  enabled?: boolean;
};

type TouchInfo = {
  startX: number;
  startY: number;
  startTime: number;
};

export const useSwipeGesture = <T extends HTMLElement>({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  restraint = 100,
  allowedTime = 300,
  enabled = true,
}: Options) => {
  const touchInfoRef = useRef<TouchInfo | null>(null);
  const elementRef = useRef<T>(null);

  const handleTouchStart = useCallback(
    (touchEvent: TouchEvent) => {
      if (!enabled) return;
      const touch = touchEvent.touches[0];
      touchInfoRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
      };
    },
    [enabled],
  );

  const handleTouchEnd = useCallback(
    (touchEvent: TouchEvent) => {
      if (!enabled || !touchInfoRef.current) return;

      const touch = touchEvent.changedTouches[0];
      const { startX, startY, startTime } = touchInfoRef.current;
      const distX = touch.clientX - startX;
      const distY = touch.clientY - startY;

      if (
        Date.now() - startTime <= allowedTime &&
        Math.abs(distX) >= threshold &&
        Math.abs(distY) <= restraint
      ) {
        if (distX > 0) onSwipeRight?.();
        else onSwipeLeft?.();
      }

      touchInfoRef.current = null;
    },
    [enabled, threshold, restraint, allowedTime, onSwipeLeft, onSwipeRight],
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return elementRef;
};

export const useViewSwipe = <T extends HTMLElement = HTMLElement>(
  onPrev: () => void,
  onNext: () => void,
  enabled = true,
) => useSwipeGesture<T>({ onSwipeLeft: onNext, onSwipeRight: onPrev, enabled });
