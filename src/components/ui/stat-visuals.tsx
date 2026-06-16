/**
 * stat-visuals.tsx — Reusable SVG bento stat-card components.
 *
 * Exports: StatSquiggle, StatRing, StatTrend, StatBadge
 *
 * Design tokens: coastal palette (sand/linen/deep-sea/sea/golden-hour/slate).
 * Animations: motion/react; trigger on in-view (once); reduced-motion aware.
 */

import { useRef } from "react"
import {
  motion,
  useReducedMotion,
  useInView,
} from "motion/react"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { EASE } from "@/lib/motion"

// ---------------------------------------------------------------------------
// Shared card chrome
// ---------------------------------------------------------------------------

const CARD_BASE =
  "rounded-2xl border border-deep-sea/10 bg-linen p-5 transition-transform duration-300 hover:-translate-y-0.5"

// ---------------------------------------------------------------------------
// StatSquiggle
// Big number + hand-drawn squiggle underline that draws on in-view.
// ---------------------------------------------------------------------------

export interface StatSquiggleProps {
  value: string
  label: string
  accent?: "sea" | "golden"
  className?: string
}

export function StatSquiggle({
  value,
  label,
  accent = "golden",
  className,
}: StatSquiggleProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: "-60px" })

  const strokeColor =
    accent === "golden" ? "var(--color-golden-hour)" : "var(--color-sea)"
  const textColor =
    accent === "golden" ? "text-golden-hour" : "text-sea"

  // Animate pathLength 0→1 when in view; static when reduced-motion
  const pathLength = reduce ? 1 : inView ? 1 : 0

  return (
    <div ref={ref} className={cn(CARD_BASE, "flex flex-col", className)}>
      {/* Value */}
      <span
        className={cn(
          "text-4xl font-semibold leading-none tracking-tight sm:text-5xl",
          textColor,
        )}
      >
        {value}
      </span>

      {/* Hand-drawn squiggle underline */}
      <svg
        viewBox="0 0 120 16"
        className="mt-2 w-full max-w-[8rem] overflow-visible"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M4 10 Q20 2, 36 10 Q52 18, 68 10 Q84 2, 100 10 Q108 14, 116 10"
          fill="none"
          stroke={strokeColor}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.9, ease: EASE, delay: inView ? 0.1 : 0 }
          }
        />
      </svg>

      {/* Label */}
      <p className="mt-3 text-xs leading-snug text-slate">{label}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// StatRing
// Circular progress ring that animates its arc to `percent` on in-view.
// ---------------------------------------------------------------------------

export interface StatRingProps {
  value: string
  label: string
  percent: number
  className?: string
}

export function StatRing({ value, label, percent, className }: StatRingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: "-60px" })

  // SVG circle maths
  const SIZE = 96
  const STROKE = 7
  const RADIUS = (SIZE - STROKE) / 2
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS

  const clampedPercent = Math.min(100, Math.max(0, percent))
  const targetOffset = CIRCUMFERENCE * (1 - clampedPercent / 100)

  // When reduced-motion: show full arc immediately
  const strokeDashoffset = reduce ? targetOffset : inView ? targetOffset : CIRCUMFERENCE

  return (
    <div
      ref={ref}
      className={cn(CARD_BASE, "flex flex-col items-center justify-center gap-2", className)}
    >
      {/* Ring SVG */}
      <div className="relative flex items-center justify-center">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden="true"
          className="block"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="color-mix(in srgb, var(--color-deep-sea) 10%, transparent)"
            strokeWidth={STROKE}
          />
          {/* Progress arc */}
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-sea)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 1.1, ease: EASE, delay: inView ? 0.05 : 0 }
            }
          />
        </svg>

        {/* Centred value */}
        <span className="absolute text-2xl font-semibold text-deep-sea">
          {value}
        </span>
      </div>

      {/* Label under ring */}
      <p className="text-xs leading-snug text-slate">{label}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// StatTrend
// Sparkline + TrendingUp/Down icon + value. On-brand: no red/green.
// Up = sea, Down = sea (direction shown via icon + slope only).
// ---------------------------------------------------------------------------

export interface StatTrendProps {
  value: string
  label: string
  direction: "up" | "down"
  className?: string
}

// Deterministic sparkline points for up/down direction
function buildSparkline(direction: "up" | "down"): [number, number][] {
  if (direction === "up") {
    return [
      [2, 36],
      [14, 30],
      [28, 32],
      [40, 22],
      [54, 18],
      [66, 12],
      [78, 8],
      [90, 4],
    ]
  }
  return [
    [2, 4],
    [14, 8],
    [28, 6],
    [40, 14],
    [54, 20],
    [66, 26],
    [78, 30],
    [90, 36],
  ]
}

function pointsToSvgString(pts: [number, number][]): string {
  return pts.map(([x, y]) => `${x},${y}`).join(" ")
}

export function StatTrend({ value, label, direction, className }: StatTrendProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: "-60px" })

  const points = buildSparkline(direction)
  const polylineStr = pointsToSvgString(points)

  // Area fill: close the path to the bottom baseline
  const areaPoints = [
    ...points,
    [points[points.length - 1][0], 40],
    [points[0][0], 40],
  ] as [number, number][]
  const polygonStr = pointsToSvgString(areaPoints)

  const Icon = direction === "up" ? TrendingUp : TrendingDown

  return (
    <div ref={ref} className={cn(CARD_BASE, "flex flex-col", className)}>
      {/* Header row: icon + value */}
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sea/10"
          aria-hidden="true"
        >
          <Icon className="h-4 w-4 text-sea" />
        </span>
        <span className="text-2xl font-semibold text-deep-sea">{value}</span>
      </div>

      {/* Sparkline */}
      <motion.svg
        viewBox="0 0 92 42"
        className="mt-3 w-full"
        aria-hidden="true"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: reduce ? 1 : inView ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE, delay: 0.1 }}
      >
        {/* Low-alpha area fill */}
        <polygon
          points={polygonStr}
          fill="var(--color-sea)"
          fillOpacity={0.08}
        />
        {/* Line */}
        <polyline
          points={polylineStr}
          fill="none"
          stroke="var(--color-sea)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>

      {/* Label */}
      <p className="mt-2 text-xs leading-snug text-slate">{label}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// StatBadge
// Icon square + big value + label. Compact, count-style metric.
// ---------------------------------------------------------------------------

export interface StatBadgeProps {
  value: string
  label: string
  icon: LucideIcon
  className?: string
}

export function StatBadge({ value, label, icon: Icon, className }: StatBadgeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      className={cn(CARD_BASE, "flex flex-col gap-3", className)}
      initial={{ opacity: 0, y: 12 }}
      animate={
        reduce
          ? { opacity: 1, y: 0 }
          : inView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 12 }
      }
      transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE, delay: 0.05 }}
    >
      {/* Icon square */}
      <span
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sea/10"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5 text-sea" />
      </span>

      {/* Value */}
      <span className="text-2xl font-semibold text-deep-sea">{value}</span>

      {/* Label */}
      <p className="text-xs leading-snug text-slate">{label}</p>
    </motion.div>
  )
}
