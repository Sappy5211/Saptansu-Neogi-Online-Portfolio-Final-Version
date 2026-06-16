import { GraduationCap, Award, FileText } from "lucide-react"
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

interface ProjectMetric {
  value: string
  label: string
}

interface Project {
  title: string
  scope: string
  results: string[]
  metrics: ProjectMetric[]
}

const PROJECTS: Project[] = [
  {
    title: "VoltaGrid Energy",
    scope: "3-statement LBO + IC memo",
    results: [
      "£45m enterprise value modelled with 3-statement integrated LBO",
      "Modelled 2.4× MOIC and 22% IRR across 3 demand scenarios",
      "Produced 5-part investment committee memo framing the risk/return case",
    ],
    metrics: [
      { value: "£45m", label: "Enterprise value" },
      { value: "2.4×", label: "MOIC (modelled)" },
      { value: "22%", label: "IRR (modelled)" },
      { value: "3", label: "Demand scenarios" },
    ],
  },
  {
    title: "AquaServe UK",
    scope: "LBO model · infrastructure deal",
    results: [
      "£43.3m buyout modelled at 8.0× EBITDA entry multiple",
      "Base case modelled at 2.1× MOIC and 20%+ IRR across 3 exit scenarios",
      "Downside stress tests applied to leverage ratios and cash-flow coverage",
    ],
    metrics: [
      { value: "£43.3m", label: "Deal size" },
      { value: "8.0×", label: "EBITDA entry" },
      { value: "2.1×", label: "MOIC (modelled)" },
      { value: "20%+", label: "IRR (base case)" },
    ],
  },
  {
    title: "KPI Dashboards + Python EDA",
    scope: "Multi-source analytics across 3 business areas",
    results: [
      "3 Tableau dashboards visualising KPIs across 3 business areas",
      "2 end-to-end pandas analyses using EDA and data visualisation workflows",
      "SQL and LLM-assisted prompting used to accelerate code and query generation",
    ],
    metrics: [
      { value: "3", label: "Tableau dashboards" },
      { value: "2", label: "Python analyses" },
      { value: "3", label: "Business areas" },
    ],
  },
]

interface Certification {
  name: string
  detail: string
  Icon: LucideIcon
}

const CERTIFICATIONS: Certification[] = [
  {
    name: "CFA Level 1 Candidate (November 2026)",
    detail: "Studying quant methods, equity, fixed income, derivatives, ethics and portfolio management.",
    Icon: GraduationCap,
  },
  {
    name: "Risk Management Specialisation · NYIF",
    detail: "95% VaR + Expected Shortfall; 4 equity indices; £5m+ portfolio risk scenarios.",
    Icon: Award,
  },
  {
    name: "M&A Specialisation · UIUC",
    detail: "6 courses; +12% return uplift modelled; 5 industries; 2 PE transactions analysed.",
    Icon: FileText,
  },
  {
    name: "Business Problem-Solving · Howard University",
    detail: "£1.2m portfolio; 6 decision models; regression and sensitivity analysis applied.",
    Icon: Award,
  },
  {
    name: "Meta Data Analyst Professional Certificate",
    detail: "SQL, Python, pandas, Tableau; 3 dashboards produced; 2 analyses completed.",
    Icon: FileText,
  },
  {
    name: "IB Virtual Experience · HSBC & J.P. Morgan",
    detail: "£803m DCF built; 110.8% bid premium stress-tested; 5 M&A targets screened.",
    Icon: GraduationCap,
  },
  {
    name: "Bloomberg Market Concepts (BMC)",
    detail: "Economics, currencies, fixed income and equities fundamentals.",
    Icon: Award,
  },
]

// ---------------------------------------------------------------------------
// parseMetricValue — splits "£45m" → { prefix:"£", number:45, suffix:"m", decimalPlaces:0 }
// ---------------------------------------------------------------------------

interface ParsedMetric {
  prefix: string
  number: number
  suffix: string
  decimalPlaces: number
}

