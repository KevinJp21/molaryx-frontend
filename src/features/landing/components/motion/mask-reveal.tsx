"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "./gsap";
import { prefersReducedMotion, useIsomorphicLayoutEffect } from "./utils";

interface IMaskRevealProps {
  /** Cada entrada se anima como una línea independiente detrás de su máscara. */
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  /** "mount" para el hero, "scroll" para el resto de secciones. */
  trigger?: "mount" | "scroll";
}

export const MaskReveal = ({
  lines,
  as: Tag = "div",
  className,
  lineClassName,
  delay = 0,
  duration = 1.1,
  stagger = 0.09,
  start = "top 85%",
  trigger = "scroll",
}: IMaskRevealProps) => {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      gsap.set("[data-mask-line]", { yPercent: 118 });
      gsap.to("[data-mask-line]", {
        yPercent: 0,
        duration,
        delay,
        stagger,
        ease: "expo.out",
        clearProps: "all",
        scrollTrigger:
          trigger === "scroll" ? { trigger: element, start, once: true } : undefined,
      });
    }, element);

    return () => context.revert();
  }, [delay, duration, stagger, start, trigger]);

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, index) => (
        <span key={index} className="block overflow-hidden pb-[0.14em]">
          <span
            data-mask-line
            className={`block will-change-transform ${lineClassName ?? ""}`}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
};
