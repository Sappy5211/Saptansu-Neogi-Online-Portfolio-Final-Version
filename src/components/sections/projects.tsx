/**
 * projects.tsx — Projects & Certifications section
 *
 * Layout:
 *   - Case-study container: featured (2-col lg) + 2-up grid, rows separated by deep-sea/10 border.
 *   - Each case study: eyebrow label · title + subtitle · 1–2 sentence context ·
 *     compact metric row (count-up) · "Read case study" placeholder link (MoveRight nudge).
 *   - NO pointer-tracking 3D tilt; cards are stable with a gentle ≤2px lift on hover.
 *   - Certifications: CertificateCoverflow — text left, 3D coverflow right.
 *     Real certificate scans go in public/certs/ and set the `image` field on each cert entry.
 *   - Reduced-motion aware; all animations via motion/react; no horizontal overflow.
 */

import {
  MoveRight,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useRef, useEffect, useCallback, useState, useMemo } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useInView,
  animate,
  AnimatePresence,
} from "motion/react"

import { Section, SectionHeading } from "@/components/ui/section"
import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"
import { EASE } from "@/lib/motion"

// ---------------------------------------------------------------------------
// Data — Case Studies
// ---------------------------------------------------------------------------

interface CaseMetric {
  value: string
  label: string
  icon?: LucideIcon
}

interface CaseStudy {
  label: string
  title: string
  subtitle: string
  context: string
  metrics: CaseMetric[]
  featured?: boolean
  /**
   * Compact SVG visual slot for the featured card.
   * A function component so it can reference tokens.
   */
  Visual?: () => React.ReactElement
}

// ---------------------------------------------------------------------------
// Inline tactical SVG visuals (on-brand, no stock photos)
// ---------------------------------------------------------------------------

/** VoltaGrid: a simple bar chart showing 3 demand scenario return bars */
function VoltaGridVisual() {
  const ref = useRef<SVGSVGElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" })

  const bars = [
    { x: 14, h: 68, label: "Base", value: "22%", fill: "var(--color-sea)" },
    { x: 54, h: 90, label: "Up", value: "28%", fill: "var(--color-golden-hour)" },
    { x: 94, h: 46, label: "Down", value: "14%", fill: "var(--color-sea)" },
  ]

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate">
        IRR · 3 scenarios (modelled)
      </p>
      <svg
        ref={ref}
        viewBox="0 0 144 116"
        aria-hidden="true"
        className="w-full max-w-[9rem] lg:max-w-[11rem]"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Baseline */}
        <line x1="4" y1="106" x2="140" y2="106" stroke="var(--color-shell)" strokeWidth={1} />
        {bars.map((bar) => (
          <g key={bar.label}>
            <motion.rect
              x={bar.x}
              y={106 - bar.h}
              width={28}
              height={bar.h}
              rx={4}
              fill={bar.fill}
              fillOpacity={0.85}
              initial={{ scaleY: 0, originY: 1 }}
              animate={
                reduce
                  ? { scaleY: 1 }
                  : inView
                  ? { scaleY: 1 }
                  : { scaleY: 0 }
              }
              style={{ transformOrigin: `${bar.x + 14}px 106px` }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.7, ease: EASE, delay: 0.15 }
              }
            />
            <text
              x={bar.x + 14}
              y={106 - bar.h - 5}
              textAnchor="middle"
              fontSize={9}
              fill="var(--color-deep-sea)"
              fontFamily="inherit"
            >
              {bar.value}
            </text>
            <text
              x={bar.x + 14}
              y={115}
              textAnchor="middle"
              fontSize={8}
              fill="var(--color-slate)"
              fontFamily="inherit"
            >
              {bar.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

/** AquaServe: leverage + covenant headroom mini gauge */
function AquaServeVisual() {
  const ref = useRef<SVGSVGElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" })

  const WIDTH = 144
  const HEIGHT = 48
  const barY = 18
  const barH = 16
  const totalW = 130
  const startX = 7

  const fillW = totalW * 0.65

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate">
        Leverage vs covenant (8.0× EBITDA)
      </p>
      <svg
        ref={ref}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        aria-hidden="true"
        className="w-full max-w-[9rem] lg:max-w-[11rem]"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Track */}
        <rect x={startX} y={barY} width={totalW} height={barH} rx={5} fill="var(--color-shell)" />
        {/* Fill bar */}
        <motion.rect
          x={startX}
          y={barY}
          width={fillW}
          height={barH}
          rx={5}
          fill="var(--color-sea)"
          fillOpacity={0.85}
          initial={{ scaleX: 0 }}
          animate={
            reduce
              ? { scaleX: 1 }
              : inView
              ? { scaleX: 1 }
              : { scaleX: 0 }
          }
          style={{ transformOrigin: `${startX}px ${barY + barH / 2}px` }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.8, ease: EASE, delay: 0.1 }
          }
        />
        {/* Covenant line */}
        <line
          x1={startX + totalW * 0.85}
          y1={barY - 4}
          x2={startX + totalW * 0.85}
          y2={barY + barH + 4}
          stroke="var(--color-golden-hour)"
          strokeWidth={1.5}
          strokeDasharray="3 2"
        />
        {/* Labels */}
        <text x={startX} y={barY + barH + 13} fontSize={8} fill="var(--color-slate)" fontFamily="inherit">
          Debt
        </text>
        <text
          x={startX + totalW * 0.85}
          y={barY - 6}
          textAnchor="middle"
          fontSize={8}
          fill="var(--color-golden-hour)"
          fontFamily="inherit"
        >
          Covenant
        </text>
      </svg>
    </div>
  )
}

