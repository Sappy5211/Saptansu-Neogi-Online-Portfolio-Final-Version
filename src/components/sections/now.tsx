/**
 * now.tsx — Currently building section (V6)
 *
 * Bento grid layout: CFA (wide) + BMC (narrow) row 1; Meta (wide) + Trading (narrow) row 2.
 * "Find out more" opens a mini modal popup (fixed overlay, centred card, X/backdrop/Escape close).
 * No rotating conic-gradient ring. BMC tile overlap fixed. bg-sand section, bg-linen cards.
 *
 * A11y: role=dialog aria-modal aria-labelledby; focus trap on open; return focus on close;
 *       body-scroll lock; reduced-motion = instant; Escape key; backdrop click.
 */

import {
  useRef,
  useState,
  useId,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { X, Cpu, GraduationCap, BarChart2, BookOpen } from "lucide-react"
import { motion, useReducedMotion, useInView } from "motion/react"

import { Section, SectionHeading } from "@/components/ui/section"
import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"
import { EASE } from "@/lib/motion"

// ─────────────────────────────────────────────────────────────────────────────
// CFA topic data
// ─────────────────────────────────────────────────────────────────────────────

interface CfaTopic {
  name: string
  weight: string
  mid: number
  tier: 1 | 2 | 3
}

const CFA_TOPICS: CfaTopic[] = [
  { name: "Ethics & Professional Standards", weight: "15–20%", mid: 17.5, tier: 1 },
  { name: "Financial Statement Analysis",    weight: "11–14%", mid: 12.5, tier: 1 },
  { name: "Equity Investments",              weight: "11–14%", mid: 12.5, tier: 1 },
  { name: "Fixed Income",                    weight: "11–14%", mid: 12.5, tier: 1 },
  { name: "Portfolio Management",            weight: "8–12%",  mid: 10,   tier: 2 },
  { name: "Alternative Investments",         weight: "7–10%",  mid: 8.5,  tier: 2 },
  { name: "Quantitative Methods",            weight: "6–9%",   mid: 7.5,  tier: 2 },
  { name: "Economics",                       weight: "6–9%",   mid: 7.5,  tier: 2 },
  { name: "Corporate Issuers",               weight: "6–9%",   mid: 7.5,  tier: 2 },
  { name: "Derivatives",                     weight: "5–8%",   mid: 6.5,  tier: 3 },
]

// ─────────────────────────────────────────────────────────────────────────────
// PulsingDot
// ─────────────────────────────────────────────────────────────────────────────

function PulsingDot({ reduce }: { reduce: boolean | null }) {
  return (
    <div className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
      {!reduce && (
        <span
          className="absolute inline-flex h-full w-full rounded-full bg-sea opacity-60"
          style={{ animation: "nowping 1.8s ease-out infinite" }}
        />
      )}
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sea" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CfaTopicBarsVisual — compact bar chart of all 10 CFA topics
// ─────────────────────────────────────────────────────────────────────────────

function CfaTopicBarsVisual() {
  const ref = useRef<SVGSVGElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-40px" })
  const active = !reduce && inView

  const W = 340
  const labelW = 130
  const barAreaW = W - labelW - 12
  const rowH = 20
  const gap = 4
  const totalH = CFA_TOPICS.length * (rowH + gap)
  const maxMid = 17.5

  const tierColor = (tier: 1 | 2 | 3) =>
    tier === 1 ? "var(--color-sea)" : tier === 2 ? "var(--color-deep-sea)" : "var(--color-slate)"
  const tierOpacity = (tier: 1 | 2 | 3) =>
    tier === 1 ? 0.9 : tier === 2 ? 0.55 : 0.32

  return (
    <div aria-hidden="true" className="w-full">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate">
        2026 exam topic weights · 10 areas
      </p>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${totalH + 4}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ maxHeight: "260px" }}
      >
        {CFA_TOPICS.map((topic, i) => {
          const y = i * (rowH + gap)
          const barW = (topic.mid / maxMid) * barAreaW
          const x0 = labelW
          return (
            <g key={topic.name}>
              <text
                x={labelW - 6}
                y={y + rowH / 2 + 3.5}
                textAnchor="end"
                fontSize={7.5}
                fontWeight={topic.tier === 1 ? 600 : 400}
                fill={topic.tier === 1 ? "var(--color-deep-sea)" : "var(--color-slate)"}
                fontFamily="inherit"
              >
                {topic.name}
              </text>
              <rect
                x={x0} y={y + 3} width={barAreaW} height={rowH - 6}
                rx={2.5} fill="var(--color-shell)" fillOpacity={0.5}
              />
              <motion.rect
                x={x0} y={y + 3} width={barW} height={rowH - 6}
                rx={2.5}
                fill={tierColor(topic.tier)}
                fillOpacity={tierOpacity(topic.tier)}
                initial={{ scaleX: 0 }}
                animate={active ? { scaleX: 1 } : { scaleX: 0 }}
                style={{ transformOrigin: `${x0}px ${y + rowH / 2}px` }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.6, ease: EASE, delay: 0.05 + i * 0.055 }
                }
              />
              <text
                x={x0 + barW + 4}
                y={y + rowH / 2 + 3.5}
                fontSize={7}
                fontWeight={topic.tier === 1 ? 600 : 400}
                fill={tierColor(topic.tier)}
                fillOpacity={topic.tier === 1 ? 1 : 0.8}
                fontFamily="inherit"
              >
                {topic.weight}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BmcModuleVisual — four Bloomberg module tiles (overlap-free)
// ─────────────────────────────────────────────────────────────────────────────

function BmcModuleVisual() {
  const ref = useRef<SVGSVGElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-40px" })
  const active = !reduce && inView

  const modules = [
    { label: "Economics",    sublabel: "GDP · inflation · monetary policy", color: "var(--color-sea)",         textColor: "var(--color-linen)",    accent: true  },
    { label: "Currencies",   sublabel: "FX rates · carry trade",            color: "var(--color-shell)",       textColor: "var(--color-deep-sea)", accent: false },
    { label: "Fixed Income", sublabel: "Bonds · yield · duration",          color: "var(--color-deep-sea)",    textColor: "var(--color-linen)",    accent: false },
    { label: "Equities",     sublabel: "Valuation · EPS · rel. value",      color: "var(--color-golden-hour)", textColor: "var(--color-deep-sea)", accent: false },
  ]

  // Each tile: width 148, height 66, gap 8 between cols/rows
  const tileW = 148
  const tileH = 66
  const gapX = 8
  const gapY = 8
  const svgW = 2 * tileW + gapX + 8   // 312
  const svgH = 2 * tileH + gapY + 8   // 148

  return (
    <div aria-hidden="true" className="w-full">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate">
        Four module areas
      </p>
      <svg
        ref={ref}
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ maxHeight: "160px" }}
      >
        {modules.map((mod, i) => {
          const col = i % 2
          const row = Math.floor(i / 2)
          const x = col * (tileW + gapX) + 4
          const y = row * (tileH + gapY) + 4
          // Label y: centred in first third of tile height
          const labelY = y + 20
          const sublabelY = y + 36
          return (
            <motion.g
              key={mod.label}
              initial={{ opacity: 0, y: 6 }}
              animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.45, ease: EASE, delay: 0.06 + i * 0.09 }
              }
            >
              <rect
                x={x} y={y} width={tileW} height={tileH}
                rx={7}
                fill={mod.color}
                fillOpacity={mod.accent ? 0.9 : 0.18}
                stroke={mod.accent ? "transparent" : "var(--color-shell)"}
                strokeWidth={1}
              />
              {/* Module label */}
              <text
                x={x + 10} y={labelY}
                fontSize={10} fontWeight={700}
                fill={mod.accent ? mod.textColor : "var(--color-deep-sea)"}
                fontFamily="inherit"
              >
                {mod.label}
              </text>
              {/* Sub-label: single line, smaller font, capped to tile width */}
              <text
                x={x + 10} y={sublabelY}
                fontSize={7}
                fill={mod.accent ? mod.textColor : "var(--color-slate)"}
                fillOpacity={mod.accent ? 0.82 : 1}
                fontFamily="inherit"
              >
                {mod.sublabel}
              </text>
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MetaDataVisual — sparkline + bar motif for data analytics
// ─────────────────────────────────────────────────────────────────────────────

function MetaDataVisual() {
  const ref = useRef<SVGSVGElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-40px" })
  const active = !reduce && inView

  const bars = [
    { h: 16, label: "SQL"     },
    { h: 28, label: "Python"  },
    { h: 22, label: "pandas"  },
    { h: 36, label: "Tableau" },
    { h: 20, label: "Stats"   },
    { h: 32, label: "OSEMN"   },
    { h: 26, label: "Viz"     },
    { h: 42, label: "Dash."   },
  ]

  const barW = 26
  const barGap = 10
  const baseY = 76
  const totalW = bars.length * (barW + barGap) - barGap + 20
  const viewW = Math.max(totalW, 340)

  const sparkPts = "8,40 28,30 48,34 68,22 88,26 108,14 128,18 148,8 168,12 188,4"

  const osemn = ["Obtain", "Scrub", "Explore", "Model", "Interpret"]

  return (
    <div aria-hidden="true" className="w-full">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate">
        Data analytics toolkit · in progress
      </p>
      <svg
        ref={ref}
        viewBox={`0 0 ${viewW} 148`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ maxHeight: "170px" }}
      >
        {/* Sparkline at top */}
        <motion.polyline
          points={sparkPts}
          fill="none"
          stroke="var(--color-sea)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            reduce
              ? { pathLength: 1, opacity: 0.5 }
              : inView
              ? { pathLength: 1, opacity: 0.5 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={reduce ? { duration: 0 } : { duration: 1.2, ease: EASE, delay: 0.1 }}
        />
        {/* Trailing dot */}
        <motion.circle
          cx={188} cy={4} r={3}
          fill="var(--color-sea)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: [0, 1, 1, 0.4, 1] } : { opacity: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 1.8, ease: "easeInOut", repeat: Infinity, delay: 1.4 }}
        />

        {/* Baseline */}
        <line x1="8" y1={baseY} x2={viewW - 8} y2={baseY} stroke="var(--color-shell)" strokeWidth={0.8} />

        {/* Bars */}
        {bars.map((bar, i) => {
          const x = 10 + i * (barW + barGap)
          const isHighlight = bar.label === "Tableau" || bar.label === "Dash."
          return (
            <g key={bar.label}>
              <motion.rect
                x={x} y={baseY - bar.h} width={barW} height={bar.h}
                rx={3}
                fill={isHighlight ? "var(--color-sea)" : "var(--color-deep-sea)"}
                fillOpacity={isHighlight ? 0.85 : 0.35}
                initial={{ scaleY: 0 }}
                animate={active ? { scaleY: 1 } : { scaleY: 0 }}
                style={{ transformOrigin: `${x + barW / 2}px ${baseY}px` }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.55, ease: EASE, delay: 0.1 + i * 0.07 }
                }
              />
              <text
                x={x + barW / 2} y={baseY + 12}
                textAnchor="middle" fontSize={7}
                fill="var(--color-slate)" fontFamily="inherit"
              >
                {bar.label}
              </text>
            </g>
          )
        })}

        {/* OSEMN pipeline chips */}
        {osemn.map((step, i) => {
          const chipW = 52
          const chipGap = 4
          const totalChipW = osemn.length * chipW + (osemn.length - 1) * chipGap
          const startX = (viewW - totalChipW) / 2
          const x = startX + i * (chipW + chipGap)
          return (
            <motion.g
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE, delay: 0.3 + i * 0.07 }}
            >
              <rect
                x={x} y={96} width={chipW} height={18}
                rx={5}
                fill="var(--color-golden-hour)"
                fillOpacity={i === 2 ? 0.22 : 0.09}
                stroke="var(--color-golden-hour)"
                strokeOpacity={0.4}
                strokeWidth={0.7}
              />
              <text
                x={x + chipW / 2} y={109}
                textAnchor="middle" fontSize={7.5} fontWeight={i === 2 ? 700 : 400}
                fill="var(--color-deep-sea)" fontFamily="inherit"
              >
                {step}
              </text>
            </motion.g>
          )
        })}

        {/* OSEMN label */}
        <text x={viewW / 2} y={130} textAnchor="middle" fontSize={7} fill="var(--color-slate)" fontFamily="inherit">
          OSEMN analytics workflow
        </text>
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TradingPipelineVisual — compact Signal -> Back-test -> Risk pipeline
// ─────────────────────────────────────────────────────────────────────────────

function TradingPipelineVisual() {
  const ref = useRef<SVGSVGElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-40px" })
  const active = !reduce && inView

  const steps = [
    {
      label: "Signal\nResearch",
      sublabel: "Momentum &\nmean-reversion",
      cx: 56,
      color: "var(--color-shell)",
      textColor: "var(--color-deep-sea)",
      accent: false,
    },
    {
      label: "Walk-Forward\nBack-test",
      sublabel: "Out-of-sample\nvalidation",
      cx: 180,
      color: "var(--color-sea)",
      textColor: "var(--color-linen)",
      accent: true,
    },
    {
      label: "Risk\nManagement",
      sublabel: "Position sizing\nexposure limits",
      cx: 304,
      color: "var(--color-golden-hour)",
      textColor: "var(--color-deep-sea)",
      accent: false,
    },
  ]

  const sparkPts = "8,58 34,50 60,54 86,40 112,44 138,32 164,36 190,22 216,26 242,14 268,18 294,8 320,12 346,4 372,8"

  return (
    <div aria-hidden="true" className="w-full">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate">
        Development pipeline
      </p>
      <svg
        ref={ref}
        viewBox="0 0 380 148"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ maxHeight: "180px" }}
      >
        {/* Connector lines */}
        {[0, 1].map((i) => {
          const fromX = steps[i].cx + 42
          const toX = steps[i + 1].cx - 42
          const midY = 34
          return (
            <motion.g key={`conn-${i}`}
              initial={{ opacity: 0 }}
              animate={active ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.3 + i * 0.18 }}
            >
              <line x1={fromX} y1={midY} x2={toX} y2={midY}
                stroke="var(--color-sea)" strokeWidth={1.5}
                strokeDasharray="5 3" strokeOpacity={0.55}
              />
              <polygon
                points={`${toX},${midY - 4} ${toX + 7},${midY} ${toX},${midY + 4}`}
                fill="var(--color-sea)" fillOpacity={0.55}
              />
            </motion.g>
          )
        })}

        {/* Step boxes */}
        {steps.map((step, i) => (
          <motion.g
            key={step.label}
            initial={{ opacity: 0, y: 8 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.08 + i * 0.16 }}
          >
            <rect
              x={step.cx - 42} y={8} width={84} height={52}
              rx={7}
              fill={step.color}
              fillOpacity={step.accent ? 0.9 : 0.5}
              stroke={step.accent ? "var(--color-sea)" : "var(--color-shell)"}
              strokeWidth={step.accent ? 1.5 : 1}
            />
            {step.label.split("\n").map((line, li) => (
              <text key={li} x={step.cx} y={22 + li * 13}
                textAnchor="middle" fontSize={9.5}
                fontWeight={step.accent ? 700 : 500}
                fill={step.textColor} fontFamily="inherit"
              >
                {line}
              </text>
            ))}
            {step.sublabel.split("\n").map((line, li) => (
              <text key={`sub-${li}`} x={step.cx} y={68 + li * 10}
                textAnchor="middle" fontSize={7}
                fill="var(--color-slate)" fontFamily="inherit"
              >
                {line}
              </text>
            ))}
          </motion.g>
        ))}

        {/* Sparkline */}
        <motion.polyline
          points={sparkPts}
          fill="none"
          stroke="var(--color-sea)"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            reduce
              ? { pathLength: 1, opacity: 0.5 }
              : inView
              ? { pathLength: 1, opacity: 0.5 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={reduce ? { duration: 0 } : { duration: 1.3, ease: EASE, delay: 0.55 }}
          style={{ translateY: 82 }}
        />
        {/* Pulse dot */}
        <motion.circle cx={372} cy={90} r={3}
          fill="var(--color-sea)"
          initial={{ opacity: 0 }}
          animate={
            reduce
              ? { opacity: 1 }
              : inView
              ? { opacity: [0, 1, 1, 0.3, 1] }
              : { opacity: 0 }
          }
          transition={reduce ? { duration: 0 } : { duration: 2, ease: "easeInOut", repeat: Infinity, delay: 2 }}
        />
        {/* Baseline */}
        <line x1="8" y1="98" x2="372" y2="98" stroke="var(--color-shell)" strokeWidth={0.8} />
        <text x="8"   y="110" fontSize={7} fill="var(--color-slate)" fontFamily="inherit">Strategy concept</text>
        <text x="372" y="110" textAnchor="end" fontSize={7} fill="var(--color-slate)" fontFamily="inherit">in development</text>

        {/* Not deployed badge */}
        <rect x="120" y="120" width="140" height="18" rx={5}
          fill="var(--color-deep-sea)" fillOpacity="0.06"
          stroke="var(--color-deep-sea)" strokeOpacity="0.12" strokeWidth="0.8"
        />
        <text x="190" y="133" textAnchor="middle" fontSize={7}
          fill="var(--color-slate)" fontFamily="inherit" fontStyle="italic">
          developing, not deployed
        </text>
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal — reusable in-file mini modal popup
// ─────────────────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean
  onClose: () => void
  titleId: string
  title: ReactNode
  reduce: boolean | null
  children: ReactNode
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

function Modal({ open, onClose, titleId, title, reduce, children, triggerRef }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Body scroll lock
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Focus first focusable element on open; return focus on close
  useEffect(() => {
    if (!open) return
    const el = dialogRef.current
    if (!el) return
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const first = focusable[0]
    if (first) first.focus()

    return () => {
      if (triggerRef.current) triggerRef.current.focus()
    }
  }, [open, triggerRef])

  // Escape key close + focus trap
  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose()
        return
      }
      if (e.key !== "Tab") return
      const el = dialogRef.current
      if (!el) return
      const focusable = Array.from(
        el.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((n) => !n.hasAttribute("disabled"))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-deep-sea) 60%, transparent)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        ...(reduce ? {} : { transition: "none" }),
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-linen p-6 sm:p-8 shadow-xl"
        style={reduce ? {} : { animation: "modalIn 0.18s ease-out both" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={cn(
            "absolute right-4 top-4 rounded-lg p-1.5 text-slate",
            "hover:bg-deep-sea/8 hover:text-deep-sea",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2",
            "transition-colors duration-150",
          )}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Title */}
        <h3
          id={titleId}
          className="mb-5 pr-8 text-lg font-semibold leading-snug tracking-tight text-deep-sea sm:text-xl"
        >
          {title}
        </h3>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Detail content components
// ─────────────────────────────────────────────────────────────────────────────

function CfaDetails() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-deep-sea/75">
      <p>
        Studying for the <span className="font-semibold text-deep-sea">CFA Level 1</span> exam across{" "}
        <span className="font-semibold text-deep-sea">10</span> topic areas,{" "}
        <span className="font-semibold text-deep-sea">180</span> multiple-choice questions across two
        computer-based sessions. November <span className="font-semibold text-deep-sea">2026</span> sitting target.
      </p>
      <p>
        <span className="font-semibold text-deep-sea">Ethics and Professional Standards (15–20%)</span> carries
        the highest weight, covering the Standards of Professional Conduct and Global Investment Performance
        Standards that underpin every area of investment practice.
      </p>
      <p>
        <span className="font-semibold text-deep-sea">Financial Statement Analysis (11–14%)</span> teaches how
        to read and adjust income statements, balance sheets, and cash-flow statements to see through accounting
        choices to economic reality.{" "}
        <span className="font-semibold text-deep-sea">Equity Investments</span> and{" "}
        <span className="font-semibold text-deep-sea">Fixed Income</span> (each 11–14%) cover valuation
        frameworks, DDM, free-cash-flow models, bond pricing, duration, and credit analysis, concepts that
        connect directly to my LBO and DCF project work.
      </p>
      <p>
        <span className="font-semibold text-deep-sea">Quantitative Methods (6–9%)</span> grounds everything in
        probability, regression, and time-series concepts that are equally central to systematic trading research.
      </p>
      <div className="mt-2">
        <CfaTopicBarsVisual />
      </div>
    </div>
  )
}

function BmcDetails() {
  const modules = [
    {
      name: "Economics",
      desc: "Monetary and fiscal policy, GDP, inflation, and how central bank decisions move markets.",
    },
    {
      name: "Currencies",
      desc: "FX rate mechanics, purchasing power parity, carry trade, and currency risk in portfolios.",
    },
    {
      name: "Fixed Income",
      desc: "Bond pricing, yield curve dynamics, duration, credit spread, and sovereign vs corporate debt.",
    },
    {
      name: "Equities",
      desc: "Equity valuation, P/E and relative-value analysis, and how fundamentals drive price discovery.",
    },
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-deep-sea/75">
        Working through the Bloomberg Market Concepts self-paced e-learning programme, covering terminal
        functions and market structure across four core areas:
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {modules.map((mod) => (
          <div key={mod.name} className="rounded-xl border border-deep-sea/10 bg-sand/60 p-4">
            <p className="text-xs font-semibold text-deep-sea">{mod.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate">{mod.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function MetaDetails() {
  const areas = [
    { label: "SQL", desc: "Querying, filtering and aggregating structured datasets." },
    { label: "Python / pandas", desc: "EDA, data cleaning, transformation and visualisation workflows." },
    { label: "Tableau", desc: "Dashboard design and data storytelling, 3 dashboards built." },
    { label: "Statistics", desc: "Hypothesis testing, regression, and interpreting analytical outputs." },
    { label: "OSEMN workflow", desc: "Obtain, Scrub, Explore, Model, Interpret -- end-to-end analytics." },
    { label: "Data governance", desc: "Data validation, quality checks, and reporting best practice." },
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-deep-sea/75">
        Completing the Meta Data Analyst Professional Certificate, building end-to-end data analytics capability:
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {areas.map((a) => (
          <div key={a.label} className="rounded-xl border border-deep-sea/10 bg-sand/60 p-3">
            <p className="text-xs font-semibold text-deep-sea">{a.label}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate">{a.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <MetaDataVisual />
      </div>
    </div>
  )
}

function TradingDetails() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-deep-sea/75">
      <p>
        Building a rules-based, Python-driven strategy from the ground up across three stages.
        The first stage is <span className="font-semibold text-deep-sea">signal research</span>:
        studying how momentum indicators (trend-following based on price persistence) and
        mean-reversion signals (identifying over-extended moves via Z-scores and moving-average bands)
        behave across different market regimes, using{" "}
        <span className="font-semibold text-deep-sea">pandas</span> and{" "}
        <span className="font-semibold text-deep-sea">NumPy</span> to construct and test them on
        historical price data.
      </p>
      <p>
        The second stage is{" "}
        <span className="font-semibold text-deep-sea">walk-forward back-testing</span>:
        dividing data into rolling in-sample windows to fit parameters and out-of-sample windows to
        validate, avoiding look-ahead bias and over-fitting. The third stage applies a{" "}
        <span className="font-semibold text-deep-sea">risk management</span> lens: position sizing
        based on signal confidence, gross and net exposure limits, and per-trade loss constraints.
      </p>
      <p className="text-xs italic text-slate">
        Independent work in progress. No performance figures, alpha, returns, Sharpe ratio, or drawdown
        claimed -- developing, not deployed.
      </p>
      <div className="mt-2">
        <TradingPipelineVisual />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NowCard — one bento card (large or small)
// ─────────────────────────────────────────────────────────────────────────────

interface NowCardProps {
  badge: string
  statusLabel: string
  icon: ReactNode
  title: ReactNode
  titlePlain: string
  shortDesc: ReactNode
  visual: ReactNode
  details: ReactNode
  reduce: boolean | null
}

function NowCard({
  badge,
  statusLabel,
  icon,
  title,
  titlePlain,
  shortDesc,
  visual,
  details,
  reduce,
}: NowCardProps) {
  const [open, setOpen] = useState(false)
  const titleId = useId()
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  return (
    <>
      <div className="flex h-full flex-col rounded-2xl border border-deep-sea/10 bg-linen overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-sea/30 hover:shadow-sm">
        {/* Visual */}
        <div className="flex items-center justify-center border-b border-deep-sea/8 bg-sand/40 p-4">
          {visual}
        </div>

        {/* Text content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Eyebrow + status */}
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-sea">
              {badge}
            </p>
            <span className="rounded bg-deep-sea/6 px-2 py-0.5 text-[10px] font-medium text-slate">
              {statusLabel}
            </span>
            <PulsingDot reduce={reduce} />
          </div>

          {/* Title */}
          <div className="mt-3 flex items-start gap-2">
            <span className="mt-0.5 shrink-0 text-sea" aria-hidden="true">{icon}</span>
            <h3 className="text-base font-semibold leading-snug tracking-tight text-deep-sea sm:text-lg">
              {title}
            </h3>
          </div>

          {/* Short description */}
          <p className="mt-2 text-sm leading-relaxed text-deep-sea/75">
            {shortDesc}
          </p>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Find out more button */}
          <button
            ref={triggerRef}
            type="button"
            onClick={handleOpen}
            aria-haspopup="dialog"
            className={cn(
              "mt-4 self-start flex items-center gap-1.5 rounded-lg border px-3 py-1.5",
              "text-xs font-medium transition-colors duration-150",
              "border-deep-sea/15 bg-transparent text-deep-sea/70",
              "hover:border-sea/40 hover:text-sea",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2",
            )}
          >
            <span>Find out more</span>
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        titleId={titleId}
        title={titlePlain}
        reduce={reduce}
        triggerRef={triggerRef}
      >
        {details}
      </Modal>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Now section -- main export
// ─────────────────────────────────────────────────────────────────────────────

export function Now() {
  const headingId = "what-i-m-working-on-right-now"
  const reduce = useReducedMotion()

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes nowping {
            0%   { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(2.8); opacity: 0; }
          }
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.96) translateY(6px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        }
      `}</style>

      <Section id="now" className="bg-sand" aria-labelledby={headingId}>
        <div className="space-y-10">

          {/* Section heading */}
          <Reveal>
            <SectionHeading
              eyebrow="Currently building"
              title="What I'm working on right now"
              lead="Developing quantitative and analytical skills outside the classroom, systematically."
            />
          </Reveal>

          {/*
            Bento grid:
              lg: 3 columns
              Row 1: BMC (1 col) | CFA (2 cols)
              Row 2: Meta (2 cols) | Trading (1 col)
          */}
          <Reveal delay={0.04}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* Row 1, col 1 -- BMC (small) */}
              <div className="sm:col-span-1 lg:col-span-1">
                <NowCard
                  reduce={reduce}
                  badge="Bloomberg · BMC"
                  statusLabel="working through"
                  icon={<BarChart2 className="h-5 w-5" />}
                  title="Bloomberg Market Concepts"
                  titlePlain="Bloomberg Market Concepts (BMC)"
                  shortDesc={
                    <>
                      Working through Bloomberg Market Concepts: terminal functions across{" "}
                      <span className="font-semibold text-deep-sea">Economics</span>,{" "}
                      <span className="font-semibold text-deep-sea">Currencies</span>,{" "}
                      <span className="font-semibold text-deep-sea">Fixed Income</span> and{" "}
                      <span className="font-semibold text-deep-sea">Equities</span>.
                    </>
                  }
                  visual={<BmcModuleVisual />}
                  details={<BmcDetails />}
                />
              </div>

              {/* Row 1, cols 2–3 -- CFA (large/wide) */}
              <div className="sm:col-span-1 lg:col-span-2">
                <NowCard
                  reduce={reduce}
                  badge="CFA Institute · Level 1"
                  statusLabel="currently studying"
                  icon={<GraduationCap className="h-5 w-5" />}
                  title={
                    <>
                      CFA Level 1 candidate{" "}
                      <span className="whitespace-nowrap text-golden-hour">(November 2026)</span>
                    </>
                  }
                  titlePlain="CFA Level 1 candidate (November 2026)"
                  shortDesc={
                    <>
                      Studying across{" "}
                      <span className="font-semibold text-deep-sea">10</span> topic areas, from
                      ethics and financial statement analysis to equities, fixed income and
                      derivatives.{" "}
                      <span className="font-semibold text-deep-sea">180</span> questions,{" "}
                      <span className="font-semibold text-deep-sea">November 2026</span> sitting.
                    </>
                  }
                  visual={<CfaTopicBarsVisual />}
                  details={<CfaDetails />}
                />
              </div>

              {/* Row 2, cols 1–2 -- Meta (large/wide) */}
              <div className="sm:col-span-2 lg:col-span-2">
                <NowCard
                  reduce={reduce}
                  badge="Meta · Coursera"
                  statusLabel="completing"
                  icon={<BookOpen className="h-5 w-5" />}
                  title="Meta Data Analyst Professional Certificate"
                  titlePlain="Meta Data Analyst Professional Certificate"
                  shortDesc={
                    <>
                      Completing the Meta Data Analyst certificate:{" "}
                      <span className="font-semibold text-deep-sea">SQL</span>,{" "}
                      <span className="font-semibold text-deep-sea">Python</span>,{" "}
                      <span className="font-semibold text-deep-sea">pandas</span>,{" "}
                      <span className="font-semibold text-deep-sea">Tableau</span> and the{" "}
                      <span className="font-semibold text-deep-sea">OSEMN</span> analytics workflow.
                    </>
                  }
                  visual={<MetaDataVisual />}
                  details={<MetaDetails />}
                />
              </div>

              {/* Row 2, col 3 -- Trading (small) */}
              <div className="sm:col-span-2 lg:col-span-1">
                <NowCard
                  reduce={reduce}
                  badge="Systematic strategy · Python"
                  statusLabel="in development"
                  icon={<Cpu className="h-5 w-5" />}
                  title="Systematic trading strategy"
                  titlePlain="Systematic trading strategy"
                  shortDesc={
                    <>
                      Building a Python systematic strategy from signal research to back-testing and
                      risk management.{" "}
                      <span className="italic text-slate/80">Developing, not deployed.</span>
                    </>
                  }
                  visual={<TradingPipelineVisual />}
                  details={<TradingDetails />}
                />
              </div>

            </div>
          </Reveal>

        </div>
      </Section>
    </>
  )
}
