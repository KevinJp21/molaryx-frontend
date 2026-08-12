import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-accent-500 text-white [a&]:hover:bg-accent-600",
        secondary:
          "border-transparent bg-accent-100 text-accent-700 [a&]:hover:bg-accent-200",
        destructive:
          "border-transparent bg-coral-500/12 text-coral-600 [a&]:hover:bg-coral-500/18",
        outline:
          "border-ink-700 bg-transparent text-ink-200 [a&]:hover:bg-ink-900 [a&]:hover:text-ink-100",
        success:
          "border-transparent bg-accent-500/12 text-accent-600 [a&]:hover:bg-accent-500/18",
        muted:
          "border-transparent bg-ink-800 text-ink-300 [a&]:hover:bg-ink-750",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
