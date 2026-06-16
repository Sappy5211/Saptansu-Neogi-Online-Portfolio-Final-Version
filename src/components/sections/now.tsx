/**
 * now.tsx, Currently building section
 *
 * Two rich cards matching the Projects visual language:
 *   1. Systematic trading strategy (in development), pipeline visual + caveat
 *   2. CFA Level 1 candidate (November 2026), topic area chip grid
 *
 * Style: rounded-2xl bg-linen cards on bg-sand, eyebrow label, title, context,
 * restrained SVG visuals. Responsive 1-col → 2-col. Reduced-motion safe. AA contrast.
 */

import { useRef } from "react"
import { Cpu, GraduationCap } from "lucide-react"
import { motion, useReducedMotion, useInView } from "motion/react"

import { Section, SectionHeading } from "@/components/ui/section"
import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"
import { EASE } from "@/lib/motion"

// ---------------------------------------------------------------------------
// CFA Level 1 topic areas, 2026 curriculum (10 topics with exam weight bands)
// ---------------------------------------------------------------------------

interface CfaTopic {
  name: string
  weight: string
  /** Relative visual prominence 1–3 */
  tier: 1 | 2 | 3
}

const CFA_TOPICS: CfaTopic[] = [
  { name: "Ethics & Professional Standards", weight: "15–20%", tier: 1 },
  { name: "Financial Statement Analysis",    weight: "11–14%", tier: 1 },
  { name: "Equity Investments",              weight: "11–14%", tier: 1 },
  { name: "Fixed Income",                    weight: "11–14%", tier: 1 },
  { name: "Portfolio Management",            weight: "8–12%",  tier: 2 },
  { name: "Alternative Investments",         weight: "7–10%",  tier: 2 },
  { name: "Quantitative Methods",            weight: "6–9%",   tier: 2 },
  { name: "Economics",                       weight: "6–9%",   tier: 2 },
  { name: "Corporate Issuers",               weight: "6–9%",   tier: 2 },
  { name: "Derivatives",                     weight: "5–8%",   tier: 3 },
]

// ---------------------------------------------------------------------------
// TradingPipelineVisual, Signal → Back-test → Risk eval pipeline diagram
// ---------------------------------------------------------------------------

