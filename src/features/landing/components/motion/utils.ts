import { useEffect, useLayoutEffect } from "react";

/** GSAP necesita aplicar los estados iniciales antes del primer paint. */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
