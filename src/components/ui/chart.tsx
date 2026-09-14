"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import type { TooltipValueType } from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

const INITIAL_DIMENSION = { width: 320, height: 200 } as const
type TooltipNameType = number | string

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
  initialDimension?: {
    width: number
    height: number
  }
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-ink-600 [&_.recharts-cartesian-axis-tick_text]:text-[11px] [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-ink-200 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-ink-300 [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-ink-200 [&_.recharts-radial-bar-background-sector]:fill-ink-150 [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-ink-150 [&_.recharts-reference-line_[stroke='#ccc']]:stroke-ink-250 [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer
          initialDimension={initialDimension}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme ?? config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

type ChartTooltipItem = NonNullable<
  RechartsPrimitive.DefaultTooltipContentProps<
    TooltipValueType,
    TooltipNameType
  >["payload"]
>[number]

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  hideName = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  valueFormatter,
  secondaryText,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    hideName?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
    valueFormatter?: (
      value: TooltipValueType | undefined,
      item: ChartTooltipItem,
      index: number
    ) => React.ReactNode
    secondaryText?:
      | React.ReactNode
      | ((
          item: ChartTooltipItem,
          index: number,
          payload: ChartTooltipItem[]
        ) => React.ReactNode)
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<
      TooltipValueType,
      TooltipNameType
    >,
    "accessibilityLayer"
  >) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? (config[label]?.label ?? label)
        : itemConfig?.label

    if (labelFormatter) {
      return (
        <p
          className={cn(
            "text-[10px] font-bold tracking-wider text-ink-700 uppercase",
            labelClassName
          )}
        >
          {labelFormatter(value, payload)}
        </p>
      )
    }

    if (!value) {
      return null
    }

    return (
      <p
        className={cn(
          "text-[10px] font-bold tracking-wider text-ink-700 uppercase",
          labelClassName
        )}
      >
        {value}
      </p>
    )
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  if (!active || !payload?.length) {
    return null
  }

  const visiblePayload = payload.filter((item) => item.type !== "none")
  const isSingle = visiblePayload.length === 1

  return (
    <div
      className={cn(
        "animate-in zoom-in-95 min-w-36 rounded-xl border border-ink-250 bg-ink-50/90 p-3 text-xs shadow-[0_1px_0_rgba(14,14,23,0.04),0_16px_40px_-24px_rgba(124,77,255,0.45)] backdrop-blur-md duration-200",
        className
      )}
    >
      {visiblePayload.map((item, index) => {
        const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)
        const indicatorColor = color ?? item.payload?.fill ?? item.color
        const itemName = itemConfig?.label ?? item.name
        const resolvedSecondary =
          typeof secondaryText === "function"
            ? secondaryText(item, index, visiblePayload)
            : index === 0
              ? secondaryText
              : null

        if (formatter && item?.value !== undefined && item.name) {
          return (
            <div key={index} className={cn(index > 0 && "mt-2.5")}>
              {formatter(item.value, item.name, item, index, item.payload)}
            </div>
          )
        }

        const renderedValue =
          valueFormatter?.(item.value, item, index) ??
          (item.value != null
            ? typeof item.value === "number"
              ? item.value.toLocaleString()
              : String(item.value)
            : null)

        return (
          <div key={index} className={cn(index > 0 && "mt-2.5 border-t border-ink-200 pt-2.5")}>
            {(tooltipLabel || (!hideIndicator && isSingle)) && index === 0 ? (
              <div className="mb-1 flex items-center gap-2">
                {itemConfig?.icon ? (
                  <itemConfig.icon />
                ) : (
                  !hideIndicator && (
                    <div
                      className={cn("shrink-0 rounded-full border-(--color-border) bg-(--color-bg)", {
                        "size-2": indicator === "dot",
                        "h-2.5 w-1": indicator === "line",
                        "size-2 border-[1.5px] border-dashed bg-transparent":
                          indicator === "dashed",
                      })}
                      style={
                        {
                          "--color-bg": indicatorColor,
                          "--color-border": indicatorColor,
                        } as React.CSSProperties
                      }
                    />
                  )
                )}
                {tooltipLabel}
              </div>
            ) : null}

            {!isSingle && !hideIndicator ? (
              <div className="mb-1 flex items-center gap-2">
                {itemConfig?.icon ? (
                  <itemConfig.icon />
                ) : (
                  <div
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: indicatorColor }}
                  />
                )}
                {!hideName && itemName ? (
                  <p className="text-xs font-bold capitalize text-ink-900">{itemName}</p>
                ) : null}
              </div>
            ) : null}

            {isSingle && !hideName && itemName ? (
              <p className="mb-1 text-xs font-bold capitalize text-ink-900">{itemName}</p>
            ) : null}

            {renderedValue != null ? (
              <p className="text-lg font-bold leading-none text-ink-900 tabular-nums">
                {renderedValue}
              </p>
            ) : null}

            {resolvedSecondary ? (
              <p className="mt-1 whitespace-nowrap text-[10px] font-medium text-ink-700">
                {resolvedSecondary}
              </p>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  hideIcon?: boolean
  nameKey?: string
} & RechartsPrimitive.DefaultLegendContentProps) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 text-xs text-ink-600",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item, index) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-ink-600"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
    </div>
  )
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