function TradingPipelineVisual() {
  const ref = useRef<SVGSVGElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-40px" })

  const steps = [
    { label: "Signal\nresearch", sublabel: "Python · pandas", x: 12 },
    { label: "Back-\ntesting",   sublabel: "Historical data",  x: 52 },
    { label: "Risk\neval",       sublabel: "Walk-forward",     x: 92 },
  ]

  // A small sparkline motif below the pipeline
  const sparkPts = "4,32 10,28 16,30 22,22 28,24 34,18 40,20 46,14 52,16 58,10 64,12"

  return (
    <div className="flex flex-col gap-2 mt-5" aria-hidden="true">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate">
        Development pipeline
      </p>
      <svg
        ref={ref}
        viewBox="0 0 130 80"
        className="w-full max-w-[9rem]"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Step boxes */}
        {steps.map((step, i) => (
          <motion.g
            key={step.label}
            initial={{ opacity: 0, y: 6 }}
            animate={
              reduce
                ? { opacity: 1, y: 0 }
                : inView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 6 }
            }
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.5, ease: EASE, delay: 0.1 + i * 0.15 }
            }
          >
            <rect
              x={step.x - 8}
              y={2}
              width={28}
              height={26}
              rx={4}
              fill={i === 2 ? "var(--color-sea)" : "var(--color-shell)"}
              fillOpacity={i === 2 ? 0.2 : 0.9}
              stroke={i === 2 ? "var(--color-sea)" : "var(--color-shell)"}
              strokeWidth={i === 2 ? 1.2 : 0.8}
            />
            {step.label.split("\n").map((line, li) => (
              <text
                key={li}
                x={step.x + 6}
                y={11 + li * 8}
                textAnchor="middle"
                fontSize={6.5}
                fontWeight={i === 2 ? 600 : 400}
                fill={i === 2 ? "var(--color-sea)" : "var(--color-deep-sea)"}
                fontFamily="inherit"
              >
                {line}
              </text>
            ))}
            <text
              x={step.x + 6}
              y={36}
              textAnchor="middle"
              fontSize={5.5}
              fill="var(--color-slate)"
              fontFamily="inherit"
            >
              {step.sublabel}
            </text>
          </motion.g>
        ))}

        {/* Connector arrows between boxes */}
        {[0, 1].map((i) => (
          <motion.g
            key={`arrow-${i}`}
            initial={{ opacity: 0 }}
            animate={
              reduce
                ? { opacity: 1 }
                : inView
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.3, ease: EASE, delay: 0.3 + i * 0.15 }
            }
          >
            <line
              x1={steps[i].x + 22}
              y1={15}
              x2={steps[i + 1].x - 8}
              y2={15}
              stroke="var(--color-sea)"
              strokeWidth={1}
              strokeDasharray="3 2"
              strokeOpacity={0.5}
            />
            <polygon
              points={`${steps[i + 1].x - 8},13 ${steps[i + 1].x - 5},15 ${steps[i + 1].x - 8},17`}
              fill="var(--color-sea)"
              fillOpacity={0.5}
            />
          </motion.g>
        ))}

        {/* Sparkline, "in progress" motif */}
        <motion.polyline
          points={sparkPts}
          fill="none"
          stroke="var(--color-sea)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            reduce
              ? { pathLength: 1, opacity: 0.6 }
              : inView
              ? { pathLength: 1, opacity: 0.6 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 1.1, ease: EASE, delay: 0.5 }
          }
          style={{ translateY: 38 }}
        />

        {/* Trailing dot, "in progress" */}
        <motion.circle
          cx={64}
          cy={50}
          r={2.5}
          fill="var(--color-sea)"
          initial={{ opacity: 0 }}
          animate={
            reduce
              ? { opacity: 1 }
              : inView
              ? { opacity: [0, 1, 1, 0.3, 1] }
              : { opacity: 0 }
          }
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 2, ease: "easeInOut", repeat: Infinity, delay: 1.6 }
          }
        />

        {/* Baseline */}
        <line
          x1="4"
          y1="72"
          x2="70"
          y2="72"
          stroke="var(--color-shell)"
          strokeWidth={0.8}
        />
        <text
          x={4}
          y={79}
          fontSize={5.5}
          fill="var(--color-slate)"
          fontFamily="inherit"
        >
          developing
        </text>
      </svg>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CfaTopicsVisual, chip grid of all 10 topic areas with weight labels
// ---------------------------------------------------------------------------

