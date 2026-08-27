"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "./gsap";
import { prefersReducedMotion, useIsomorphicLayoutEffect } from "./utils";

interface IParallaxProps {
  children: ReactNode;
  className?: string;
  /** Recorrido en píxeles: positivo baja, negativo sube. */
  distance?: number;
}

export const Parallax = ({ children, className, distance = 60 }: IParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { y: distance },
        {
          y: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, element);

    return () => context.revert();
  }, [distance]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
