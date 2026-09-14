"use client";

import { useRef } from "react";
import { gsap } from "./gsap";
import { useIsomorphicLayoutEffect } from "./utils";

export const ScrollProgress = () => {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
          },
        }
      );
    }, element);

    return () => context.revert();
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-60 h-0.5">
      <div
        ref={ref}
        className="h-full origin-left bg-linear-to-r from-accent-500 to-coral-500"
      />
    </div>
  );
};
