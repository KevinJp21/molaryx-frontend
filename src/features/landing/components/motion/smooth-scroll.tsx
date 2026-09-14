"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { prefersReducedMotion } from "./utils";

/** Offset del navbar flotante para que el ancla no quede tapada. */
const ANCHOR_OFFSET = -96;

type TWindowWithLenis = Window & { __molaryxLenis?: Lenis | null };

function getAnchorTarget(href: string): HTMLElement | null {
  try {
    const url = new URL(href, window.location.href);
    if (url.hash.length <= 1) return null;
    return document.getElementById(url.hash.slice(1));
  } catch {
    return null;
  }
}

function scrollToAnchor(lenis: Lenis | null, href: string) {
  const url = new URL(href, window.location.href);
  if (url.pathname !== window.location.pathname) return false;

  const target = getAnchorTarget(href);
  if (!target) return false;

  if (url.hash) {
    window.history.replaceState(
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`
    );
  }

  if (lenis) {
    lenis.scrollTo(target, { offset: ANCHOR_OFFSET, duration: 1.2 });
  } else {
    const top =
      target.getBoundingClientRect().top + window.scrollY + ANCHOR_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return true;
}

export const SmoothScroll = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const reducedMotion = prefersReducedMotion();
    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;
    let refreshFrame = 0;

    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest("a[href]");
      const href = anchor?.getAttribute("href");
      if (!href?.includes("#")) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const activeLenis = (window as TWindowWithLenis).__molaryxLenis ?? null;
      if (!scrollToAnchor(activeLenis, href)) return;

      event.preventDefault();
    };

    document.addEventListener("click", onDocumentClick, true);

    const scheduleRefresh = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const observer = new ResizeObserver(scheduleRefresh);
    observer.observe(document.body);

    if (!reducedMotion) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.2,
      });

      (window as TWindowWithLenis).__molaryxLenis = lenis;

      const onLenisScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onLenisScroll);

      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (!lenis) return 0;
          if (arguments.length && typeof value === "number") {
            lenis.scrollTo(value, { immediate: true });
          }
          return lenis.scroll;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: document.documentElement.style.transform ? "transform" : "fixed",
      });

      const onRefresh = () => lenis?.resize();
      ScrollTrigger.addEventListener("refresh", onRefresh);

      raf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      if (window.location.hash) {
        requestAnimationFrame(() => {
          scrollToAnchor(lenis, window.location.href);
        });
      }

      return () => {
        document.removeEventListener("click", onDocumentClick, true);
        cancelAnimationFrame(refreshFrame);
        observer.disconnect();
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        ScrollTrigger.scrollerProxy(document.documentElement, {});
        if (raf) gsap.ticker.remove(raf);
        lenis?.off("scroll", onLenisScroll);
        lenis?.destroy();
        (window as TWindowWithLenis).__molaryxLenis = null;
      };
    }

    if (window.location.hash) {
      requestAnimationFrame(() => {
        scrollToAnchor(null, window.location.href);
      });
    }

    return () => {
      document.removeEventListener("click", onDocumentClick, true);
      cancelAnimationFrame(refreshFrame);
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
};
