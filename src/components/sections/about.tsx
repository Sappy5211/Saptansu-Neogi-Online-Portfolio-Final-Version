import { BarChart2, FileText, Search, TrendingUp } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import type { Variants } from "motion/react"

import { cn } from "@/lib/utils"
import { Reveal } from "@/components/ui/reveal"
import { Section, SectionHeading } from "@/components/ui/section"
import { EASE } from "@/lib/motion"

// ---------------------------------------------------------------------------
// Static data, all copy traced to SAPTANSU NEOGI, PORTFOLIO WEBSITE CONTENT
// ---------------------------------------------------------------------------

interface Stat {
  value: string
  label: string
}

/** "At a glance" panel — 4 stats displayed in a 2×2 grid card on the right. */
const STATS: Stat[] = [
  { value: "4", label: "Professional roles" },
  { value: "6+", label: "Finance specialisations" },
  { value: "Nov 2026", label: "CFA study target" },
  { value: "Jun 2026", label: "Available from" },
]

const FACTS = [
  "BSc Economics · First Class trajectory · University of Birmingham",
  "British citizen · full UK right to work",
  "Available June 2026",
] as const

interface Pillar {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: "true" }>
  title: string
  description: string
}

const PILLARS: Pillar[] = [
  {
    icon: FileText,
    title: "Finance reporting",
    description:
      "Month-end cycle improvements, board-pack accuracy and data governance inside a live finance division.",
  },
  {
    icon: BarChart2,
    title: "Data and analytics",
    description:
      "Power BI, Tableau, Python and SQL workflows that turn raw records into decision-ready outputs.",
  },
  {
    icon: TrendingUp,
    title: "Corporate finance modelling",
    description:
      "DCF, LBO and 3-statement models built to stress-test scenarios and frame investment risk/return.",
  },
  {
    icon: Search,
    title: "Consulting research",
    description:
      "ESG and strategic intelligence across a 10+ client portfolio, translated into executive decision briefs.",
  },
]

const TOOLS = [
  "Power BI",
  "Power Query",
  "Advanced Excel",
  "Tableau",
  "Python",
  "pandas",
  "SQL",
  "EDA",
  "STATA",
  "DCF Modelling",
  "LBO Modelling",
  "Back-testing",
]

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

/** Scale-pop variant for pillar cards, spring physics applied in transition. */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 22,
    },
  },
}

/** Container that staggers card children. */
const cardContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
}

/** Icon pop: scale + subtle rotation. */
const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -8 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: 0.12,
    },
  },
}

/** Container that staggers fact pill children. */
const pillContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.0,
    },
  },
}

/** Fact pill: cascade fade-in. */
const pillVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.36,
      ease: EASE,
    },
  },
}

/** Stat panel item stagger. */
const statContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
}

const statVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE },
  },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function About() {
  const reduce = useReducedMotion()

  return (
    <>
      {/*
        Component-scoped keyframe for the tools marquee.
        The @media (prefers-reduced-motion: reduce) block freezes the animation.
      */}
      <style>{`
        @keyframes about-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .about-marquee-track {
          animation: about-marquee 28s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .about-marquee-track {
            animation: none;
          }
        }
      `}</style>

      <Section
        id="about"
        aria-labelledby="finance-meets-data-insight-meets-action"
        className="bg-sand"
      >
        {/*
          TOP ROW — 2 columns on lg+
          LEFT: badge chip · heading · body paragraphs · fact pills
          RIGHT: "At a glance" stat card
        */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto] lg:gap-16 lg:items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="min-w-0">

            {/* Badge chip / degree eyebrow */}
            <Reveal>
              <span
                className={cn(
                  "inline-block rounded-full border border-deep-sea/15 bg-linen",
                  "px-3 py-1 text-xs font-medium text-deep-sea/70",
                )}
              >
                BSc Economics · First Class trajectory · University of Birmingham
              </span>
            </Reveal>

            {/* Heading — left-aligned, no centring className */}
            <Reveal delay={0.04}>
              <div className="mt-5">
                <SectionHeading
                  eyebrow="About"
                  title="Finance meets data. Insight meets action."
                />
              </div>
            </Reveal>

            {/* Body paragraphs */}
            <div className="mt-6 space-y-4">
              <Reveal delay={0.08}>
                <p className="text-base leading-relaxed text-deep-sea/80">
                  <span className="font-semibold text-deep-sea">First Class</span>{" "}
                  Economics student at the University of Birmingham working across
                  finance reporting, data analytics, corporate finance, risk
                  governance and consulting-style research. Experience spans live
                  finance-division work at Nationwide Building Society, where I
                  reduced the month-end reporting cycle by{" "}
                  <span className="font-semibold text-deep-sea">12%</span> and
                  remediated{" "}
                  <span className="font-semibold text-deep-sea">400+</span> records
                  , KPI-led operations at Young Asians in Finance, ESG and strategic
                  intelligence at Oxbridge Analytics &amp; Consultants, Python-based
                  trading strategy work and investment-banking simulation projects.
                </p>
              </Reveal>

              <Reveal delay={0.14}>
                <p className="text-base leading-relaxed text-deep-sea/80">
                  The through-line is analytical problem-solving across data-rich,
                  commercial environments: improving reporting accuracy, remediating
                  messy datasets, translating market research into decision briefs,
                  building valuation models and turning technical analysis into
                  outputs senior stakeholders can use.
                </p>
              </Reveal>
            </div>

            {/* Fact pills — left-aligned, below body copy */}
            <motion.div
              className="mt-6 flex flex-wrap gap-2"
              variants={reduce ? undefined : pillContainerVariants}
              initial={reduce ? undefined : "hidden"}
              whileInView={reduce ? undefined : "show"}
              viewport={{ once: true, margin: "-60px" }}
            >
              {FACTS.map((fact) =>
                reduce ? (
                  <span
                    key={fact}
                    className={cn(
                      "inline-block rounded-full border border-deep-sea/15 bg-linen",
                      "px-3 py-1 text-xs font-medium text-deep-sea/75",
                    )}
                  >
                    {fact}
                  </span>
                ) : (
                  <motion.span
                    key={fact}
                    variants={pillVariants}
                    className={cn(
                      "inline-block rounded-full border border-deep-sea/15 bg-linen",
                      "px-3 py-1 text-xs font-medium text-deep-sea/75",
                    )}
                  >
                    {fact}
                  </motion.span>
                ),
              )}
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN — "At a glance" stat card ── */}
          <Reveal delay={0.1}>
            <motion.div
              className={cn(
                "w-full rounded-2xl border border-deep-sea/10 bg-linen p-6 shadow-sm",
                "lg:w-64 xl:w-72",
              )}
              variants={reduce ? undefined : statContainerVariants}
              initial={reduce ? undefined : "hidden"}
              whileInView={reduce ? undefined : "show"}
              viewport={{ once: true, margin: "-60px" }}
              role="list"
              aria-label="At a glance"
            >
              <p className="mb-5 text-xs font-medium uppercase tracking-[0.22em] text-sea">
                At a glance
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:gap-x-10 lg:gap-x-6">
                {STATS.map((stat) =>
                  reduce ? (
                    <div
                      key={stat.label}
                      role="listitem"
                      className="flex flex-col gap-0.5"
                    >
                      <span className="text-2xl font-semibold text-deep-sea">
                        {stat.value}
                      </span>
                      <span className="text-xs leading-snug text-slate">
                        {stat.label}
                      </span>
                    </div>
                  ) : (
                    <motion.div
                      key={stat.label}
                      role="listitem"
                      variants={statVariants}
                      className="flex flex-col gap-0.5"
                    >
                      <span className="text-2xl font-semibold text-deep-sea">
                        {stat.value}
                      </span>
                      <span className="text-xs leading-snug text-slate">
                        {stat.label}
                      </span>
                    </motion.div>
                  ),
                )}
              </div>
            </motion.div>
          </Reveal>
        </div>

        {/* Divider hairline */}
        <div
          aria-hidden="true"
          className="mt-10 h-px w-16 rounded-full bg-shell"
        />

        {/* 4 pillars — full-width, 1→2→4 col, left-aligned cards */}
        <motion.div
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
          role="list"
          aria-label="Areas of expertise"
          variants={reduce ? undefined : cardContainerVariants}
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, margin: "-80px" }}
        >
          {PILLARS.map((pillar) =>
            reduce ? (
              /* Static render under prefers-reduced-motion */
              <div
                key={pillar.title}
                role="listitem"
                className={cn(
                  "flex h-full flex-col gap-3 rounded-2xl border border-deep-sea/10",
                  "bg-linen p-5 shadow-sm",
                  "transition-transform duration-300 hover:-translate-y-1 hover:shadow-md",
                )}
              >
                <pillar.icon
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-sea"
                />
                <h3 className="text-sm font-semibold tracking-tight text-deep-sea">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed text-deep-sea/70">
                  {pillar.description}
                </p>
              </div>
            ) : (
              /* Animated card */
              <motion.div
                key={pillar.title}
                role="listitem"
                variants={cardVariants}
                className={cn(
                  "flex h-full flex-col gap-3 rounded-2xl border border-deep-sea/10",
                  "bg-linen p-5 shadow-sm",
                  "transition-transform duration-300 hover:-translate-y-1 hover:shadow-md",
                )}
              >
                <motion.span
                  aria-hidden="true"
                  className="flex h-5 w-5 shrink-0 items-center justify-center text-sea"
                  variants={iconVariants}
                >
                  <pillar.icon aria-hidden="true" className="h-5 w-5" />
                </motion.span>
                <h3 className="text-sm font-semibold tracking-tight text-deep-sea">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed text-deep-sea/70">
                  {pillar.description}
                </p>
              </motion.div>
            ),
          )}
        </motion.div>

        {/* Tools marquee — full-width, slow, subtle, single row */}
        <Reveal delay={0.1}>
          <div
            className="mt-8 overflow-hidden"
            aria-label="Tools and skills"
            role="region"
          >
            {/*
              Duplicate the list to create a seamless loop.
              The CSS animation scrolls -50% (one copy width), then resets, no visible seam.
              Under reduced-motion the track animation is disabled (static display).
            */}
            <div className="about-marquee-track flex gap-3 will-change-transform">
              {[...TOOLS, ...TOOLS].map((tool, i) => (
                <span
                  // Safe key: combine tool name + index since list is duplicated
                  key={`${tool}-${i}`}
                  aria-hidden={i >= TOOLS.length ? "true" : undefined}
                  className={cn(
                    "inline-block shrink-0 rounded-full border border-deep-sea/12 bg-linen",
                    "px-3 py-1 text-xs font-medium text-deep-sea/65",
                  )}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
