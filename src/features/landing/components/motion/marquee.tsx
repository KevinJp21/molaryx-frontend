"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "./gsap";
import { prefersReducedMotion, useIsomorphicLayoutEffect } from "./utils";

interface IMarqueeProps {
  children: ReactNode;
  className?: string;
  /** Segundos que tarda el track en recorrer una copia completa. */
  speed?: number;
  reverse?: boolean;
}

export const Marquee = ({
  children,
  className,
  speed = 32,
  reverse = false,
}: IMarqueeProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        {
          xPercent: reverse ? 0 : -50,
          duration: speed,
          ease: "none",
          repeat: -1,
        }
      );
    }, track);

    return () => context.revert();
  }, [speed, reverse]);

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <div ref={trackRef} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
};
