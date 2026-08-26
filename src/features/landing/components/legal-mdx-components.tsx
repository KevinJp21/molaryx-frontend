import type { MDXComponents } from "mdx/types";
import { cn } from "@/lib/utils";

export const legalMdxComponents: MDXComponents = {
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "mt-3 text-3xl font-semibold tracking-tight text-ink-50 sm:text-4xl",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-12 scroll-mt-24 text-xl font-semibold tracking-tight text-ink-50 sm:text-2xl",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "mt-8 scroll-mt-24 border-b border-ink-800 pb-2 text-sm font-semibold uppercase tracking-wider text-ink-200",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn("mt-3 text-sm leading-relaxed text-ink-300", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-300",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "mt-3 list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-ink-300",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("leading-relaxed", className)} {...props} />
  ),
  a: ({ className, href, ...props }) => {
    const external = href?.startsWith("http");
    return (
      <a
        href={href}
        className={cn(
          "text-accent-500 underline-offset-2 hover:underline",
          className,
        )}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...props}
      />
    );
  },
  strong: ({ className, ...props }) => (
    <strong className={cn("font-semibold text-ink-100", className)} {...props} />
  ),
  em: ({ className, ...props }) => (
    <em className={cn("italic text-ink-300", className)} {...props} />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("my-8 border-ink-800", className)} {...props} />
  ),
};
