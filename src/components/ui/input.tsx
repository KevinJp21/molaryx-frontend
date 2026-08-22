import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "h-auto w-full min-w-0 rounded-xl border border-ink-700 bg-ink-900 px-3.5 py-2.5 text-sm text-ink-50 outline-none transition-[border-color,box-shadow] duration-200",
          "placeholder:text-ink-400",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "focus-visible:border-accent-500 focus-visible:ring-[3px] focus-visible:ring-accent-500/20",
          "aria-invalid:border-coral-500 aria-invalid:ring-[3px] aria-invalid:ring-coral-500/20",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input }
