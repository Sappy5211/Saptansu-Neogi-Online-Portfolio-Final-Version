/**
 * projects.tsx — Projects & Certifications section
 *
 * Layout:
 *   - Case-study container: featured (2-col lg) + 2-up grid, rows separated by deep-sea/10 border.
 *   - Each case study: eyebrow label · title + subtitle · 1–2 sentence context ·
 *     compact metric row (count-up) · "Read case study" placeholder link (MoveRight nudge).
 *   - TiltCard on featured; CertCard grid below (unchanged spirit).
 *   - Reduced-motion aware; all animations via motion/react; no horizontal overflow.
 */

import {
  GraduationCap,
  Award,
  FileText,
  MoveRight,
  BarChart3,
  TrendingUp,
  Database,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useRef, useEffect, useCallback } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  useInView,
  animate,
} from "motion/react"

import { Section, SectionHeading } from "@/components/ui/section"
import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"
import { EASE } from "@/lib/motion"

// ---------------------------------------------------------------------------
// Data
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

  // Bar heights for base / upside / downside scenario return bands
  const bars = [
    { x: 12, h: 52, label: "Base", value: "22%", fill: "var(--color-sea)" },
    { x: 46, h: 70, label: "Up", value: "28%", fill: "var(--color-golden-hour)" },
    { x: 80, h: 34, label: "Down", value: "14%", fill: "var(--color-sea)" },
  ]

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate">
        IRR · 3 scenarios (modelled)
      </p>
      <svg
        ref={ref}
        viewBox="0 0 120 90"
        aria-hidden="true"
        className="w-full max-w-[9rem]"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Baseline */}
        <line x1="4" y1="82" x2="116" y2="82" stroke="var(--color-shell)" strokeWidth={1} />
        {bars.map((bar) => (
          <g key={bar.label}>
            <motion.rect
              x={bar.x}
              y={82 - bar.h}
              width={22}
              height={bar.h}
              rx={3}
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
              style={{ transformOrigin: `${bar.x + 11}px 82px` }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.7, ease: EASE, delay: 0.15 }
              }
            />
            <text
              x={bar.x + 11}
              y={82 - bar.h - 4}
              textAnchor="middle"
              fontSize={8}
              fill="var(--color-deep-sea)"
              fontFamily="inherit"
            >
              {bar.value}
            </text>
            <text
              x={bar.x + 11}
              y={89}
              textAnchor="middle"
              fontSize={7}
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

  const WIDTH = 120
  const HEIGHT = 38
  const barY = 16
  const barH = 12
  const totalW = 108
  const startX = 6

  // Leverage fill ~65% of max covenant
  const fillW = totalW * 0.65

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate">
        Leverage vs covenant (8.0× EBITDA)
      </p>
      <svg
        ref={ref}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        aria-hidden="true"
        className="w-full max-w-[9rem]"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Track */}
        <rect x={startX} y={barY} width={totalW} height={barH} rx={4} fill="var(--color-shell)" />
        {/* Fill bar */}
        <motion.rect
          x={startX}
          y={barY}
          width={fillW}
          height={barH}
          rx={4}
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
          y1={barY - 3}
          x2={startX + totalW * 0.85}
          y2={barY + barH + 3}
          stroke="var(--color-golden-hour)"
          strokeWidth={1.5}
          strokeDasharray="3 2"
        />
        {/* Labels */}
        <text x={startX} y={barY + barH + 11} fontSize={7} fill="var(--color-slate)" fontFamily="inherit">
          Debt
        </text>
        <text x={startX + totalW * 0.85} y={barY - 5} textAnchor="middle" fontSize={7} fill="var(--color-golden-hour)" fontFamily="inherit">
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
    { pts: "2,28 14,22 26,24 38,16 50,14 62,8", col: "var(--color-sea)" },
    { pts: "2,30 14,26 26,18 38,20 50,12 62,10", col: "var(--color-golden-hour)" },
    { pts: "2,32 14,24 26,28 38,18 50,16 62,6", col: "var(--color-slate)" },
  ]

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate">
        3 Tableau dashboards · 3 business areas
      </p>
      <svg
        ref={ref}
        viewBox="0 0 68 40"
        aria-hidden="true"
        className="w-full max-w-[9rem]"
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
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={i === 0 ? 1 : 0.6}
            />
          ))}
        </motion.g>
        {/* Baseline */}
        <line x1="2" y1="36" x2="66" y2="36" stroke="var(--color-shell)" strokeWidth={0.8} />
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
// Certifications
// ---------------------------------------------------------------------------

interface Certification {
  name: string
  detail: string
  Icon: LucideIcon
}

