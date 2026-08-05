import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-accent-400/50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-accent-500 text-[#ffffff] hover:bg-accent-400 hover:shadow-[0_0_40px_-8px_color-mix(in_srgb,var(--color-accent-500)_60%,transparent)]",
        destructive:
          "bg-accent-700 text-[#ffffff] hover:bg-accent-800",
        outline:
          "text-ink-100 border border-ink-700 bg-ink-850/50 hover:bg-ink-800 hover:border-ink-600 backdrop-blur-sm",
        secondary:
          "bg-ink-100 text-ink-950 hover:bg-ink-200",
        ghost:
          "text-ink-50 hover:bg-ink-900 hover:text-ink-50",
        link: "text-ink-50 underline-offset-4 hover:underline",
      },
      size: {
        default: "px-6 py-3 has-[>svg]:px-5",
        sm: "gap-1.5 px-3 py-2 has-[>svg]:px-2.5",
        lg: "px-8 py-3.5 has-[>svg]:px-6",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
