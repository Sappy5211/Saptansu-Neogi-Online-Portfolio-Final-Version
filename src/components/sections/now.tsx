/**
 * now.tsx — Currently building section
 *
 * Two large Casestudies-style banner rows:
 *   Row 1 (visual left, text right on lg): Systematic trading strategy
 *   Row 2 (text left, visual right on lg): CFA Level 1 candidate (Nov 2026)
 *
 * Layout mirrors the Projects case-study visual language — big SVG hero on
 * one side, heading + learning paragraph + highlights column on the other.
 * Visuals are substantially larger than the previous compact card incarnation.
 *
 * Style: bg-sand section, bg-linen banners, coastal palette.
 * Animations: motion/react, bounce Reveal, reduced-motion safe, no new deps.
 * Responsive: 1-col stacked → lg 2-col side-by-side, no overflow 320–1440px.
 *
 * Research sources (Firecrawl, June 2026):
 *   CFA L1 weights: soleadea.org/cfa-level-1/topic-weights
 *   CFA curriculum: finance.uworld.com/cfa/level-1-topics/
 *   Systematic trading: quantinsti.com/articles/systematic-trading/
 *   Walk-forward & risk mgmt: stoic.ai/blog/backtesting-trading-strategies/
 */

import { useRef } from "react"
import { Cpu, GraduationCap } from "lucide-react"
import { motion, useReducedMotion, useInView } from "motion/react"

import { Section, SectionHeading } from "@/components/ui/section"
import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"
import { EASE } from "@/lib/motion"

// ─────────────────────────────────────────────────────────────────────────────
// CFA topic data (2026 curriculum, 10 topics, 180 questions)
// ─────────────────────────────────────────────────────────────────────────────

interface CfaTopic {
  name: string
  weight: string
  /** Midpoint of weight range, used for visual bar width (%) */
  mid: number
  /** 1 = highest tier, 2 = mid, 3 = lower */
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
// PulsingDot — "in development" live indicator; static under reduced-motion
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
// TradingPipelineVisual — large hero SVG for the trading banner
// Signal → Back-test → Risk pipeline + animated sparkline
// ─────────────────────────────────────────────────────────────────────────────

function TradingPipelineVisual() {
  const ref = useRef<SVGSVGElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-40px" })

  const active = !reduce && inView

  // Pipeline steps — wider spacing for the larger visual
  const steps = [
    {
      label: "Signal\nResearch",
      sublabel: "Momentum & mean-reversion\nindicators · pandas · NumPy",
      cx: 60,
      color: "var(--color-shell)",
      textColor: "var(--color-deep-sea)",
      accent: false,
    },
    {
      label: "Walk-Forward\nBack-test",
      sublabel: "Historical price data\nout-of-sample validation",
      cx: 200,
      color: "var(--color-sea)",
      textColor: "var(--color-linen)",
      accent: true,
    },
    {
      label: "Risk\nManagement",
      sublabel: "Position sizing · exposure\nlimits · loss constraints",
      cx: 340,
      color: "var(--color-golden-hour)",
      textColor: "var(--color-deep-sea)",
      accent: false,
    },
  ]

  // Sparkline points scaled to full-width visual
  const sparkPts = "8,62 34,52 60,56 86,42 112,46 138,34 164,38 190,24 216,28 242,16 268,20 294,10 320,14 346,6 372,10"

  return (
    <div aria-hidden="true" className="w-full">
      <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-slate">
        Development pipeline
      </p>
      <svg
        ref={ref}
        viewBox="0 0 400 160"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ maxHeight: "220px" }}
      >
        {/* ── Connector lines ── */}
        {[0, 1].map((i) => {
          const fromX = steps[i].cx + 44
          const toX = steps[i + 1].cx - 44
          const midY = 38
          return (
            <motion.g key={`conn-${i}`}
              initial={{ opacity: 0 }}
              animate={active ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.3 + i * 0.18 }}
            >
              <line
                x1={fromX} y1={midY}
                x2={toX}   y2={midY}
                stroke="var(--color-sea)"
                strokeWidth={1.5}
                strokeDasharray="5 3"
                strokeOpacity={0.55}
              />
              {/* Arrowhead */}
              <polygon
                points={`${toX},${midY - 4} ${toX + 7},${midY} ${toX},${midY + 4}`}
                fill="var(--color-sea)"
                fillOpacity={0.55}
              />
            </motion.g>
          )
        })}

        {/* ── Step boxes ── */}
        {steps.map((step, i) => (
          <motion.g
            key={step.label}
            initial={{ opacity: 0, y: 10 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.08 + i * 0.18 }}
          >
            {/* Box */}
            <rect
              x={step.cx - 44}
              y={8}
              width={88}
              height={60}
              rx={8}
              fill={step.color}
              fillOpacity={step.accent ? 0.9 : 0.55}
              stroke={step.accent ? "var(--color-sea)" : "var(--color-shell)"}
              strokeWidth={step.accent ? 1.5 : 1}
            />
            {/* Label */}
            {step.label.split("\n").map((line, li) => (
              <text
                key={li}
                x={step.cx}
                y={26 + li * 14}
                textAnchor="middle"
                fontSize={10}
                fontWeight={step.accent ? 700 : 500}
                fill={step.textColor}
                fontFamily="inherit"
              >
                {line}
              </text>
            ))}
            {/* Sublabel */}
            {step.sublabel.split("\n").map((line, li) => (
              <text
                key={`sub-${li}`}
                x={step.cx}
                y={76 + li * 11}
                textAnchor="middle"
                fontSize={7.5}
                fill="var(--color-slate)"
                fontFamily="inherit"
              >
                {line}
              </text>
            ))}
          </motion.g>
        ))}

        {/* ── Animated sparkline, "in progress" motif ── */}
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
          transition={reduce ? { duration: 0 } : { duration: 1.4, ease: EASE, delay: 0.6 }}
          style={{ translateY: 88 }}
        />

        {/* Trailing "pulse" dot at right end of sparkline */}
        <motion.circle
          cx={372}
          cy={98}
          r={3.5}
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
              : { duration: 2, ease: "easeInOut", repeat: Infinity, delay: 2 }
          }
        />

        {/* Baseline rule */}
        <line x1="8" y1="108" x2="390" y2="108" stroke="var(--color-shell)" strokeWidth={0.8} />

        {/* Axis labels */}
        <text x="8"   y="120" fontSize={7.5} fill="var(--color-slate)" fontFamily="inherit">Strategy concept</text>
        <text x="390" y="120" textAnchor="end" fontSize={7.5} fill="var(--color-slate)" fontFamily="inherit">→ in development</text>

        {/* "Not deployed" badge */}
        <rect x="130" y="130" width="140" height="20" rx="6"
          fill="var(--color-deep-sea)" fillOpacity="0.06"
          stroke="var(--color-deep-sea)" strokeOpacity="0.12" strokeWidth="0.8"
        />
        <text x="200" y="144" textAnchor="middle" fontSize={7.5}
          fill="var(--color-slate)" fontFamily="inherit" fontStyle="italic">
          developing · not deployed
        </text>
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CfaTopicBarsVisual — large bar chart of all 10 CFA topics by exam weight
// ─────────────────────────────────────────────────────────────────────────────