function parseMetricValue(value: string): ParsedMetric | null {
  // Captures: (optional non-digit prefix)(integer or decimal)(rest as suffix)
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
// CountUpValue — animates metric from 0 → target when card enters viewport
// ---------------------------------------------------------------------------

interface CountUpValueProps {
  value: string
}

function CountUpValue({ value }: CountUpValueProps) {
  const reduce = useReducedMotion()
  const parsed = parseMetricValue(value)

  // Sentinel ref for IntersectionObserver; also the rendered span target
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)

  // useInView must be called unconditionally
  const inView = useInView(wrapperRef, { once: true })

  // useMotionValue must be called unconditionally
  const mv = useMotionValue(0)

  useEffect(() => {
    if (reduce || !parsed || !inView || !spanRef.current) return

    const { prefix, number: target, suffix, decimalPlaces } = parsed

    // Animate the MotionValue 0 → target
    const controls = animate(mv, target, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    })

    // Write to DOM on every tick to avoid React re-render overhead
    const unsubscribe = mv.on("change", (v: number) => {
      if (spanRef.current) {
        spanRef.current.textContent = prefix + v.toFixed(decimalPlaces) + suffix
      }
    })

    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [inView, reduce, mv, parsed])

  // Reduced-motion or unparseable: show literal value immediately
  if (reduce || !parsed) {
    return <span className="tabular-nums">{value}</span>
  }

  const { prefix, suffix, decimalPlaces } = parsed
  // Initial display shows "0" (with same decimal places) to avoid width jitter
  const initialText = prefix + (0).toFixed(decimalPlaces) + suffix

  return (
    <span className="tabular-nums" ref={wrapperRef}>
      <span ref={spanRef}>{initialText}</span>
    </span>
  )
}

// ---------------------------------------------------------------------------
// TiltCard — 3D pointer-following tilt + soft glare overlay (project cards)
// ---------------------------------------------------------------------------

interface TiltCardProps {
  children: React.ReactNode
  className?: string
}

function TiltCard({ children, className }: TiltCardProps) {
  const reduce = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)

  // Raw pointer position normalised 0–1 relative to card dimensions
  const rawX = useMotionValue(0.5)
  const rawY = useMotionValue(0.5)

  // Spring smoothing so tilt feels physical, not snappy
  const springConfig = { stiffness: 260, damping: 28, mass: 0.6 }
  const smoothX = useSpring(rawX, springConfig)
  const smoothY = useSpring(rawY, springConfig)

  // Map 0–1 → ±7deg
  const rotateY = useTransform(smoothX, [0, 1], [-7, 7])
  const rotateX = useTransform(smoothY, [0, 1], [7, -7])

  // Glare: sky-mist radial gradient that follows cursor, fades in/out
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

  // Under reduced motion: plain div, no tilt
  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    // Perspective wrapper — outside the motion element to keep stacking context clean
    <div style={{ perspective: "900px" }}>
      <motion.div
        ref={cardRef}
        className={cn("relative", className)}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}

        {/* Glare overlay — decorative, pointer-events disabled */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            opacity: glareOpacity,
            background: glareBackground,
          }}
        />
      </motion.div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ProjectCard
// ---------------------------------------------------------------------------

interface ProjectCardProps {
  project: Project
  delay: number
}

function ProjectCard({ project, delay }: ProjectCardProps) {
  return (
    <Reveal delay={delay}>
      <TiltCard
        className={cn(
          "flex h-full flex-col rounded-2xl border border-deep-sea/10 bg-linen p-6 shadow-sm",
          "transition-shadow duration-300 hover:shadow-md",
        )}
      >
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold tracking-tight text-deep-sea">
            {project.title}
          </h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-sea">
            {project.scope}
          </p>
        </div>

        {/* Results */}
        <ul className="mb-6 flex-1 space-y-2" aria-label={`${project.title} outcomes`}>
          {project.results.map((result) => (
            <li
              key={result}
              className="flex gap-2 text-sm leading-relaxed text-deep-sea/75"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sea"
              />
              {result}
            </li>
          ))}
        </ul>

        {/* Metric row with count-up values */}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-deep-sea/10 pt-4 sm:grid-cols-4">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="min-w-0">
              <dt className="text-xs text-slate">{metric.label}</dt>
              <dd className="mt-0.5 text-base font-semibold text-golden-hour">
                <CountUpValue value={metric.value} />
              </dd>
            </div>
          ))}
        </dl>
      </TiltCard>
    </Reveal>
  )
}

// ---------------------------------------------------------------------------
// CertCardInner — shared inner layout
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
        <p className="mt-1 text-xs leading-relaxed text-deep-sea/70 break-words">
          {cert.detail}
        </p>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// CertCard — stagger fade-in only (no tilt, distinct from project cards)
// ---------------------------------------------------------------------------

interface CertCardProps {
  cert: Certification
  index: number
}

function CertCard({ cert, index }: CertCardProps) {
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

      {/* ── A: Projects ── */}
      <div className="mt-12">
        <Reveal delay={0.04}>
          <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.22em] text-deep-sea/50">
            Projects
          </h3>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} delay={0.06 + i * 0.06} />
          ))}
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
