/**
 * experience.tsx — Work Experience section.
 *
 * Vertical accordion: one open at a time, first open by default.
 * Each panel reveals a bento grid of SVG stat cards (stat-visuals.tsx)
 * then remaining detail bullets.
 *
 * Motion: motion/react AnimatePresence; height 0→auto + opacity + y-slide.
 * Reduced-motion: instant show/hide, no transforms.
 * A11y: real <button> with aria-expanded/aria-controls, region role,
 *        visible focus rings, decorative icons aria-hidden.
 */

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  Building2,
  ChevronDown,
  ClipboardCheck,
  Code2,
  Database,
  FileText,
  LineChart,
  Megaphone,
  NotebookPen,
  Search,
  Ticket,
  TrendingUp,
  Workflow,
} from "lucide-react"

import { Section, SectionHeading } from "@/components/ui/section"
import { Reveal } from "@/components/ui/reveal"
import {
  StatBadge,
  StatRing,
  StatSquiggle,
  StatTrend,
} from "@/components/ui/stat-visuals"
import { EASE } from "@/lib/motion"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StatCard {
  /** Which stat-visual component to render */
  type: "squiggle" | "ring" | "trend" | "badge"
  value: string
  label: string
  /** StatSquiggle only */
  accent?: "sea" | "golden"
  /** StatRing only */
  percent?: number
  /** StatTrend only */
  direction?: "up" | "down"
  /** StatBadge only */
  icon?: React.ComponentType<{ className?: string }>
  /** Extra Tailwind classes — use for col-span overrides */
  className?: string
}

interface Role {
  id: string
  /** Lucide icon component for the accordion header square */
  Icon: React.ComponentType<{ className?: string }>
  company: string
  title: string
  dates: string
  /** Short chip text shown on ≥sm screens in the header */
  chip: string
  /** Optional badge label (Part-time, Volunteer, Society) */
  badge?: string
  /** One-sentence scope line rendered inside the open panel */
  scope: string
  /** Ordered bento cards — first may span cols via className */
  stats: StatCard[]
  /** Detail bullets rendered beneath the bento grid */
  bullets: string[]
}

// ---------------------------------------------------------------------------
// Role data — all copy from master profile / EXPERIENCE_REDESIGN.md spec
// UK English; no em dashes; no invented numbers; "back-tested" caveats kept.
// ---------------------------------------------------------------------------