const CERTIFICATIONS: Certification[] = [
  {
    name: "CFA Level 1 Candidate (November 2026)",
    detail:
      "Studying quant methods, equity, fixed income, derivatives, ethics · portfolio management.",
    Icon: GraduationCap,
  },
  {
    name: "Risk Management Specialisation · NYIF",
    detail:
      "95% VaR + Expected Shortfall · 4 equity indices · £5m+ portfolio risk scenarios.",
    Icon: Award,
  },
  {
    name: "M&A Specialisation · UIUC",
    detail:
      "6 courses · +12% return uplift modelled · 5 industries · 2 PE transactions analysed.",
    Icon: FileText,
  },
  {
    name: "Business Problem-Solving · Howard University",
    detail:
      "£1.2m portfolio · 6 decision models · regression and sensitivity analysis applied.",
    Icon: Award,
  },
  {
    name: "Meta Data Analyst Professional Certificate",
    detail:
      "SQL · Python · pandas · Tableau · 3 dashboards produced · 2 analyses completed.",
    Icon: Database,
  },
  {
    name: "IB Virtual Experience · HSBC & J.P. Morgan",
    detail:
      "£803m DCF built · 110.8% bid premium stress-tested · 5 M&A targets screened.",
    Icon: TrendingUp,
  },
  {
    name: "Bloomberg Market Concepts (BMC)",
    detail:
      "Economics · currencies · fixed income · equities fundamentals.",
    Icon: BarChart3,
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
// TiltCard — 3D pointer-following tilt + glare (preserved from original)
// ---------------------------------------------------------------------------

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(0.5)
  const rawY = useMotionValue(0.5)

  const springConfig = { stiffness: 260, damping: 28, mass: 0.6 }
  const smoothX = useSpring(rawX, springConfig)
  const smoothY = useSpring(rawY, springConfig)

  const rotateY = useTransform(smoothX, [0, 1], [-7, 7])
  const rotateX = useTransform(smoothY, [0, 1], [7, -7])

  const glareX = useTransform(smoothX, [0, 1], ["0%", "100%"])
  const glareY = useTransform(smoothY, [0, 1], ["0%", "100%"])
  const glareOpacityRaw = useMotionValue(0)
  const glareOpacity = useSpring(glareOpacityRaw, { stiffness: 200, damping: 30 })
  const glareBackground = useTransform(
    [glareX, glareY] as const,
    ([x, y]: string[]) =>
      `radial-gradient(circle at ${x} ${y}, rgba(191,224,232,0.2) 0%, transparent 65%)`,
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      rawX.set((e.clientX - rect.left) / rect.width)
      rawY.set((e.clientY - rect.top) / rect.height)
      glareOpacityRaw.set(1)
    },
    [rawX, rawY, glareOpacityRaw],
  )

  const handleMouseLeave = useCallback(() => {
    rawX.set(0.5)
    rawY.set(0.5)
    glareOpacityRaw.set(0)
  }, [rawX, rawY, glareOpacityRaw])

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <div style={{ perspective: "900px" }}>
      <motion.div
        ref={cardRef}
        className={cn("relative", className)}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{ opacity: glareOpacity, background: glareBackground }}
        />
      </motion.div>
    </div>
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
// FeaturedCaseStudy — larger 2-col layout on lg
// ---------------------------------------------------------------------------

function FeaturedCaseStudy({ cs }: { cs: CaseStudy }) {
  return (
    <Reveal delay={0.04}>
      <TiltCard
        className={cn(
          "rounded-2xl border border-deep-sea/10 bg-linen p-6 shadow-sm",
          "transition-shadow duration-300 hover:shadow-md hover:bg-linen/80",
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

          {/* Right: tactical visual */}
          {cs.Visual ? (
            <div
              aria-hidden="true"
              className="flex shrink-0 items-start justify-start lg:w-52 lg:justify-end"
            >
              <cs.Visual />
            </div>
          ) : null}
        </div>
      </TiltCard>
    </Reveal>
  )
}

// ---------------------------------------------------------------------------
// GridCaseStudy — compact card for 2-up grid
// ---------------------------------------------------------------------------

function GridCaseStudy({ cs, delay }: { cs: CaseStudy; delay: number }) {
  const reduce = useReducedMotion()

  const inner = (
    <div
      className={cn(
        "flex h-full flex-col gap-4 rounded-2xl border border-deep-sea/10 bg-linen p-5 shadow-sm",
        "transition-colors duration-300 hover:bg-linen/80 hover:shadow-md",
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

      {/* Tactical visual */}
      {cs.Visual ? (
        <div aria-hidden="true">
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
// CertCardInner — shared inner layout for cert cards
// ---------------------------------------------------------------------------

function CertCardInner({ cert }: { cert: Certification }) {
  return (
    <>
      <div className="flex-shrink-0">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-sea/10"
          aria-hidden="true"
        >
          <cert.Icon className="h-5 w-5 text-sea" />
        </div>
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold leading-snug text-deep-sea">
          {cert.name}
        </h3>
        <p className="mt-1 break-words text-xs leading-relaxed text-deep-sea/70">
          {cert.detail}
        </p>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// CertCard — stagger fade-in (no tilt; distinct from project cards)
// ---------------------------------------------------------------------------

function CertCard({ cert, index }: { cert: Certification; index: number }) {
  const reduce = useReducedMotion()
  const delay = 0.06 + index * 0.05

  if (reduce) {
    return (
      <article className="flex gap-4 rounded-2xl border border-deep-sea/10 bg-linen p-5 shadow-sm">
        <CertCardInner cert={cert} />
      </article>
    )
  }

  return (
    <motion.article
      className={cn(
        "flex gap-4 rounded-2xl border border-deep-sea/10 bg-linen p-5 shadow-sm",
        "transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md",
      )}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      <CertCardInner cert={cert} />
    </motion.article>
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

      {/* ── B: Certifications ── */}
      <div className="mt-16">
        <Reveal delay={0.04}>
          <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.22em] text-deep-sea/50">
            Certifications
          </h3>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {CERTIFICATIONS.map((cert, i) => (
            <CertCard key={cert.name} cert={cert} index={i} />
          ))}
        </div>
      </div>
    </Section>
  )
}
