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

/** "At a glance" strip, distinct from the hero's metric row. */
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

/** Stat strip item stagger. */
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
        {/* Badge chip, degree eyebrow above heading */}
        <Reveal>
          <div className="flex justify-center">
            <span
              className={cn(
                "inline-block rounded-full border border-deep-sea/15 bg-linen",
                "px-3 py-1 text-xs font-medium text-deep-sea/70",
              )}
            >
              BSc Economics · First Class trajectory · University of Birmingham
            </span>
          </div>
        </Reveal>

        {/* Heading, centred */}
        <Reveal delay={0.04}>
          <div className="mt-5 flex flex-col items-center text-center">
            <SectionHeading
              eyebrow="About"
              title="Finance meets data. Insight meets action."
              className="mx-auto max-w-2xl items-center text-center [&>p]:text-center [&>h2]:text-center"
            />
          </div>
        </Reveal>

        {/* Body copy, centred reading column */}
        <div className="mt-8 mx-auto max-w-2xl space-y-4 text-center">
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

        {/* "At a glance" stat strip, centred, compact */}
        <Reveal delay={0.18}>
          <motion.div
            className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-x-10 gap-y-6 sm:gap-x-14"
            variants={reduce ? undefined : statContainerVariants}
            initial={reduce ? undefined : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={{ once: true, margin: "-60px" }}
            role="list"
            aria-label="At a glance"
          >
            {STATS.map((stat) =>
              reduce ? (
                <div
                  key={stat.label}
                  role="listitem"
                  className="flex flex-col items-center gap-0.5"
                >
                  <span className="text-2xl font-semibold text-deep-sea sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="text-xs text-slate">{stat.label}</span>
                </div>
              ) : (
                <motion.div
                  key={stat.label}
                  role="listitem"
                  variants={statVariants}
                  className="flex flex-col items-center gap-0.5"
                >
                  <span className="text-2xl font-semibold text-deep-sea sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="text-xs text-slate">{stat.label}</span>
                </motion.div>
              ),
            )}
          </motion.div>
        </Reveal>

        {/* Divider hairline */}
        <div
          aria-hidden="true"
          className="mx-auto mt-10 h-px w-16 rounded-full bg-shell"
        />

        {/* 4 pillars, centred icons and text */}
        <motion.div
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
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
                  "flex h-full flex-col items-center gap-3 rounded-2xl border border-deep-sea/10",
                  "bg-linen p-5 text-center shadow-sm",
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
                  "flex h-full flex-col items-center gap-3 rounded-2xl border border-deep-sea/10",
                  "bg-linen p-5 text-center shadow-sm",
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

        {/* Tools marquee, slow, subtle, single row */}
        <Reveal delay={0.1}>
          <div
            className="mx-auto mt-10 max-w-2xl overflow-hidden"
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

        {/* Fact pills, centred */}
        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-2"
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
      </Section>
    </>
  )
}
