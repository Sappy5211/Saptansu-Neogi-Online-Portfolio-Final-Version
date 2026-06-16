/**
 * projects.tsx — Projects & Certifications section
 *
 * Layout:
 *   - Case-study container: 3 ProjectCards in a responsive grid (sm:2 / lg:3).
 *   - ProjectCard: smooth 3D tilt on hover (useMotionValue + useSpring + useTransform,
 *     rotateX/Y ±10 deg, transformStyle preserve-3d, inner content translateZ).
 *     Coastal gradient bg per card (from-deep-sea to-sea) + dark scrim + SVG metric visual.
 *     Linen/white text, metric chip row, circular ArrowUpRight link, glass button.
 *     Reduced-motion: static card, no tilt.
 *   - Certifications: CertificateCoverflow kept exactly.
 *   - Reduced-motion aware; all animations via motion/react; no horizontal overflow.
 */

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useRef, useEffect, useCallback, useState } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
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
  /**
   * Compact SVG visual slot layered subtly into the card background area.
   * A function component so it can reference tokens.
   */
  Visual?: () => React.ReactElement
  /** Tailwind gradient classes for the card background */
  gradient: string
}

// ---------------------------------------------------------------------------
// Inline SVG visuals (on-brand, no stock photos) — rendered on the gradient bg
// ---------------------------------------------------------------------------

/** VoltaGrid: a simple bar chart showing 3 demand scenario return bars */
function VoltaGridVisual() {
  const ref = useRef<SVGSVGElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" })

  const bars = [
    { x: 14, h: 68, label: "Base", value: "22%", fill: "rgba(255,255,255,0.55)" },
    { x: 54, h: 90, label: "Up", value: "28%", fill: "rgba(217,164,65,0.65)" },
    { x: 94, h: 46, label: "Down", value: "14%", fill: "rgba(255,255,255,0.35)" },
  ]

  return (
    <svg
      ref={ref}
      viewBox="0 0 144 116"
      aria-hidden="true"
      className="w-full max-w-[8rem]"
      preserveAspectRatio="xMidYMid meet"
    >
      <line x1="4" y1="106" x2="140" y2="106" stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      {bars.map((bar) => (
        <g key={bar.label}>
          <motion.rect
            x={bar.x}
            y={106 - bar.h}
            width={28}
            height={bar.h}
            rx={4}
            fill={bar.fill}
            initial={{ scaleY: 0 }}
            animate={reduce || inView ? { scaleY: 1 } : { scaleY: 0 }}
            style={{ transformOrigin: `${bar.x + 14}px 106px` }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE, delay: 0.15 }}
          />
          <text
            x={bar.x + 14}
            y={106 - bar.h - 5}
            textAnchor="middle"
            fontSize={9}
            fill="rgba(255,255,255,0.75)"
            fontFamily="inherit"
          >
            {bar.value}
          </text>
          <text
            x={bar.x + 14}
            y={115}
            textAnchor="middle"
            fontSize={8}
            fill="rgba(255,255,255,0.45)"
            fontFamily="inherit"
          >
            {bar.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

/** AquaServe: leverage vs covenant headroom gauge */
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
    <svg
      ref={ref}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      aria-hidden="true"
      className="w-full max-w-[8rem]"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x={startX} y={barY} width={totalW} height={barH} rx={5} fill="rgba(255,255,255,0.12)" />
      <motion.rect
        x={startX}
        y={barY}
        width={fillW}
        height={barH}
        rx={5}
        fill="rgba(255,255,255,0.45)"
        initial={{ scaleX: 0 }}
        animate={reduce || inView ? { scaleX: 1 } : { scaleX: 0 }}
        style={{ transformOrigin: `${startX}px ${barY + barH / 2}px` }}
        transition={reduce ? { duration: 0 } : { duration: 0.8, ease: EASE, delay: 0.1 }}
      />
      <line
        x1={startX + totalW * 0.85}
        y1={barY - 4}
        x2={startX + totalW * 0.85}
        y2={barY + barH + 4}
        stroke="rgba(217,164,65,0.8)"
        strokeWidth={1.5}
        strokeDasharray="3 2"
      />
      <text x={startX} y={barY + barH + 13} fontSize={8} fill="rgba(255,255,255,0.45)" fontFamily="inherit">
        Debt
      </text>
      <text
        x={startX + totalW * 0.85}
        y={barY - 6}
        textAnchor="middle"
        fontSize={8}
        fill="rgba(217,164,65,0.8)"
        fontFamily="inherit"
      >
        Covenant
      </text>
    </svg>
  )
}

/** KPI dashboards: three mini sparklines */
function DashboardVisual() {
  const ref = useRef<SVGSVGElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-60px" })

  const sparklines = [
    { pts: "2,34 18,28 34,30 50,20 66,17 82,10", col: "rgba(255,255,255,0.6)" },
    { pts: "2,38 18,32 34,22 50,26 66,15 82,12", col: "rgba(217,164,65,0.65)" },
    { pts: "2,40 18,30 34,36 50,22 66,20 82,8",  col: "rgba(255,255,255,0.35)" },
  ]

  return (
    <svg
      ref={ref}
      viewBox="0 0 88 52"
      aria-hidden="true"
      className="w-full max-w-[8rem]"
      preserveAspectRatio="xMidYMid meet"
    >
      <motion.g
        initial={{ opacity: 0 }}
        animate={reduce || inView ? { opacity: 1 } : { opacity: 0 }}
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
          />
        ))}
      </motion.g>
      <line x1="2" y1="46" x2="86" y2="46" stroke="rgba(255,255,255,0.12)" strokeWidth={0.8} />
    </svg>
  )
}

