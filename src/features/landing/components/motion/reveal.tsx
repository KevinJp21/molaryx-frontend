"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "./gsap";
import { prefersReducedMotion, useIsomorphicLayoutEffect } from "./utils";

export type TRevealVariant = "up" | "fade" | "scale" | "left" | "right" | "blur";

interface IVariantStates {
  from: gsap.TweenVars;
  to: gsap.TweenVars;
}

const VARIANTS: Record<TRevealVariant, IVariantStates> = {
  up: { from: { y: 36, opacity: 0 }, to: { y: 0, opacity: 1 } },
  fade: { from: { opacity: 0 }, to: { opacity: 1 } },
  scale: {
    from: { scale: 0.95, opacity: 0, transformOrigin: "50% 70%" },
    to: { scale: 1, opacity: 1 },
  },
  left: { from: { x: -48, opacity: 0 }, to: { x: 0, opacity: 1 } },
  right: { from: { x: 48, opacity: 0 }, to: { x: 0, opacity: 1 } },
  blur: {
    from: { opacity: 0, filter: "blur(12px)", y: 20 },
    to: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
};

interface IRevealProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  variant?: TRevealVariant;
  delay?: number;
  duration?: number;
  /** Si es mayor a 0, anima los hijos directos en cascada. */
  stagger?: number;
  start?: string;
}

export const Reveal = ({
  children,
  className,
  as: Tag = "div",
  variant = "up",
  delay = 0,
  duration = 0.9,
  stagger = 0,
  start = "top 85%",
}: IRevealProps) => {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const targets = stagger > 0 ? Array.from(element.children) : element;
    if (Array.isArray(targets) && targets.length === 0) return;

    const context = gsap.context(() => {
      const states = VARIANTS[variant];

      gsap.set(targets, states.from);
      gsap.to(targets, {
        ...states.to,
        duration,
        delay,
        stagger,
        ease: "power3.out",
        clearProps: "all",
        scrollTrigger: { trigger: element, start, once: true },
      });
    }, element);

    return () => context.revert();
  }, [variant, delay, duration, stagger, start]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
};