const ROLES: Role[] = [
  {
    id: "nationwide",
    Icon: Building2,
    company: "Nationwide Building Society",
    title: "Finance Intern, Finance Division",
    dates: "Jul 2025 – Aug 2025",
    chip: "12% cycle cut",
    scope:
      "Month-end reporting, data quality and a Copilot adoption proposal inside the finance division of the UK's largest building society.",
    stats: [
      {
        type: "squiggle",
        value: "12%",
        label: "Reporting cycle cut",
        accent: "golden",
      },
      {
        type: "ring",
        value: "97%",
        label: "Data completeness",
        percent: 97,
      },
      {
        type: "badge",
        value: "60+",
        label: "Board-pack entries corrected",
        icon: ClipboardCheck,
      },
      {
        type: "badge",
        value: "400+",
        label: "Records cleaned",
        icon: Database,
      },
    ],
    bullets: [
      "Led a 4-person team across 5 stakeholder groups on a live business case, rated best in the cohort by leadership.",
      "Scoped a Microsoft Copilot adoption plan, mapping governance controls for risk and compliance, and presented it to senior leadership.",
      "Cut rework about 20% over three cycles with a self-checking Excel template.",
    ],
  },
  {
    id: "yaf",
    Icon: Megaphone,
    company: "Young Asians in Finance",
    title: "Operations Specialist",
    dates: "Sep 2025 – Present",
    chip: "25% CTR uplift",
    badge: "Part-time",
    scope:
      "KPI-led content, events and digital growth for an early-career finance community.",
    stats: [
      {
        type: "trend",
        value: "25%",
        label: "CTR uplift",
        direction: "up",
      },
      {
        type: "ring",
        value: "99%",
        label: "On-time delivery",
        percent: 99,
      },
      {
        type: "badge",
        value: "35%",
        label: "Engagement growth",
        icon: TrendingUp,
      },
      {
        type: "badge",
        value: "28%",
        label: "Registration lift",
        icon: Ticket,
      },
    ],
    bullets: [
      "Ran LinkedIn and Instagram content against a weekly KPI framework, iterating each cycle.",
      "Set up a shared content and asset workflow, cutting turnaround about 30%.",
    ],
  },
  {
    id: "oxbridge",
    Icon: Search,
    company: "Oxbridge Analytics & Consultants",
    title: "Research and Strategy Assistant",
    dates: "Jun 2024 – Jul 2024",
    chip: "10+ workstreams",
    badge: "Volunteer",
    scope:
      "Market, ESG and operational research contributing to client workstreams at a boutique consultancy.",
    stats: [
      {
        type: "badge",
        value: "10+",
        label: "Client workstreams",
        icon: Workflow,
      },
      {
        type: "badge",
        value: "1,500+",
        label: "Data points structured",
        icon: Database,
      },
      {
        type: "trend",
        value: "~20%",
        label: "Emissions reduction (workstream)",
        direction: "down",
      },
      {
        type: "badge",
        value: "12+",
        label: "Research packs",
        icon: FileText,
      },
    ],
    bullets: [
      "Built supply-chain and sustainability analysis feeding a decarbonisation workstream.",
      "Turned raw analysis into ESG and commercial recommendations across 6+ workstreams.",
    ],
  },
  {
    id: "fintech",
    Icon: LineChart,
    company: "Fintech Society, University of Birmingham",
    title: "Quantitative Analyst",
    dates: "Oct 2023 – Mar 2024",
    chip: "+25% Sharpe (back-tested)",
    badge: "Society",
    scope:
      "Designed and back-tested Python equity strategies across traditional and alternative data in a student-led quant team.",
    stats: [
      {
        type: "trend",
        value: "+25%",
        label: "Sharpe ratio (back-tested)",
        direction: "up",
      },
      {
        type: "trend",
        value: "-7%",
        label: "Max drawdown (back-tested)",
        direction: "down",
      },
      {
        type: "badge",
        value: "3",
        label: "Python strategies / 36mo",
        icon: Code2,
      },
      {
        type: "badge",
        value: "8+",
        label: "Equity notes (incl. Tesla)",
        icon: NotebookPen,
      },
    ],
    bullets: [
      "Tuned entry, exit and position-sizing rules to improve risk-adjusted return; figures are back-tested only.",
      "Presented and defended the strategies to a five-person quant team.",
    ],
  },
]

// ---------------------------------------------------------------------------
// StatCard renderer
// ---------------------------------------------------------------------------

function RenderStatCard({ card }: { card: StatCard }) {
  const { type, value, label, accent, percent, direction, icon: Icon, className } = card

  if (type === "squiggle") {
    return (
      <StatSquiggle
        value={value}
        label={label}
        accent={accent}
        className={className}
      />
    )
  }

  if (type === "ring" && percent !== undefined) {
    return (
      <StatRing
        value={value}
        label={label}
        percent={percent}
        className={className}
      />
    )
  }

  if (type === "trend" && direction !== undefined) {
    return (
      <StatTrend
        value={value}
        label={label}
        direction={direction}
        className={className}
      />
    )
  }

  if (type === "badge" && Icon !== undefined) {
    return (
      <StatBadge
        value={value}
        label={label}
        icon={Icon}
        className={className}
      />
    )
  }

  return null
}

// ---------------------------------------------------------------------------
// BulletItem
// ---------------------------------------------------------------------------

function BulletItem({ text }: { text: string }) {
  return (
    <li className="flex gap-2.5 text-base leading-relaxed text-deep-sea/75">
      <span
        className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-sea"
        aria-hidden="true"
      />
      <span>{text}</span>
    </li>
  )
}

// ---------------------------------------------------------------------------
// AccordionItem
// ---------------------------------------------------------------------------

interface AccordionItemProps {
  role: Role
  isOpen: boolean
  onToggle: () => void
  reduce: boolean
}