function CfaTopicsVisual() {
  return (
    <div className="mt-5" aria-hidden="true">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate mb-3">
        10 topic areas · 180 questions
      </p>
      <div className="flex flex-wrap gap-1.5">
        {CFA_TOPICS.map((topic) => (
          <span
            key={topic.name}
            className={cn(
              "inline-flex flex-col rounded-lg px-2 py-1 text-[10px] leading-tight",
              topic.tier === 1
                ? "bg-sea/10 text-sea font-medium"
                : topic.tier === 2
                ? "bg-deep-sea/6 text-deep-sea/80"
                : "bg-shell/60 text-slate",
            )}
          >
            <span>{topic.name}</span>
            <span
              className={cn(
                "mt-0.5 tabular-nums font-semibold",
                topic.tier === 1 ? "text-sea" : "text-deep-sea/50",
              )}
            >
              {topic.weight}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// PulsingDot, "in development" indicator; static under reduced-motion
// ---------------------------------------------------------------------------

function PulsingDot({ reduce }: { reduce: boolean | null }) {
  return (
    <div className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
      {!reduce && (
        <span
          className="absolute inline-flex h-full w-full rounded-full bg-sea opacity-60"
          style={{ animation: "nowping 1.8s ease-out infinite" }}
        />
      )}
      <span className="relative inline-flex h-2 w-2 rounded-full bg-sea" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Now section
// ---------------------------------------------------------------------------

export function Now() {
  const headingId = "what-i-m-working-on-right-now"
  const reduce = useReducedMotion()

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes nowping {
            0%   { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(2.5); opacity: 0; }
          }
          @keyframes nowspin {
            to { transform: rotate(360deg); }
          }
        }
      `}</style>

      <Section id="now" className="bg-sand" aria-labelledby={headingId}>
        <div className="space-y-12">
          <Reveal>
            <SectionHeading
              eyebrow="Currently building"
              title="What I'm working on right now"
              lead="Developing quantitative and analytical skills outside the classroom, systematically."
            />
          </Reveal>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2">
            {/* ── Card 1: Systematic trading strategy ── */}
            <Reveal delay={0.06}>
              {!reduce ? (
                /* Animated conic-gradient border */
                <div className="relative rounded-2xl p-[1.5px] overflow-hidden h-full">
                  <span
                    className="absolute inset-[-100%]"
                    style={{
                      background:
                        "conic-gradient(from 0deg, #2b7a8c, #bfe0e8, #d9a441, #2b7a8c)",
                      animation: "nowspin 7s linear infinite",
                    }}
                    aria-hidden="true"
                  />
                  <div
                    className={cn(
                      "relative h-full rounded-2xl bg-linen p-6 sm:p-8",
                      "flex flex-col",
                    )}
                  >
                    <TradingCardContent reduce={reduce} />
                  </div>
                </div>
              ) : (
                /* Static border under reduced-motion */
                <div
                  className={cn(
                    "h-full rounded-2xl border border-sea/40 bg-linen p-6 sm:p-8",
                    "flex flex-col",
                  )}
                >
                  <TradingCardContent reduce={reduce} />
                </div>
              )}
            </Reveal>

            {/* ── Card 2: CFA Level 1 ── */}
            <Reveal delay={0.12}>
              <div
                className={cn(
                  "h-full rounded-2xl border border-deep-sea/10 bg-linen p-6 sm:p-8",
                  "flex flex-col",
                  "transition-[box-shadow,border-color] duration-300 hover:border-deep-sea/20 hover:shadow-sm",
                )}
              >
                <CfaCardContent />
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  )
}

// ---------------------------------------------------------------------------
// TradingCardContent, extracted so it renders inside both border variants
// ---------------------------------------------------------------------------

function TradingCardContent({ reduce }: { reduce: boolean | null }) {
  return (
    <>
      {/* Eyebrow */}
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-sea mb-4">
        Systematic strategy · Python
      </p>

      {/* Title row + in-development badge */}
      <div className="flex flex-wrap items-start gap-x-3 gap-y-1 mb-4">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 shrink-0 text-sea" aria-hidden="true" />
          <h3 className="text-lg font-semibold tracking-tight text-deep-sea">
            Systematic trading strategy
          </h3>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="rounded bg-deep-sea/6 px-2 py-0.5 text-xs font-medium text-slate">
            in development
          </span>
          <PulsingDot reduce={reduce} />
        </div>
      </div>

      {/* Context */}
      <p className="text-sm leading-relaxed text-deep-sea/75">
        Building a rules-based, Python-driven strategy from scratch, starting with signal
        research (momentum and mean-reversion indicators using{" "}
        <span className="font-semibold text-deep-sea">pandas</span> and{" "}
        <span className="font-semibold text-deep-sea">NumPy</span>), running walk-forward
        back-tests on historical price data, and evaluating outputs through a risk-management
        lens covering position sizing, exposure limits, and loss constraints.
      </p>

      {/* Caveat, required per spec */}
      <p className="mt-3 text-xs italic text-slate">
        Independent work in progress. No performance figures, alpha, or risk-adjusted
        returns claimed, developing, not deployed.
      </p>

      {/* Pipeline visual */}
      <div className="mt-auto">
        <TradingPipelineVisual />
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// CfaCardContent, extracted for clarity
// ---------------------------------------------------------------------------

function CfaCardContent() {
  return (
    <>
      {/* Eyebrow */}
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-sea mb-4">
        CFA Institute · Level 1
      </p>

      {/* Title row */}
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="h-5 w-5 shrink-0 text-sea" aria-hidden="true" />
        <h3 className="text-lg font-semibold tracking-tight text-deep-sea">
          CFA Level 1 candidate{" "}
          <span className="font-semibold text-deep-sea">(November 2026)</span>
        </h3>
      </div>

      {/* Context */}
      <p className="text-sm leading-relaxed text-deep-sea/75">
        Studying across all{" "}
        <span className="font-semibold text-deep-sea">10</span> curriculum topic areas of
        the 2026 CFA Level 1 exam,{" "}
        <span className="font-semibold text-deep-sea">180</span> questions across two
        computer-based sessions. Ethics carries the highest weight at{" "}
        <span className="font-semibold text-deep-sea">15–20%</span>; Financial Statement
        Analysis, Equity Investments, and Fixed Income each contribute{" "}
        <span className="font-semibold text-deep-sea">11–14%</span>.
      </p>

      {/* Topic chip grid */}
      <div className="mt-auto">
        <CfaTopicsVisual />
      </div>
    </>
  )
}