const CASE_STUDIES: CaseStudy[] = [
  {
    label: "3-STATEMENT LBO · IC MEMO",
    title: "VoltaGrid Energy",
    subtitle: "Leveraged buyout model and investment committee memo",
    context: "Five-year, three-statement LBO modelled for a £45 m EV energy deal with a five-part IC memo.",
    metrics: [
      { value: "£45m", label: "Enterprise value" },
      { value: "2.4×", label: "MOIC (modelled)" },
      { value: "22%", label: "IRR (modelled)" },
    ],
    gradient: "from-[#14323b] to-[#1e5c6b]",
    Visual: VoltaGridVisual,
  },
  {
    label: "LBO MODEL · STRESS TESTING",
    title: "AquaServe UK",
    subtitle: "Entry-to-exit buyout model with downside testing",
    context: "Modelled a £43.3 m water-sector buyout at 8.0× EBITDA, stress-testing leverage and covenant headroom.",
    metrics: [
      { value: "£43.3m", label: "Deal size" },
      { value: "8.0×", label: "EBITDA entry" },
      { value: "2.1×", label: "MOIC (modelled)" },
    ],
    gradient: "from-[#14323b] to-[#2b7a8c]",
    Visual: AquaServeVisual,
  },
  {
    label: "ANALYTICS · DASHBOARDS",
    title: "Multi-source KPI Dashboards",
    subtitle: "Multi-source KPI analytics with Python EDA",
    context: "Three Tableau dashboards across three business areas plus two Python pandas analyses end to end.",
    metrics: [
      { value: "3", label: "Dashboards" },
      { value: "2", label: "Python analyses" },
      { value: "3", label: "Business areas" },
    ],
    gradient: "from-[#1e5c6b] to-[#14323b]",
    Visual: DashboardVisual,
  },
]

// ---------------------------------------------------------------------------
// Data — Certifications (4 completed certs)
// ---------------------------------------------------------------------------

interface CertSkill {
  label: string
}

interface CertEntry {
  issuer: string
  title: string
  blurb: React.ReactNode
  skills: CertSkill[]
  image?: string
}