function CfaTopicBarsVisual() {
  const ref = useRef<SVGSVGElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-40px" })

  const active = !reduce && inView

  // SVG layout constants
  const W = 400
  const labelW = 152
  const barAreaW = W - labelW - 16
  const rowH = 24
  const gap = 5
  const totalH = CFA_TOPICS.length * (rowH + gap)
  const maxMid = 17.5 // Ethics, used to normalise bar widths

  const tierColor = (tier: 1 | 2 | 3) =>
    tier === 1
      ? "var(--color-sea)"
      : tier === 2
      ? "var(--color-deep-sea)"
      : "var(--color-slate)"

  const tierFillOpacity = (tier: 1 | 2 | 3) =>
    tier === 1 ? 0.85 : tier === 2 ? 0.55 : 0.32

  return (
    <div aria-hidden="true" className="w-full">
      <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-slate">
        2026 exam topic weights · 10 areas
      </p>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${totalH + 8}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ maxHeight: "320px" }}
      >
        {CFA_TOPICS.map((topic, i) => {
          const y = i * (rowH + gap)
          const barW = (topic.mid / maxMid) * barAreaW
          const x0 = labelW

          return (
            <g key={topic.name}>
              {/* Topic label */}
              <text
                x={labelW - 8}
                y={y + rowH / 2 + 4}
                textAnchor="end"
                fontSize={8.5}
                fontWeight={topic.tier === 1 ? 600 : 400}
                fill={topic.tier === 1 ? "var(--color-deep-sea)" : "var(--color-slate)"}
                fontFamily="inherit"
              >
                {topic.name}
              </text>

              {/* Bar track */}
              <rect
                x={x0}
                y={y + 4}
                width={barAreaW}
                height={rowH - 8}
                rx={3}
                fill="var(--color-shell)"
                fillOpacity={0.5}
              />

              {/* Animated bar fill */}
              <motion.rect
                x={x0}
                y={y + 4}
                width={barW}
                height={rowH - 8}
                rx={3}
                fill={tierColor(topic.tier)}
                fillOpacity={tierFillOpacity(topic.tier)}
                initial={{ scaleX: 0 }}
                animate={active ? { scaleX: 1 } : { scaleX: 0 }}
                style={{ transformOrigin: `${x0}px ${y + rowH / 2}px` }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.65, ease: EASE, delay: 0.06 + i * 0.06 }
                }
              />

              {/* Weight label at right of bar */}
              <text
                x={x0 + barW + 5}
                y={y + rowH / 2 + 4}
                fontSize={8}
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
// HighlightItem — a single highlights/process stat in the sidebar column
// ─────────────────────────────────────────────────────────────────────────────

interface HighlightItemProps {
  figure: string
  label: string
  /** When true, figure renders in golden-hour (hero number). */
  hero?: boolean
}

function HighlightItem({ figure, label, hero = false }: HighlightItemProps) {
  return (
    <div className="flex flex-col gap-0.5 py-3 border-b border-deep-sea/8 last:border-0">
      <span
        className={cn(
          "text-xl font-semibold tabular-nums leading-none tracking-tight",
          hero ? "text-golden-hour" : "text-deep-sea",
        )}
      >
        {figure}
      </span>
      <span className="text-xs leading-snug text-slate">{label}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Now section — main export
// ─────────────────────────────────────────────────────────────────────────────

export function Now() {
  const headingId = "what-i-m-working-on-right-now"
  const reduce = useReducedMotion()

  return (
    <>
      {/* Keyframe animations, gated on media query for reduced-motion safety */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes nowping {
            0%   { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(2.8); opacity: 0; }
          }
          @keyframes nowspin {
            to { transform: rotate(360deg); }
          }
        }
      `}</style>

      <Section id="now" className="bg-sand" aria-labelledby={headingId}>
        <div className="space-y-14">

          {/* ── Section heading ── */}
          <Reveal>
            <SectionHeading
              eyebrow="Currently building"
              title="What I'm working on right now"
              lead="Developing quantitative and analytical skills outside the classroom, systematically."
            />
          </Reveal>

          {/* ════════════════════════════════════════════════════════════════
              Banner Row 1, Systematic trading strategy
              Visual LEFT on lg, text RIGHT
          ════════════════════════════════════════════════════════════════ */}
          <Reveal delay={0.06}>
            {/* Animated conic-gradient border ring */}
            <div className="relative rounded-2xl p-[1.5px] overflow-hidden">
              {!reduce && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[-100%]"
                  style={{
                    background: "conic-gradient(from 0deg, #2b7a8c, #bfe0e8, #d9a441, #2b7a8c)",
                    animation: "nowspin 8s linear infinite",
                  }}
                />
              )}
              {/* Banner inner */}
              <div className={cn(
                "relative rounded-2xl bg-linen",
                reduce && "border border-sea/30",
              )}>
                <div className={cn(
                  "grid grid-cols-1 gap-0",
                  "lg:grid-cols-[1fr_auto]",
                )}>

                  {/* ── LEFT: large visual ── */}
                  <div className={cn(
                    "flex items-start p-6 sm:p-8 lg:p-10",
                    "border-b border-deep-sea/8 lg:border-b-0 lg:border-r",
                  )}>
                    <TradingPipelineVisual />
                  </div>

                  {/* ── RIGHT: text + highlights ── */}
                  <div className="flex flex-col gap-6 p-6 sm:p-8 lg:p-10 lg:w-80 xl:w-96">

                    {/* Eyebrow + status badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-sea">
                        Systematic strategy · Python
                      </p>
                      <span className="rounded bg-deep-sea/6 px-2 py-0.5 text-[10px] font-medium text-slate">
                        in development
                      </span>
                      <PulsingDot reduce={reduce} />
                    </div>

                    {/* Title */}
                    <div className="flex items-start gap-2.5">
                      <Cpu className="mt-0.5 h-5 w-5 shrink-0 text-sea" aria-hidden="true" />
                      <h3 className="text-xl font-semibold leading-snug tracking-tight text-deep-sea sm:text-2xl">
                        Systematic trading strategy
                      </h3>
                    </div>

                    {/* What I'm learning paragraph */}
                    <p className="text-sm leading-relaxed text-deep-sea/75">
                      Building a rules-based, Python-driven strategy from the ground up.
                      The first stage is <span className="font-semibold text-deep-sea">signal research</span>,
                      studying how momentum indicators (trend-following based on price persistence)
                      and mean-reversion signals (identifying over-extended moves via Z-scores and
                      moving-average bands) behave across different market regimes, using{" "}
                      <span className="font-semibold text-deep-sea">pandas</span> and{" "}
                      <span className="font-semibold text-deep-sea">NumPy</span> to construct
                      and test them on historical price data.
                    </p>
                    <p className="text-sm leading-relaxed text-deep-sea/75">
                      The second stage is <span className="font-semibold text-deep-sea">walk-forward back-testing</span>,
                      dividing data into rolling in-sample windows to fit parameters and
                      out-of-sample windows to validate, avoiding look-ahead bias and
                      over-fitting. The third stage applies a{" "}
                      <span className="font-semibold text-deep-sea">risk management</span> lens:
                      position sizing based on signal confidence, gross and net exposure limits,
                      and per-trade loss constraints.
                    </p>

                    {/* Caveat, required per spec */}
                    <p className="text-xs italic text-slate">
                      Independent work in progress. No performance figures, alpha, returns,
                      Sharpe ratio, or drawdown claimed, developing, not deployed.
                    </p>

                    {/* Process highlights */}
                    <div className="mt-auto">
                      <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate">
                        Process highlights
                      </p>
                      <div>
                        <HighlightItem figure="Signal research"         label="Momentum & mean-reversion indicators" hero />
                        <HighlightItem figure="Walk-forward"            label="Back-testing with out-of-sample validation" />
                        <HighlightItem figure="Risk-managed sizing"     label="Position limits · exposure controls" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ════════════════════════════════════════════════════════════════
              Banner Row 2, CFA Level 1 candidate
              Text LEFT on lg, visual RIGHT (reversed)
          ════════════════════════════════════════════════════════════════ */}
          <Reveal delay={0.1}>
            <div className={cn(
              "rounded-2xl border border-deep-sea/10 bg-linen",
              "transition-[box-shadow,border-color] duration-300 hover:border-deep-sea/20 hover:shadow-sm",
            )}>
              <div className={cn(
                "grid grid-cols-1 gap-0",
                "lg:grid-cols-[auto_1fr]",
              )}>

                {/* ── LEFT: text + highlights (reversed on lg) ── */}
                <div className={cn(
                  "flex flex-col gap-6 p-6 sm:p-8 lg:p-10 lg:w-80 xl:w-96",
                  "border-b border-deep-sea/8 lg:border-b-0 lg:border-r",
                  /* On mobile the text comes first (top); on lg it stays left */
                )}>

                  {/* Eyebrow */}
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-sea">
                    CFA Institute · Level 1
                  </p>

                  {/* Title */}
                  <div className="flex items-start gap-2.5">
                    <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-sea" aria-hidden="true" />
                    <h3 className="text-xl font-semibold leading-snug tracking-tight text-deep-sea sm:text-2xl">
                      CFA Level 1 candidate{" "}
                      <span className="whitespace-nowrap text-golden-hour">(November 2026)</span>
                    </h3>
                  </div>

                  {/* What I'm learning paragraph */}
                  <p className="text-sm leading-relaxed text-deep-sea/75">
                    Working through all <span className="font-semibold text-deep-sea">10</span> topic
                    areas of the 2026 CFA Level 1 curriculum,
                    <span className="font-semibold text-deep-sea"> 180</span> questions across two
                    computer-based sessions. Ethics carries the highest weight at{" "}
                    <span className="font-semibold text-deep-sea">15–20%</span>, covering the
                    Standards of Professional Conduct and the Global Investment Performance Standards
                    that underpin every area of investment practice.
                  </p>
                  <p className="text-sm leading-relaxed text-deep-sea/75">
                    <span className="font-semibold text-deep-sea">Financial Statement Analysis</span> (11–14%)
                    teaches how to read and adjust income statements, balance sheets, and cash-flow
                    statements to see through accounting choices to economic reality.{" "}
                    <span className="font-semibold text-deep-sea">Equity Investments</span> and{" "}
                    <span className="font-semibold text-deep-sea">Fixed Income</span> (each 11–14%)
                    cover valuation frameworks, DDM, free-cash-flow models, bond pricing, duration,
                    and credit analysis, that connect directly to the LBO and DCF work in my projects.
                    <span className="font-semibold text-deep-sea"> Quantitative Methods</span> (6–9%)
                    grounds everything in probability, regression, and time-series concepts that are
                    equally central to systematic trading research.
                  </p>

                  {/* Key metrics */}
                  <div className="mt-auto">
                    <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate">
                      Key figures
                    </p>
                    <div>
                      <HighlightItem figure="10"         label="Topic areas across the full curriculum" hero />
                      <HighlightItem figure="180"        label="Multiple-choice questions per sitting" />
                      <HighlightItem figure="Nov 2026"   label="Exam sitting target" />
                      <HighlightItem figure="Ethics 15–20%" label="Highest-weighted topic area" />
                    </div>
                  </div>
                </div>

                {/* ── RIGHT: large topic-weight visual ── */}
                <div className="flex items-start p-6 sm:p-8 lg:p-10">
                  <CfaTopicBarsVisual />
                </div>

              </div>
            </div>
          </Reveal>

        </div>
      </Section>
    </>
  )
}