/** KPI dashboards: three mini sparklines */
function DashboardVisual() {
  const ref = useRef<SVGSVGElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" })

  const sparklines = [
    { pts: "2,34 18,28 34,30 50,20 66,17 82,10", col: "var(--color-sea)" },
    { pts: "2,38 18,32 34,22 50,26 66,15 82,12", col: "var(--color-golden-hour)" },
    { pts: "2,40 18,30 34,36 50,22 66,20 82,8", col: "var(--color-slate)" },
  ]

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate">
        3 Tableau dashboards · 3 business areas
      </p>
      <svg
        ref={ref}
        viewBox="0 0 88 52"
        aria-hidden="true"
        className="w-full max-w-[9rem] lg:max-w-[11rem]"
        preserveAspectRatio="xMidYMid meet"
      >
        <motion.g
          initial={{ opacity: 0 }}
          animate={
            reduce
              ? { opacity: 1 }
              : inView
              ? { opacity: 1 }
              : { opacity: 0 }
          }
          transition={reduce ? { duration: 0 } : { duration: 0.6, ease: EASE, delay: 0.1 }}
        >
          {sparklines.map((s, i) => (
            <polyline
              key={i}
              points={s.pts}
              fill="none"
              stroke={s.col}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={i === 0 ? 1 : 0.6}
            />
          ))}
        </motion.g>
        {/* Baseline */}
        <line x1="2" y1="46" x2="86" y2="46" stroke="var(--color-shell)" strokeWidth={0.8} />
      </svg>
    </div>
  )
}