const CERTIFICATIONS: CertEntry[] = [
  {
    issuer: "New York Institute of Finance",
    title: "Risk Management Specialisation",
    image: "/certs/risk-management.jpg",
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
    image: "/certs/ma-specialisation.jpg",
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
    image: "/certs/howard-problem-solving.jpg",
    blurb: (
      <>
        Excel-based decision modelling. Built{" "}
        <span className="font-semibold text-deep-sea">six</span> spreadsheet models on a{" "}
        <span className="font-semibold text-deep-sea">£1.2 m</span> portfolio, applying single and
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
    issuer: "J.P. Morgan",
    title: "Investment Banking Job Simulation",
    image: "/certs/jpmorgan-ib.jpg",
    blurb: (
      <>
        Completed J.P. Morgan&apos;s investment banking job simulation. Screened{" "}
        <span className="font-semibold text-deep-sea">five</span> M&A targets, ran the financial
        analysis including a DCF for an{" "}
        <span className="font-semibold text-deep-sea">£803 m</span> beverage-sector deal, and
        stress-tested a{" "}
        <span className="font-semibold text-deep-sea">110.8%</span> bid premium before making an
        investment recommendation.
      </>
    ),
    skills: [
      { label: "DCF Valuation" },
      { label: "M&A Screening" },
      { label: "Auction Process" },
      { label: "Bid Premium Analysis" },
      { label: "Investment Recommendation" },
    ],
  },
  {
    issuer: "HSBC",
    title: "Global Banking & Markets Job Simulation",
    image: "/certs/hsbc-gbm.jpg",
    blurb: (
      <>
        Completed HSBC&apos;s Global Banking and Markets job simulation. Across{" "}
        <span className="font-semibold text-deep-sea">six</span> practical tasks, identified M&A
        targets for an offshore expansion, produced a debt market update, analysed a debt financing
        opportunity and matched trading ideas and products to a client.
      </>
    ),
    skills: [
      { label: "M&A Screening" },
      { label: "Debt Capital Markets" },
      { label: "Trade Ideas" },
      { label: "Client Solutions" },
      { label: "Markets" },
    ],
  },
]

// ---------------------------------------------------------------------------
// parseMetricValue — splits "£45m" => { prefix, number, suffix, decimalPlaces }
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
// CountUpValue — animates 0 -> target on viewport entry
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
// ProjectCard — 3D tilt card with coastal gradient bg + overlay content
// Adapted from InteractiveTravelCard pattern.
// Reduced-motion: renders as a plain static card with no tilt.
// ---------------------------------------------------------------------------

const TILT_MAX = 10 // degrees

function ProjectCard({ cs, delay = 0 }: { cs: CaseStudy; delay?: number }) {
  const reduce = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)

  // Raw pointer values
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  // Smoothed springs — damp ~15, stiffness ~150
  const springConfig = { damping: 15, stiffness: 150 }
  const springX = useSpring(rawX, springConfig)
  const springY = useSpring(rawY, springConfig)

  // Map spring values to rotateX / rotateY
  const rotateX = useTransform(springY, [-0.5, 0.5], [TILT_MAX, -TILT_MAX])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-TILT_MAX, TILT_MAX])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    rawX.set(0)
    rawY.set(0)
  }

  // Static card for reduced motion
  if (reduce) {
    return (
      <div
        className={cn(
          "relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-2xl",
          "bg-gradient-to-br",
          cs.gradient,
        )}
      >
        <StaticCardInner cs={cs} />
      </div>
    )
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        // Prevent the 3D element from contributing to page width
        willChange: "transform",
      }}
      className={cn(
        "relative flex h-full min-h-[360px] cursor-default flex-col overflow-hidden rounded-2xl",
        "bg-gradient-to-br",
        cs.gradient,
      )}
    >
      <AnimatedCardInner cs={cs} />
    </motion.div>
  )
}

/** Inner content shared — elevated via translateZ for the 3D depth effect */
function AnimatedCardInner({ cs }: { cs: CaseStudy }) {
  return (
    <div
      className="relative flex h-full flex-1 flex-col"
      style={{ transform: "translateZ(28px)", transformStyle: "preserve-3d" }}
    >
      <CardContent cs={cs} />
    </div>
  )
}

/** Static inner for reduced-motion */
function StaticCardInner({ cs }: { cs: CaseStudy }) {
  return (
    <div className="relative flex h-full flex-1 flex-col">
      <CardContent cs={cs} />
    </div>
  )
}

