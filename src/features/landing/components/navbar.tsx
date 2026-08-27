"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button, Logo } from "@/components";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Panel", href: "/#dashboard" },
  { label: "Funcionalidades", href: "/#features" },
  { label: "Planes", href: "/#pricing" },
] as const;

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className={cn(
          "flex items-center justify-between transition-all duration-500 ease-out",
          scrolled
            ? "mx-4 mt-3 h-14 max-w-4xl w-[90%] rounded-full border border-ink-300/70 bg-ink-100/85 px-4 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:mx-auto sm:px-5"
            : "container-px mx-auto mt-0 h-16 w-full max-w-360 border border-transparent bg-transparent sm:h-18"
        )}
      >
        <Link
          href="/#top"
          scroll={false}
          className="inline-flex shrink-0 items-center leading-none"
          onClick={() => setOpen(false)}
        >
          <Logo size={scrolled ? 24 : 28} />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              scroll={false}
              className="text-sm font-medium text-ink-700 transition-colors duration-200 hover:text-ink-950"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-ink-700 transition-colors duration-200 hover:text-ink-950"
          >
            Iniciar sesión
          </Link>
          <Button variant="default" size="sm" asChild className="rounded-full">
            <Link href="/sign-up">
              Comenzar ahora
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex size-10 items-center justify-center rounded-full border border-ink-300 bg-ink-150/60 text-ink-900 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <div
        id="mobile-nav"
        className={cn(
          "mx-4 overflow-hidden rounded-3xl border border-ink-300/70 bg-ink-100/95 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-[max-height,opacity,margin-top] duration-300 sm:mx-auto sm:max-w-4xl lg:hidden",
          open ? "mt-2 max-h-80 opacity-100" : "mt-0 max-h-0 border-transparent opacity-0"
        )}
      >
        <div className="flex flex-col gap-1 p-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              scroll={false}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-200 hover:text-ink-950"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-2 flex flex-col gap-2 border-t border-ink-300/70 pt-4">
            <Button variant="outline" className="w-full rounded-full" asChild>
              <Link href="/sign-in" onClick={() => setOpen(false)}>
                Iniciar sesión
              </Link>
            </Button>
            <Button variant="default" className="w-full" asChild>
              <Link href="/sign-up" onClick={() => setOpen(false)}>
                Comenzar ahora
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