const CASE_STUDIES: CaseStudy[] = [
  {
    label: "3-STATEMENT LBO · IC MEMO",
    title: "VoltaGrid Energy",
    subtitle: "A self-directed leveraged buyout build and investment memo.",
    context:
      "Built a five-year, three-statement LBO for a hypothetical £45m EV energy deal, then wrote a five-part investment committee memo covering thesis, market context, execution risks, value creation and exit.",
    metrics: [
      { value: "£45m", label: "Enterprise value" },
      { value: "2.4×", label: "MOIC (modelled)" },
      { value: "22%", label: "IRR (modelled)" },
      { value: "3", label: "Demand scenarios" },
    ],
    featured: true,
    Visual: VoltaGridVisual,
  },
  {
    label: "LBO MODEL · STRESS TESTING",
    title: "AquaServe UK",
    subtitle: "An entry-to-exit buyout model with downside testing.",
    context:
      "Modelled a £43.3m water-sector buyout at 8.0× EBITDA, stress-testing leverage, covenant headroom and cash-flow coverage and mapping return sensitivity across exit scenarios.",
    metrics: [
      { value: "£43.3m", label: "Deal size" },
      { value: "8.0×", label: "EBITDA entry" },
      { value: "2.1×", label: "MOIC (modelled)" },
      { value: "20%+", label: "IRR (base case)" },
    ],
    Visual: AquaServeVisual,
  },
  {
    label: "ANALYTICS · DASHBOARDS",
    title: "Multi-source KPI dashboards + Python EDA",
    subtitle: "Multi-source KPI analytics, end to end.",
    context:
      "Built three Tableau dashboards tracking KPIs across three business areas and ran two Python (pandas) analyses, cleaning raw data through to a clear recommendation.",
    metrics: [
      { value: "3", label: "Tableau dashboards" },
      { value: "2", label: "Python analyses" },
      { value: "3", label: "Business areas" },
    ],
    Visual: DashboardVisual,
  },
]

// ---------------------------------------------------------------------------
// Data — Certifications (6 certs from spec; CFA removed)
// Real certificate scans go in public/certs/ and set the `image` field below.
// ---------------------------------------------------------------------------

interface CertSkill {
  label: string
}

interface CertEntry {
  /** Short issuer name shown as eyebrow */
  issuer: string
  /** Full certification title */
  title: string
  /** Learning-focused blurb (may contain inline React nodes for highlighted figures) */
  blurb: React.ReactNode
  /** Core skills chips */
  skills: CertSkill[]
  /**
   * Optional path to a real certificate scan in public/certs/.
   * Example: "/certs/nyif-risk-management.jpg"
   * When provided, the frame renders <img object-contain> instead of the styled placeholder.
   */
  image?: string
}

const CERTIFICATIONS: CertEntry[] = [
  {
    issuer: "New York Institute of Finance",
    title: "Risk Management Specialisation",
    blurb: (
      <>
        Studied credit, market and operational risk and enterprise risk frameworks (Basel III, IFRS 9,
        KRIs). Built a portfolio risk project estimating{" "}
        <span className="font-semibold text-deep-sea">95% VaR</span> and Expected Shortfall across{" "}
        <span className="font-semibold text-deep-sea">four</span> global equity indices.
      </>
    ),
    skills: [
      { label: "VaR" },
      { label: "Expected Shortfall" },
      { label: "Credit & Market Risk" },
      { label: "Basel III / IFRS 9" },
      { label: "KRIs" },
      { label: "Portfolio Risk" },
    ],
  },
  {
    issuer: "University of Illinois Urbana-Champaign",
    title: "Mergers & Acquisitions Specialisation",
    blurb: (
      <>
        Learned M&A valuation, synergy analysis, accretion/dilution, capital structure and LBO
        analysis. Forecast cash flows and ran NPV for acquirer and target across{" "}
        <span className="font-semibold text-deep-sea">five</span> industries and{" "}
        <span className="font-semibold text-deep-sea">two</span> PE transactions.
      </>
    ),
    skills: [
      { label: "M&A Valuation" },
      { label: "Synergy Analysis" },
      { label: "Accretion/Dilution" },
      { label: "LBO Analysis" },
      { label: "NPV" },
      { label: "Capital Structure" },
    ],
  },
  {
    issuer: "Howard University",
    title: "Business Problem-Solving Specialisation",
    blurb: (
      <>
        Excel-based decision modelling. Built{" "}
        <span className="font-semibold text-deep-sea">six</span> spreadsheet models on a{" "}
        <span className="font-semibold text-deep-sea">£1.2m</span> portfolio, applying single and
        multiple regression, correlation and sensitivity testing to turn outputs into recommendations.
      </>
    ),
    skills: [
      { label: "Regression" },
      { label: "Correlation Analysis" },
      { label: "Sensitivity Testing" },
      { label: "Excel Modelling" },
      { label: "Decision Analysis" },
    ],
  },
  {
    issuer: "Meta",
    title: "Meta Data Analyst Professional Certificate",
    blurb: (
      <>
        Learned SQL, Python and pandas, the OSEMN workflow, hypothesis testing, regression and data
        visualisation. Built <span className="font-semibold text-deep-sea">three</span> Tableau
        dashboards and <span className="font-semibold text-deep-sea">two</span> pandas analyses end
        to end.
      </>
    ),
    skills: [
      { label: "SQL" },
      { label: "Python" },
      { label: "pandas" },
      { label: "Tableau" },
      { label: "Hypothesis Testing" },
      { label: "Data Visualisation" },
      { label: "OSEMN" },
    ],
  },
  {
    issuer: "HSBC & J.P. Morgan",
    title: "Investment Banking Virtual Experience",
    blurb: (
      <>
        Virtual Experience Programmes. Screened{" "}
        <span className="font-semibold text-deep-sea">five</span> M&A targets, built a DCF for an{" "}
        <span className="font-semibold text-deep-sea">£803m</span> beverage-sector deal and
        stress-tested a{" "}
        <span className="font-semibold text-deep-sea">110.8%</span> bid premium across scenarios.
      </>
    ),
    skills: [
      { label: "DCF Valuation" },
      { label: "M&A Screening" },
      { label: "Bid Premium Analysis" },
      { label: "Scenario Analysis" },
    ],
  },
  {
    issuer: "Bloomberg",
    title: "Bloomberg Market Concepts (BMC)",
    blurb: (
      <>
        Grounding in Bloomberg terminal functions and market structure across economics, currencies,
        fixed income and equities.
      </>
    ),
    skills: [
      { label: "Bloomberg Terminal" },
      { label: "Market Structure" },
      { label: "Economics" },
      { label: "Fixed Income" },
      { label: "Equities" },
      { label: "FX" },
    ],
  },
]

