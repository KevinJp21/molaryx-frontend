"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-md border border-ink-700 bg-ink-900 text-ink-950 transition-colors outline-none",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        "focus-visible:border-accent-500 focus-visible:ring-[3px] focus-visible:ring-accent-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-coral-500 aria-invalid:ring-[3px] aria-invalid:ring-coral-500/20",
        "data-[state=checked]:border-accent-500 data-[state=checked]:bg-accent-500 data-[state=checked]:text-ink-950",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
