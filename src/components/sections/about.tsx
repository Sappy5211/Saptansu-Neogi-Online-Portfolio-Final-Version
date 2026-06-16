import { BarChart2, FileText, Search, TrendingUp } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import type { Variants } from "motion/react"

import { cn } from "@/lib/utils"
import { Reveal } from "@/components/ui/reveal"
import { Section, SectionHeading } from "@/components/ui/section"
import { EASE } from "@/lib/motion"

// ---------------------------------------------------------------------------
// Static data — all copy traced to SAPTANSU NEOGI — PORTFOLIO WEBSITE CONTENT
// ---------------------------------------------------------------------------

const FACTS = [
  "First Class Economics (expected)",
  "University of Birmingham",
  "CFA Level 1 Candidate (November 2026)",
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

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

/** Scale-pop variant for pillar cards — spring physics applied in transition. */
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

/** Fact pill: cascade from left. */
const pillVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.36,
      ease: EASE,
    },
  },
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Animated underline for the section h2. Draws in from left (scaleX 0→1)
 * once the heading enters the viewport. Under prefers-reduced-motion it
 * renders static at full width with no animation.
 */
function AnimatedUnderline({ reduce }: { reduce: boolean | null }) {
  if (reduce) {
    return (
      <span
        aria-hidden="true"
        className="mt-2 block h-[3px] w-14 origin-left rounded-full bg-golden-hour"
      />
    )
  }

  return (
    <motion.span
      aria-hidden="true"
      className="mt-2 block h-[3px] w-14 origin-left rounded-full bg-golden-hour"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}
      style={{ transformOrigin: "left center" }}
    />
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function About() {
  const reduce = useReducedMotion()

  return (
    <Section
      id="about"
      aria-labelledby="finance-meets-data-insight-meets-action"
      className="bg-sand"
    >
      {/* Heading + animated underline */}
      <Reveal>
        <div>
          <SectionHeading
            eyebrow="About"
            title="Finance meets data. Insight meets action."
          />
          <AnimatedUnderline reduce={reduce} />
        </div>
      </Reveal>

      {/* Body copy — max-w-2xl reading column */}
      <div className="mt-8 max-w-2xl space-y-4">
        <Reveal delay={0.06}>
          <p className="text-base leading-relaxed text-deep-sea/80">
            First Class Economics student at the University of Birmingham working
            across finance reporting, data analytics, corporate finance, risk
            governance and consulting-style research. Experience spans live
            finance-division work at Nationwide Building Society, KPI-led
            operations at Young Asians in Finance, ESG and strategic intelligence
            at Oxbridge Analytics, Python-based trading strategy work and
            investment-banking simulation projects.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="text-base leading-relaxed text-deep-sea/80">
            The through-line is analytical problem-solving across data-rich,
            commercial environments: improving reporting accuracy, remediating
            messy datasets, translating market research into decision briefs,
            building valuation models and turning technical analysis into outputs
            senior stakeholders can use.
          </p>
        </Reveal>
      </div>

      {/* Fact pills — cascade left→right with stagger */}
      <motion.div
        className="mt-8 flex flex-wrap gap-2"
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

      {/* Pillar cards — staggered scale-pop */}
      <motion.div
        className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
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
    </Section>
  )
}