// ---------------------------------------------------------------------------
// parseMetricValue — splits "£45m" → { prefix, number, suffix, decimalPlaces }
// ---------------------------------------------------------------------------

interface ParsedMetric {
  prefix: string
  number: number
  suffix: string
  decimalPlaces: number
}

function parseMetricValue(value: string): ParsedMetric | null {
  const match = value.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return null
  const prefix = match[1]
  const rawNum = match[2]
  const suffix = match[3]
  const number = parseFloat(rawNum)
  const decimalPlaces = rawNum.includes(".") ? rawNum.split(".")[1].length : 0
  return { prefix, number, suffix, decimalPlaces }
}

// ---------------------------------------------------------------------------
// CountUpValue — animates 0 → target on viewport entry
// ---------------------------------------------------------------------------

function CountUpValue({ value }: { value: string }) {
  const reduce = useReducedMotion()
  const parsed = parseMetricValue(value)

  const wrapperRef = useRef<HTMLSpanElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)

  const inView = useInView(wrapperRef as React.RefObject<Element>, { once: true })
  const mv = useMotionValue(0)

  useEffect(() => {
    if (reduce || !parsed || !inView || !spanRef.current) return

    const { prefix, number: target, suffix, decimalPlaces } = parsed
    const controls = animate(mv, target, { duration: 1.2, ease: [0.22, 1, 0.36, 1] })
    const unsub = mv.on("change", (v: number) => {
      if (spanRef.current) {
        spanRef.current.textContent = prefix + v.toFixed(decimalPlaces) + suffix
      }
    })

    return () => {
      controls.stop()
      unsub()
    }
  }, [inView, reduce, mv, parsed])

  if (reduce || !parsed) {
    return <span className="tabular-nums">{value}</span>
  }

  const { prefix, suffix, decimalPlaces } = parsed
  const initialText = prefix + (0).toFixed(decimalPlaces) + suffix

  return (
    <span className="tabular-nums" ref={wrapperRef}>
      <span ref={spanRef}>{initialText}</span>
    </span>
  )
}