/** Shared card content: dark scrim + visual + overlay text */
function CardContent({ cs }: { cs: CaseStudy }) {
  return (
    <>
      {/* SVG visual — subtly layered in the upper portion */}
      {cs.Visual ? (
        <div
          aria-hidden="true"
          className="absolute right-6 top-6 opacity-40"
        >
          <cs.Visual />
        </div>
      ) : null}

      {/* Dark gradient scrim for text contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 to-deep-sea/70"
      />

      {/* Top-right circular ArrowUpRight link */}
      <div className="relative z-10 flex justify-end p-4">
        <a
          href="#"
          aria-label={`Open ${cs.title} case study (coming soon)`}
          aria-disabled="true"
          onClick={(e) => e.preventDefault()}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
            "bg-white/15 backdrop-blur-sm ring-1 ring-white/25",
            "text-white/90 transition-colors duration-200 hover:bg-white/25",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1",
          )}
        >
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">Open {cs.title} (coming soon)</span>
        </a>
      </div>

      {/* Bottom overlay: label + title + subtitle + context + chips + button */}
      <div className="relative z-10 mt-auto flex flex-col gap-3 p-5 pt-0">
        {/* Eyebrow label */}
        <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/55">
          {cs.label}
        </p>

        {/* Title */}
        <h3 className="text-lg font-semibold leading-snug tracking-tight text-white">
          {cs.title}
        </h3>

        {/* Subtitle */}
        <p className="text-xs font-medium text-white/70">{cs.subtitle}</p>

        {/* Short context line */}
        <p className="text-xs leading-relaxed text-white/60">{cs.context}</p>

        {/* Metric chip row */}
        <div className="flex flex-wrap gap-2 pt-0.5">
          {cs.metrics.map((m, i) => (
            <div
              key={m.label}
              className={cn(
                "flex flex-col items-start rounded-lg px-2.5 py-1.5",
                "bg-white/10 ring-1 ring-white/15",
              )}
            >
              <span
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  i === 0 ? "text-[#d9a441]" : "text-white",
                )}
              >
                <CountUpValue value={m.value} />
              </span>
              <span className="text-[9px] uppercase tracking-[0.12em] text-white/50">
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* Glass "Read case study" button */}
        <a
          href="#"
          aria-label={`Read ${cs.title} case study (coming soon)`}
          aria-disabled="true"
          onClick={(e) => e.preventDefault()}
          className={cn(
            "mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5",
            "bg-white/10 backdrop-blur-sm ring-1 ring-white/20",
            "text-sm font-medium text-white/90",
            "transition-colors duration-200 hover:bg-white/20",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1",
          )}
        >
          Read case study
          <span className="sr-only">(coming soon)</span>
        </a>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// CertificateFrame — on-brand styled placeholder; swaps to <img> when image set
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
        {/* Corner brackets - top-left */}
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
// CertificateCoverflow -- text left, 3D coverflow right (kept exactly)
// ---------------------------------------------------------------------------

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
    transition: "transform 420ms cubic-bezier(0.4, 0, 0.2, 1), opacity 420ms ease, filter 420ms ease",
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
      filter: "none",
      zIndex: 10,
      pointerEvents: "auto",
    }
  }
  if (position === "prev") {
    return {
      ...BASE,
      transform: "translateX(-50%) translateX(-42%) translateZ(-80px) rotateY(18deg) scale(0.78)",
      left: "50%",
      opacity: 0.38,
      filter: "blur(1.5px) brightness(0.75)",
      zIndex: 5,
      pointerEvents: "none",
    }
  }
  return {
    ...BASE,
    transform: "translateX(-50%) translateX(42%) translateZ(-80px) rotateY(-18deg) scale(0.78)",
    left: "50%",
    opacity: 0.38,
    filter: "blur(1.5px) brightness(0.75)",
    zIndex: 5,
    pointerEvents: "none",
  }
}

function CertificateCoverflow() {
  const reduce = useReducedMotion()
  const total = CERTIFICATIONS.length
  const [active, setActive] = useState(0)
  const regionRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback(
    (index: number) => {
      setActive((index + total) % total)
    },
    [total],
  )

  const goPrev = useCallback(() => goTo(active - 1), [active, goTo])
  const goNext = useCallback(() => goTo(active + 1), [active, goTo])

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

  const getPosition = (i: number): "prev" | "active" | "next" | null => {
    if (i === active) return "active"
    if (i === prevIndex) return "prev"
    if (i === nextIndex) return "next"
    return null
  }

  const blurbKey = active

  return (
    <div
      ref={regionRef}
      role="region"
      aria-label="Certifications"
      tabIndex={0}
      className="overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-4 rounded-2xl"
    >
      <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-14 lg:gap-20">

        {/* LEFT: active cert text */}
        <div className="flex min-w-0 flex-[0_0_auto] flex-col gap-5 md:w-[42%] lg:w-[38%]">
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

        {/* RIGHT: 3D coverflow of certificate frames */}
        <div
          aria-hidden="true"
          className="relative min-w-0 flex-1"
          style={{ perspective: reduce ? "none" : "900px" }}
        >
          <div
            className="relative w-full overflow-hidden rounded-xl"
            style={{ paddingBottom: "64%" }}
          >
            {CERTIFICATIONS.map((cert, i) => {
              const pos = getPosition(i)
              if (!pos) return null

              return (
                <div
                  key={cert.title}
                  style={{
                    ...getCoverflowStyle(pos, reduce),
                    width: "60%",
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

          <p className="mt-3 text-center text-[10px] text-slate/60">
            {active + 1} / {total}
          </p>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section heading ID
// ---------------------------------------------------------------------------

const HEADING_TITLE = "Self-directed builds and credentials"
const HEADING_ID = HEADING_TITLE.toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function Projects() {
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

      {/* Case studies */}
      <div className="mt-12">
        <Reveal delay={0.04}>
          <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.22em] text-deep-sea/50">
            Projects
          </h3>
        </Reveal>

        {/*
          Outer wrapper: overflow-hidden prevents any preserve-3d tilt from
          causing horizontal page overflow while keeping clip within the section.
        */}
        <div className="overflow-hidden rounded-2xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CASE_STUDIES.map((cs, i) => (
              <ProjectCard key={cs.title} cs={cs} delay={0.06 + i * 0.08} />
            ))}
          </div>
        </div>
      </div>

      {/* Certifications coverflow */}
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
