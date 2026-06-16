import { ArrowUpRight, BarChart2, FileText, Search, TrendingUp } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import type { Variants } from "motion/react"

import { cn } from "@/lib/utils"
import { Reveal } from "@/components/ui/reveal"
import { Section, SectionHeading } from "@/components/ui/section"
import { EASE } from "@/lib/motion"

// ---------------------------------------------------------------------------
// Static data, all copy traced to SAPTANSU NEOGI, PORTFOLIO WEBSITE CONTENT
// ---------------------------------------------------------------------------

interface MiniStat {
  value: string
  label: string
}

/** Mini-stat grid inside the "at a glance" card. */
const MINI_STATS: MiniStat[] = [
  { value: "4", label: "Roles" },
  { value: "6", label: "Specialisations" },
  { value: "CFA L1", label: "Nov 2026" },
  { value: "Jun 2026", label: "Available" },
]

const FACTS = [
  "British citizen · full UK right to work",
  "Available June 2026",
] as const

interface Pillar {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: "true" }>
  title: string
  description: string
  href: string
}

const PILLARS: Pillar[] = [
  {
    icon: FileText,
    title: "Finance reporting",
    description:
      "Month-end cycle improvements, board-pack accuracy and data governance inside a live finance division.",
    href: "#exp-nationwide",
  },
  {
    icon: BarChart2,
    title: "Data and analytics",
    description:
      "Power BI, Tableau, Python and SQL workflows that turn raw records into decision-ready outputs.",
    href: "#exp-yaf",
  },
  {
    icon: TrendingUp,
    title: "Corporate finance modelling",
    description:
      "DCF, LBO and 3-statement models built to stress-test scenarios and frame investment risk/return.",
    href: "#exp-fintech",
  },
  {
    icon: Search,
    title: "Consulting research",
    description:
      "ESG and strategic intelligence across a 10+ client portfolio, translated into executive decision briefs.",
    href: "#exp-oxbridge",
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
          LEFT:  badge chip · heading · body paragraphs · fact pills
          RIGHT: "At a glance" card with primary stat + mini-stat grid + status pills
        */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:items-start">

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

            {/* Heading */}
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

            {/* Fact pills */}
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

          {/* ── RIGHT COLUMN — "At a glance" card ── */}
          <Reveal delay={0.1}>
            <motion.div
              className="w-full rounded-2xl border border-deep-sea/10 bg-linen p-6 shadow-sm"
              variants={reduce ? undefined : statContainerVariants}
              initial={reduce ? undefined : "hidden"}
              whileInView={reduce ? undefined : "show"}
              viewport={{ once: true, margin: "-60px" }}
              role="region"
              aria-label="At a glance"
            >
              {/* Label */}
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-sea">
                At a glance
              </p>

              {/* Primary stat — degree */}
              {reduce ? (
                <div className="mb-5 pb-5 border-b border-deep-sea/8">
                  <p className="text-2xl font-semibold leading-tight text-deep-sea">
                    First Class
                  </p>
                  <p className="mt-1 text-sm leading-snug text-deep-sea/70">
                    BSc Economics, University of Birmingham
                  </p>
                </div>
              ) : (
                <motion.div
                  variants={statVariants}
                  className="mb-5 pb-5 border-b border-deep-sea/8"
                >
                  <p className="text-2xl font-semibold leading-tight text-deep-sea">
                    First Class
                  </p>
                  <p className="mt-1 text-sm leading-snug text-deep-sea/70">
                    BSc Economics, University of Birmingham
                  </p>
                </motion.div>
              )}

              {/* Mini-stat 2x2 grid with dividers */}
              <div
                className="grid grid-cols-2 divide-x divide-y divide-deep-sea/8"
                role="list"
                aria-label="Quick stats"
              >
                {MINI_STATS.map((stat, i) =>
                  reduce ? (
                    <div
                      key={stat.label}
                      role="listitem"
                      className={cn(
                        "flex flex-col gap-0.5 p-3",
                        i === 0 && "pl-0 pt-0",
                        i === 1 && "pt-0",
                        i === 2 && "pl-0",
                      )}
                    >
                      <span className="text-lg font-semibold leading-tight text-deep-sea">
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
                      className={cn(
                        "flex flex-col gap-0.5 p-3",
                        i === 0 && "pl-0 pt-0",
                        i === 1 && "pt-0",
                        i === 2 && "pl-0",
                      )}
                    >
                      <span className="text-lg font-semibold leading-tight text-deep-sea">
                        {stat.value}
                      </span>
                      <span className="text-xs leading-snug text-slate">
                        {stat.label}
                      </span>
                    </motion.div>
                  ),
                )}
              </div>

              {/* Status pills */}
              {reduce ? (
                <div className="mt-5 pt-5 border-t border-deep-sea/8 flex flex-wrap gap-2">
                  <span className="inline-block rounded-full bg-sea/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-sea">
                    Available Jun 2026
                  </span>
                  <span className="inline-block rounded-full bg-deep-sea/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-deep-sea/70">
                    Open to roles
                  </span>
                </div>
              ) : (
                <motion.div
                  variants={statVariants}
                  className="mt-5 pt-5 border-t border-deep-sea/8 flex flex-wrap gap-2"
                >
                  <span className="inline-block rounded-full bg-sea/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-sea">
                    Available Jun 2026
                  </span>
                  <span className="inline-block rounded-full bg-deep-sea/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-deep-sea/70">
                    Open to roles
                  </span>
                </motion.div>
              )}
            </motion.div>
          </Reveal>
        </div>

        {/* Divider hairline */}
        <div
          aria-hidden="true"
          className="mt-10 h-px w-16 rounded-full bg-shell"
        />

        {/* 4 pillars — full-width, 1->2->4 col, left-aligned cards with deep-link anchors */}
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
                )}
              >
                <pillar.icon
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-sea"
                />
                <h3 className="text-sm font-semibold tracking-tight text-deep-sea">
                  {pillar.title}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-deep-sea/70">
                  {pillar.description}
                </p>
                <a
                  href={pillar.href}
                  className={cn(
                    "mt-1 inline-flex items-center gap-1 text-xs font-medium text-sea",
                    "underline-offset-2 hover:underline focus-visible:outline-none",
                    "focus-visible:ring-2 focus-visible:ring-sea/50 focus-visible:rounded",
                  )}
                  aria-label={`Find out more about ${pillar.title}`}
                >
                  Find out more
                  <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
                </a>
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
                <p className="flex-1 text-sm leading-relaxed text-deep-sea/70">
                  {pillar.description}
                </p>
                <a
                  href={pillar.href}
                  className={cn(
                    "mt-1 inline-flex items-center gap-1 text-xs font-medium text-sea",
                    "underline-offset-2 hover:underline focus-visible:outline-none",
                    "focus-visible:ring-2 focus-visible:ring-sea/50 focus-visible:rounded",
                  )}
                  aria-label={`Find out more about ${pillar.title}`}
                >
                  Find out more
                  <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
                </a>
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