// ---------------------------------------------------------------------------
// Metric row (count-up chips) — shared by featured + grid cards
// ---------------------------------------------------------------------------

function MetricRow({ metrics }: { metrics: CaseMetric[] }) {
  return (
    <dl className="flex flex-wrap gap-x-5 gap-y-2">
      {metrics.map((m, i) => (
        <div key={m.label} className="min-w-0">
          <dt className="text-[10px] uppercase tracking-[0.15em] text-slate">{m.label}</dt>
          <dd
            className={cn(
              "mt-0.5 text-base font-semibold tabular-nums",
              i === 0 ? "text-golden-hour" : "text-deep-sea",
            )}
          >
            <CountUpValue value={m.value} />
          </dd>
        </div>
      ))}
    </dl>
  )
}

// ---------------------------------------------------------------------------
// ReadCaseStudyLink — placeholder affordance with MoveRight nudge
// ---------------------------------------------------------------------------

function ReadCaseStudyLink({ title }: { title: string }) {
  return (
    <a
      href="#"
      aria-label={`Read case study: ${title} (coming soon)`}
      aria-disabled="true"
      onClick={(e) => e.preventDefault()}
      className={cn(
        "group inline-flex items-center gap-1.5 text-sm font-medium text-sea",
        "transition-colors duration-200 hover:text-sea-deep",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2",
        "rounded",
      )}
    >
      Read case study
      <MoveRight
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
      />
      <span className="sr-only">(coming soon)</span>
    </a>
  )
}

// ---------------------------------------------------------------------------
// FeaturedCaseStudy — larger 2-col layout on lg; stable card (no pointer tilt)
// ---------------------------------------------------------------------------