function AccordionItem({ role, isOpen, onToggle, reduce }: AccordionItemProps) {
  const panelId = `experience-panel-${role.id}`
  const headerId = `experience-header-${role.id}`
  const { Icon } = role

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-deep-sea/10 bg-linen",
        "transition-[border-color,box-shadow] duration-300",
        isOpen && "border-sea/30 shadow-sm",
      )}
    >
      {/* Left accent bar — visible on open item */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-[3px] rounded-l-2xl transition-opacity duration-300",
          isOpen ? "bg-sea opacity-100" : "opacity-0",
        )}
        aria-hidden="true"
      />

      {/* ── Header button ── */}
      <button
        id={headerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className={cn(
          "flex w-full min-w-0 items-center gap-3 px-5 py-4 text-left sm:gap-4 sm:px-6 sm:py-5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-inset",
          "transition-colors duration-200",
          isOpen ? "hover:bg-sea/[0.03]" : "hover:bg-deep-sea/[0.025]",
        )}
      >
        {/* Icon square */}
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sea/10"
          aria-hidden="true"
        >
          <Icon className="h-5 w-5 text-sea" />
        </span>

        {/* Company + role/dates */}
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="min-w-0 truncate text-sm font-semibold text-deep-sea sm:text-base">
              {role.company}
            </span>
            {role.badge && (
              <span className="shrink-0 rounded-full border border-sea/20 bg-sea/8 px-2 py-px text-xs font-medium text-sea">
                {role.badge}
              </span>
            )}
          </div>
          <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="truncate text-xs text-slate sm:text-sm">
              {role.title}
            </span>
            <span className="text-xs text-slate/60" aria-hidden="true">·</span>
            <span className="shrink-0 text-xs text-slate sm:text-sm">
              {role.dates}
            </span>
          </div>
        </div>

        {/* Headline-metric chip — hidden on xs, visible sm+ */}
        <span
          className={cn(
            "hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-medium sm:inline-block",
            "border border-golden-hour/30 bg-golden-hour/10 text-golden-hour",
          )}
          aria-hidden="true"
        >
          {role.chip}
        </span>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.3, ease: EASE }}
          aria-hidden="true"
          className="ml-1 shrink-0"
          style={{ display: "inline-flex" }}
        >
          <ChevronDown className="h-5 w-5 text-slate" />
        </motion.span>
      </button>

      {/* ── Panel ── */}
      {reduce ? (
        // Reduced-motion: instant show/hide, no transforms
        isOpen ? (
          <div
            id={panelId}
            role="region"
            aria-labelledby={headerId}
          >
            <PanelContent role={role} />
          </div>
        ) : null
      ) : (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key={panelId}
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              style={{ overflow: "hidden" }}
            >
              <PanelContent role={role} animated />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// PanelContent
// Scope line + bento grid + bullet list.
// ---------------------------------------------------------------------------

function PanelContent({
  role,
  animated = false,
}: {
  role: Role
  animated?: boolean
}) {
  const contentProps = animated
    ? {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: EASE, delay: 0.05 },
      }
    : {}

  const Wrapper = animated ? motion.div : "div"

  return (
    // @ts-expect-error — motion.div and div share compatible base props here
    <Wrapper
      className="px-5 pb-6 pt-1 sm:px-6 sm:pb-8"
      {...contentProps}
    >
      {/* Divider */}
      <div className="mb-4 h-px bg-deep-sea/8" />

      {/* Scope line */}
      <p className="mb-5 text-sm leading-relaxed text-deep-sea/75 sm:text-base">
        {role.scope}
      </p>

      {/* Bento grid of stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {role.stats.map((card, i) => (
          <RenderStatCard key={i} card={card} />
        ))}
      </div>

      {/* Detail bullets */}
      {role.bullets.length > 0 && (
        <ul className="mt-5 space-y-2.5">
          {role.bullets.map((bullet, i) => (
            <BulletItem key={i} text={bullet} />
          ))}
        </ul>
      )}
    </Wrapper>
  )
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------

export function Experience() {
  const reduce = useReducedMotion() ?? false
  const [openId, setOpenId] = useState<string>(ROLES[0].id)

  function toggle(id: string) {
    // One open at a time; clicking the open one keeps it open (spec: "one open at a time")
    setOpenId(id)
  }

  return (
    <Section
      id="experience"
      aria-labelledby="where-i-ve-done-the-work"
      className="bg-sand"
    >
      {/* Heading */}
      <Reveal>
        <SectionHeading
          eyebrow="Experience"
          title="Where I've done the work"
          lead="Four roles across finance reporting, operations, consulting research and quantitative analysis."
        />
      </Reveal>

      {/* Accordion */}
      <div className="mt-10 flex flex-col gap-3 sm:mt-14 sm:gap-4">
        {ROLES.map((role) => (
          <AccordionItem
            key={role.id}
            role={role}
            isOpen={openId === role.id}
            onToggle={() => toggle(role.id)}
            reduce={reduce}
          />
        ))}
      </div>
    </Section>
  )
}