function FeaturedCaseStudy({ cs }: { cs: CaseStudy }) {
  return (
    <Reveal delay={0.04}>
      <div
        className={cn(
          "rounded-2xl border border-deep-sea/10 bg-linen p-6 shadow-sm",
          "transition-shadow duration-300 hover:shadow-md",
          "sm:p-8",
        )}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
          {/* Left: text content */}
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {/* Eyebrow */}
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-sea">
              {cs.label}
            </p>

            {/* Title + subtitle */}
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-deep-sea sm:text-2xl">
                {cs.title}
              </h3>
              <p className="mt-1 text-sm text-slate">{cs.subtitle}</p>
            </div>

            {/* Written context */}
            <p className="max-w-2xl text-sm leading-relaxed text-deep-sea/75">
              {cs.context}
            </p>

            {/* Metrics */}
            <MetricRow metrics={cs.metrics} />

            {/* CTA */}
            <ReadCaseStudyLink title={cs.title} />
          </div>

          {/* Right: tactical visual — bumped up on lg so it balances the text */}
          {cs.Visual ? (
            <div
              aria-hidden="true"
              className={cn(
                "flex shrink-0 items-start justify-start",
                // Mobile: natural flow; lg: fixed column, centred vertically
                "lg:w-64 lg:items-center lg:justify-center",
              )}
            >
              <div className="w-full max-w-[11rem] lg:max-w-none">
                <cs.Visual />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Reveal>
  )
}

// ---------------------------------------------------------------------------
// GridCaseStudy — compact card for 2-up grid; stable (no pointer tilt)
// ---------------------------------------------------------------------------

function GridCaseStudy({ cs, delay }: { cs: CaseStudy; delay: number }) {
  const reduce = useReducedMotion()

  const inner = (
    <div
      className={cn(
        "flex h-full flex-col gap-4 rounded-2xl border border-deep-sea/10 bg-linen p-5 shadow-sm",
        "transition-shadow duration-300 hover:shadow-md",
      )}
    >
      {/* Eyebrow */}
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-sea">
        {cs.label}
      </p>

      {/* Title + subtitle */}
      <div>
        <h3 className="text-base font-semibold tracking-tight text-deep-sea">
          {cs.title}
        </h3>
        <p className="mt-0.5 text-xs text-slate">{cs.subtitle}</p>
      </div>

      {/* Written context */}
      <p className="flex-1 text-sm leading-relaxed text-deep-sea/75">{cs.context}</p>

      {/* Tactical visual — modest but visible in the grid */}
      {cs.Visual ? (
        <div aria-hidden="true" className="w-full max-w-[9rem]">
          <cs.Visual />
        </div>
      ) : null}

      {/* Metrics */}
      <MetricRow metrics={cs.metrics} />

      {/* Divider + CTA */}
      <div className="border-t border-deep-sea/10 pt-3">
        <ReadCaseStudyLink title={cs.title} />
      </div>
    </div>
  )

  if (reduce) {
    return <div className="h-full">{inner}</div>
  }

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {inner}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// CertificateFrame — on-brand styled placeholder; swaps to <img> when image prop set
// Real scans: put JPG/PNG in public/certs/ and set the `image` field on a CERTIFICATIONS entry.
// ---------------------------------------------------------------------------

function CertificateFrame({ cert }: { cert: CertEntry }) {
  if (cert.image) {
    return (
      <img
        src={cert.image}
        alt={`${cert.title} certificate`}
        className="h-full w-full object-contain"
        loading="lazy"
      />
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden px-6 py-5">
      {/* Subtle corner ornaments */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 280 200"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Corner brackets — top-left */}
        <path d="M12 32 L12 12 L32 12" stroke="var(--color-sea)" strokeWidth="1.5" strokeOpacity="0.35" />
        {/* top-right */}
        <path d="M248 12 L268 12 L268 32" stroke="var(--color-sea)" strokeWidth="1.5" strokeOpacity="0.35" />
        {/* bottom-left */}
        <path d="M12 168 L12 188 L32 188" stroke="var(--color-sea)" strokeWidth="1.5" strokeOpacity="0.35" />
        {/* bottom-right */}
        <path d="M248 188 L268 188 L268 168" stroke="var(--color-sea)" strokeWidth="1.5" strokeOpacity="0.35" />
        {/* Inner border rectangle */}
        <rect x="22" y="22" width="236" height="156" rx="3" stroke="var(--color-sea)" strokeWidth="0.6" strokeOpacity="0.18" />
      </svg>

      {/* Seal motif */}
      <div
        aria-hidden="true"
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid var(--color-golden-hour)",
          opacity: 0.55,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" width={18} height={18} aria-hidden="true">
          <path
            d="M12 2l2.09 6.41H21l-5.45 3.96 2.09 6.41L12 14.82l-5.64 4L8.45 12.37 3 8.41h6.91z"
            fill="var(--color-golden-hour)"
            opacity={0.7}
          />
        </svg>
      </div>

      {/* Issuer */}
      <p className="text-center text-[9px] font-medium uppercase tracking-[0.22em] text-sea">
        {cert.issuer}
      </p>

      {/* Title */}
      <p className="text-center text-[11px] font-semibold leading-snug text-deep-sea">
        {cert.title}
      </p>

      {/* "Certificate" watermark */}
      <p className="text-[9px] uppercase tracking-[0.3em] text-slate/40">Certificate</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// CertificateCoverflow — text left, 3D coverflow right
// Adapted from CircularTestimonials pattern; no new deps, Tailwind + inline styles
// ---------------------------------------------------------------------------

/** Returns 3D transform for coverflow positions: prev / active / next */
function getCoverflowStyle(
  position: "prev" | "active" | "next",
  reduce: boolean | null,
): React.CSSProperties {
  if (reduce) {
    return position === "active"
      ? { opacity: 1, pointerEvents: "auto" }
      : { opacity: 0, pointerEvents: "none", position: "absolute" }
  }

  const BASE: React.CSSProperties = {
    transition: "transform 420ms cubic-bezier(0.4, 0, 0.2, 1), opacity 420ms ease",
    position: "absolute",
    top: 0,
    willChange: "transform, opacity",
  }

  if (position === "active") {
    return {
      ...BASE,
      transform: "translateX(-50%) translateZ(0px) rotateY(0deg) scale(1)",
      left: "50%",
      opacity: 1,
      zIndex: 10,
      pointerEvents: "auto",
    }
  }
  if (position === "prev") {
    return {
      ...BASE,
      transform: "translateX(-50%) translateX(-68%) translateZ(-80px) rotateY(22deg) scale(0.82)",
      left: "50%",
      opacity: 0.55,
      zIndex: 5,
      pointerEvents: "none",
    }
  }
  // next
  return {
    ...BASE,
    transform: "translateX(-50%) translateX(68%) translateZ(-80px) rotateY(-22deg) scale(0.82)",
    left: "50%",
    opacity: 0.55,
    zIndex: 5,
    pointerEvents: "none",
  }
}

function CertificateCoverflow() {
  const reduce = useReducedMotion()
  const total = CERTIFICATIONS.length
  const [active, setActive] = useState(0)
  const [prevActive, setPrevActive] = useState<number | null>(null)
  const regionRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback(
    (index: number) => {
      setPrevActive(active)
      setActive((index + total) % total)
    },
    [active, total],
  )

  const goPrev = useCallback(() => goTo(active - 1), [active, goTo])
  const goNext = useCallback(() => goTo(active + 1), [active, goTo])

  // Keyboard navigation
  useEffect(() => {
    const el = regionRef.current
    if (!el) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev() }
      if (e.key === "ArrowRight") { e.preventDefault(); goNext() }
    }
    el.addEventListener("keydown", handler)
    return () => el.removeEventListener("keydown", handler)
  }, [goPrev, goNext])

  const prevIndex = (active - 1 + total) % total
  const nextIndex = (active + 1) % total

  const activeCert = CERTIFICATIONS[active]

  // Which of the 3 visible slots does each cert occupy?
  const getPosition = (i: number): "prev" | "active" | "next" | null => {
    if (i === active) return "active"
    if (i === prevIndex) return "prev"
    if (i === nextIndex) return "next"
    return null
  }

  // The blurb key drives AnimatePresence re-mount on cert change
  const blurbKey = active

  return (
    <div
      ref={regionRef}
      role="region"
      aria-label="Certifications"
      tabIndex={0}
      className="overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-4 rounded-2xl"
    >
      {/* 2-col on md+; stacked on mobile */}
      <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-12 lg:gap-16">

        {/* ── LEFT: active cert text ── */}
        <div className="flex min-w-0 flex-1 flex-col gap-5 md:max-w-sm lg:max-w-md">
          {/* Eyebrow — issuer */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`issuer-${blurbKey}`}
              className="text-[10px] font-medium uppercase tracking-[0.22em] text-sea"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
            >
              {activeCert.issuer}
            </motion.p>
          </AnimatePresence>

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.h3
              key={`title-${blurbKey}`}
              className="text-lg font-semibold leading-snug tracking-tight text-deep-sea sm:text-xl"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduce ? 0 : 0.28, ease: EASE, delay: reduce ? 0 : 0.04 }}
            >
              {activeCert.title}
            </motion.h3>
          </AnimatePresence>

          {/* Blurb — word blur-fade-in (like CircularTestimonials reference) */}
          <AnimatePresence mode="wait">
            {reduce ? (
              <p
                key={`blurb-static-${blurbKey}`}
                className="text-sm leading-relaxed text-deep-sea/75"
              >
                {activeCert.blurb}
              </p>
            ) : (
              <motion.p
                key={`blurb-${blurbKey}`}
                className="text-sm leading-relaxed text-deep-sea/75"
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.38, ease: EASE, delay: 0.06 }}
              >
                {activeCert.blurb}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Core-skills chips */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`skills-${blurbKey}`}
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.3, ease: EASE, delay: reduce ? 0 : 0.1 }}
            >
              {activeCert.skills.map((s) => (
                <span
                  key={s.label}
                  className={cn(
                    "rounded-full border border-sea/25 bg-sea/8 px-2.5 py-0.5",
                    "text-[10px] font-medium text-sea",
                  )}
                >
                  {s.label}
                </span>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next controls — inline with text on mobile */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous certification"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full",
                "bg-sea text-linen shadow-sm",
                "transition-colors duration-200 hover:bg-sea-deep",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2",
              )}
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            </button>

            {/* Dot indicators */}
            <div
              className="flex items-center gap-1.5"
              role="tablist"
              aria-label="Certification indicator"
            >
              {CERTIFICATIONS.map((c, i) => (
                <button
                  key={c.title}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Go to certification ${i + 1}: ${c.title}`}
                  onClick={() => goTo(i)}
                  className={cn(
                    "rounded-full transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2",
                    i === active
                      ? "h-2 w-5 bg-sea"
                      : "h-2 w-2 cursor-pointer bg-deep-sea/20 hover:bg-deep-sea/40",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next certification"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full",
                "bg-sea text-linen shadow-sm",
                "transition-colors duration-200 hover:bg-sea-deep",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2",
              )}
            >
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── RIGHT: 3D coverflow of certificate frames ── */}
        <div
          aria-hidden="true"
          className="relative w-full flex-shrink-0 md:w-[52%] lg:w-[48%]"
          style={{ perspective: reduce ? "none" : "900px" }}
        >
          {/* Height container — drives the aspect of the coverflow stage */}
          <div
            className="relative w-full"
            style={{ paddingBottom: "62%" /* approx 1.4/1 aspect height for stage */ }}
          >
            {CERTIFICATIONS.map((cert, i) => {
              const pos = getPosition(i)
              if (!pos) return null

              return (
                <div
                  key={cert.title}
                  style={{
                    ...getCoverflowStyle(pos, reduce),
                    width: "64%",
                    aspectRatio: "1.4 / 1",
                  }}
                >
                  <div
                    className={cn(
                      "h-full w-full overflow-hidden rounded-xl",
                      "border-2 border-sea/30 bg-linen shadow-md",
                    )}
                    style={{ aspectRatio: "1.4 / 1" }}
                  >
                    <CertificateFrame cert={cert} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Nav count label under coverflow */}
          <p className="mt-3 text-center text-[10px] text-slate/60">
            {active + 1} / {total}
          </p>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section heading ID (must match SectionHeading's generated id)
// ---------------------------------------------------------------------------

const HEADING_TITLE = "Self-directed builds and credentials"
const HEADING_ID = HEADING_TITLE.toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function Projects() {
  const [featured, ...grid] = CASE_STUDIES

  return (
    <Section
      id="projects"
      aria-labelledby={HEADING_ID}
      className="bg-sand"
      containerClassName="max-w-6xl"
    >
      <Reveal>
        <SectionHeading
          eyebrow="Projects & certifications"
          title={HEADING_TITLE}
        />
      </Reveal>

      {/* ── A: Case studies ── */}
      <div className="mt-12">
        <Reveal delay={0.04}>
          <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.22em] text-deep-sea/50">
            Projects
          </h3>
        </Reveal>

        {/* Bordered case-study container */}
        <div className="rounded-2xl border border-deep-sea/10 bg-linen/30 shadow-sm">
          {/* Featured — larger, sits at top */}
          <div className="p-4 sm:p-6">
            <FeaturedCaseStudy cs={featured} />
          </div>

          {/* Divider */}
          <div className="border-t border-deep-sea/10" />

          {/* Grid of remaining case studies */}
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:gap-5 sm:p-6">
            {grid.map((cs, i) => (
              <GridCaseStudy key={cs.title} cs={cs} delay={0.08 + i * 0.08} />
            ))}
          </div>
        </div>
      </div>

      {/* ── B: Certifications coverflow ── */}
      <div className="mt-16">
        <Reveal delay={0.04}>
          <h3 className="mb-8 text-xs font-medium uppercase tracking-[0.22em] text-deep-sea/50">
            Certifications
          </h3>
        </Reveal>

        <Reveal delay={0.08}>
          <CertificateCoverflow />
        </Reveal>
      </div>
    </Section>
  )
}
