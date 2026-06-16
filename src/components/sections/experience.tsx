/**
 * experience.tsx — Work Experience section (v4).
 *
 * TEXT LEADS. Each open card shows: one-line scope, then 3–5 readable bullets
 * with sea-dot markers and generous leading, then a compact supporting stat
 * strip (secondary), then a CORE SKILLS GAINED pill-tag row.
 *
 * Interaction:
 *  - Nationwide Building Society opens by DEFAULT on first load.
 *  - Hover anywhere in the card (header OR expanded body) → previews open
 *    for cards with no forced state; mouse-leave collapses only when leaving
 *    the entire card wrapper.
 *  - Click header/chevron → DEFINITIVE toggle that OVERRIDES hover:
 *      clicking an open card forces it closed (stays closed even while hovered);
 *      clicking a closed card forces it open (stays open until clicked again).
 *  - Multiple cards may be forced-open simultaneously.
 *  - State: forced: Record<id, boolean> (true = force-open, false = force-closed;
 *            absent = hover-driven) + hovered: id | null
 *            isOpen(id) = id in forced ? forced[id] : hovered === id
 *  - Initialised with forced = { nationwide: true } so Nationwide is open by default.
 *
 * Reduced-motion: hover-preview disabled; click/keyboard only; instant show/hide.
 * A11y: real <button aria-expanded aria-controls>; Enter/Space toggles;
 *        focus ring ring-sea; decorative icons aria-hidden.
 */

import { useState, useCallback, useEffect } from "react"
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
  type: "squiggle" | "ring" | "trend" | "badge"
  value: string
  label: string
  accent?: "sea" | "golden"
  percent?: number
  direction?: "up" | "down"
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

interface Role {
  id: string
  Icon: React.ComponentType<{ className?: string }>
  company: string
  title: string
  dates: string
  /** Compact headline-metric chip shown in the header at ≥sm. */
  chip: string
  /** Optional label (Volunteer, Part-time, Society). */
  badge?: string
  /** One-sentence scope line rendered at the top of the open panel. */
  scope: React.ReactNode
  /** Verbatim bullets from spec — the MEAT of the card. */
  bullets: React.ReactNode[]
  /** 3–4 supporting stat visuals — secondary, compact, below bullets. */
  stats: StatCard[]
  /** Core skills gained pill tags. */
  skills: string[]
}

// ---------------------------------------------------------------------------
// Helper — inline figure highlight
// ---------------------------------------------------------------------------

/** Wrap a numeric token so it stands out per the global highlight rule. */
function Fig({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-semibold text-deep-sea">{children}</span>
  )
}

// ---------------------------------------------------------------------------
// Role data — verbatim from spec.
// UK English; no em dashes; no invented numbers; back-tested caveats kept;
// "contributed/supported" framing for Oxbridge.
// Figures highlighted with <Fig> per global rule.
// ---------------------------------------------------------------------------

const ROLES: Role[] = [
  {
    id: "nationwide",
    Icon: Building2,
    company: "Nationwide Building Society",
    title: "Finance Intern, Finance Division",
    dates: "Jul 2025 – Aug 2025",
    chip: "12% cycle cut",
    scope: (
      <>
        Live finance-division internship across month-end reporting, data
        governance, AI adoption and business problem-solving.
      </>
    ),
    bullets: [
      <>
        Consolidated fragmented month-end finance data into one refreshable Power
        BI and advanced Excel model, removing repeated manual rebuilds, cutting
        the reporting cycle <Fig>12%</Fig> and improving director-pack precision.
      </>,
      <>
        Cleaned <Fig>400+</Fig> finance records and filled <Fig>100+</Fig>{" "}
        missing fields, lifting data completeness to <Fig>97%</Fig> and making
        every director-pack figure traceable to source.
      </>,
      <>
        Built a self-checking Excel control template that flagged entry errors
        before sign-off, correcting <Fig>60+</Fig> board-pack entries and cutting
        rework about <Fig>20%</Fig> across <Fig>three</Fig> reporting cycles.
      </>,
      <>
        Led a <Fig>4</Fig>-person team across <Fig>5</Fig> stakeholder groups on
        a live business case, converting operational constraints into a
        finance-led recommendation rated best in the cohort by leadership.
      </>,
      <>
        Scoped a Microsoft Copilot adoption plan for the finance division, mapping
        use cases and governance controls for risk, compliance and approval, and
        presented it to senior leadership.
      </>,
    ],
    stats: [
      { type: "squiggle", value: "12%",  label: "Reporting cycle cut", accent: "golden" },
      { type: "ring",     value: "97%",  label: "Data completeness",   percent: 97 },
      { type: "badge",    value: "60+",  label: "Board-pack fixes",    icon: ClipboardCheck },
      { type: "badge",    value: "400+", label: "Records cleaned",     icon: Database },
    ],
    skills: [
      "Power BI",
      "Power Query",
      "Advanced Excel",
      "Month-end Reporting",
      "Data Governance",
      "Board-pack Controls",
      "AI Governance",
    ],
  },
  {
    id: "yaf",
    Icon: Megaphone,
    company: "Young Asians in Finance",
    title: "Operations Specialist (Volunteer)",
    dates: "Sep 2025 – Present",
    chip: "25% CTR uplift",
    badge: "Part-time",
    scope: (
      <>
        KPI-led communications, event operations and stakeholder coordination for
        a finance-focused professional community.
      </>
    ),
    bullets: [
      <>
        Built a weekly KPI framework and campaign database, using performance data
        to refine content, messaging and timing and raise click-through rate{" "}
        <Fig>25%</Fig>.
      </>,
      <>
        Ran a multi-channel LinkedIn and Instagram programme, growing engagement{" "}
        <Fig>35%</Fig> across early-career finance audiences.
      </>,
      <>
        Coordinated <Fig>6+</Fig> finance and investment-banking events end to
        end, managing materials, stakeholders and attendee workflows to lift
        registrations <Fig>28%</Fig>.
      </>,
      <>
        Standardised content, operations and event workflows, improving
        turnaround about <Fig>30%</Fig> and holding <Fig>99%</Fig> on-time
        delivery across assets and materials.
      </>,
    ],
    stats: [
      { type: "trend", value: "25%", label: "CTR uplift",       direction: "up"  },
      { type: "ring",  value: "99%", label: "On-time delivery", percent: 99      },
      { type: "badge", value: "35%", label: "Engagement",       icon: TrendingUp },
      { type: "badge", value: "28%", label: "Registrations",    icon: Ticket     },
    ],
    skills: [
      "KPI Reporting",
      "Digital Analytics",
      "Campaign Governance",
      "Event Operations",
      "Stakeholder Communication",
      "Community Growth",
    ],
  },
  {
    id: "oxbridge",
    Icon: Search,
    company: "Oxbridge Analytics & Consultants",
    title: "Research and Strategy Assistant (Volunteer)",
    dates: "Jun 2024 – Jul 2024",
    chip: "10+ workstreams",
    badge: "Volunteer",
    scope: (
      <>
        Consulting-style research across market intelligence, ESG analytics,
        supply-chain strategy and client decision support.
      </>
    ),
    bullets: [
      <>
        Contributed market, ESG and operational research across <Fig>10+</Fig>{" "}
        client workstreams, turning scattered inputs into stakeholder-ready briefs
        and commercial recommendations.
      </>,
      <>
        Structured <Fig>1,500+</Fig> raw research inputs into
        forecasting-ready datasets, improving clarity for planning, scenario
        analysis and client-facing recommendations.
      </>,
      <>
        Built supply-chain and sustainability analysis supporting a
        decarbonisation workstream linked to a <Fig>~20%</Fig> carbon-emissions
        reduction.
      </>,
      <>
        Produced <Fig>12+</Fig> research packs across <Fig>6+</Fig> workstreams,
        converting raw analysis into practical ESG and commercial actions.
      </>,
    ],
    stats: [
      { type: "badge", value: "10+",    label: "Client workstreams",     icon: Workflow },
      { type: "badge", value: "1,500+", label: "Data points",            icon: Database },
      { type: "trend", value: "~20%",   label: "Emissions (workstream)", direction: "down" },
      { type: "badge", value: "12+",    label: "Research packs",         icon: FileText },
    ],
    skills: [
      "Market Research",
      "ESG Analytics",
      "Strategic Intelligence",
      "Executive Briefs",
      "Supply-chain Analytics",
      "Scenario Analysis",
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
    scope: (
      <>
        Quantitative research across Python strategy design, back-testing, equity
        screening and investment reporting.
      </>
    ),
    bullets: [
      <>
        Designed and back-tested <Fig>3</Fig> Python (pandas) trading strategies
        across <Fig>36</Fig> months of traditional and alternative data, testing
        whether momentum and volatility signals held across market regimes.
      </>,
      <>
        Tuned entry, exit and position-sizing rules to improve risk-adjusted
        return, lifting the back-tested Sharpe ratio <Fig>25%</Fig> and cutting
        maximum drawdown <Fig>7%</Fig> under stress scenarios.
      </>,
      <>
        Produced <Fig>8+</Fig> equity research notes on high-conviction names
        including Tesla, translating catalysts, valuation drivers and risks into a
        clear buy, hold or sell view.
      </>,
      <>
        Presented and defended <Fig>4</Fig> strategy diagnostics and Python
        back-test outputs to a <Fig>5</Fig>-person quant team, sharpening
        technical communication and investment judgement.
      </>,
    ],
    stats: [
      { type: "trend", value: "+25%", label: "Sharpe (back-tested)",   direction: "up"   },
      { type: "trend", value: "-7%",  label: "Drawdown (back-tested)", direction: "down" },
      { type: "badge", value: "3",    label: "Python strategies",       icon: Code2       },
      { type: "badge", value: "8+",   label: "Equity notes",            icon: NotebookPen },
    ],
    skills: [
      "Python",
      "pandas",
      "Back-testing",
      "Equity Research",
      "Risk-adjusted Return",
      "Sharpe Ratio",
      "Alternative Data",
    ],
  },
]

// ---------------------------------------------------------------------------
// StatCard renderer
// ---------------------------------------------------------------------------

function RenderStatCard({ card }: { card: StatCard }) {
  const { type, value, label, accent, percent, direction, icon: Icon, className } = card

  if (type === "squiggle") {
    return <StatSquiggle value={value} label={label} accent={accent} className={className} />
  }
  if (type === "ring" && percent !== undefined) {
    return <StatRing value={value} label={label} percent={percent} className={className} />
  }
  if (type === "trend" && direction !== undefined) {
    return <StatTrend value={value} label={label} direction={direction} className={className} />
  }
  if (type === "badge" && Icon !== undefined) {
    return <StatBadge value={value} label={label} icon={Icon} className={className} />
  }
  return null
}

// ---------------------------------------------------------------------------
// BulletItem — accepts ReactNode so figures can be wrapped with <Fig>
// ---------------------------------------------------------------------------

function BulletItem({ text }: { text: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-base leading-relaxed text-deep-sea/75">
      {/* Sea-dot marker */}
      <span
        className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-sea"
        aria-hidden="true"
      />
      <span>{text}</span>
    </li>
  )
}

// ---------------------------------------------------------------------------
// SkillTag
// ---------------------------------------------------------------------------

function SkillTag({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-deep-sea/15 bg-linen px-3 py-1 text-xs text-deep-sea/75">
      {label}
    </span>
  )
}

// ---------------------------------------------------------------------------
// PanelContent — scope + bullets (MEAT) + stat strip + skills
// ---------------------------------------------------------------------------

function PanelContent({ role }: { role: Role }) {
  return (
    <div className="px-5 pb-6 pt-1 sm:px-6 sm:pb-8">
      {/* Divider */}
      <div className="mb-4 h-px bg-deep-sea/8" aria-hidden="true" />

      {/* 1. One-line scope */}
      <p className="mb-5 text-sm leading-relaxed text-deep-sea/70 sm:text-base">
        {role.scope}
      </p>

      {/* 2. Bullets — THE MEAT */}
      <ul
        className="mb-6 space-y-3"
        aria-label={`Highlights for ${role.company}`}
      >
        {role.bullets.map((bullet, i) => (
          <BulletItem key={i} text={bullet} />
        ))}
      </ul>

      {/* 3. Supporting stat strip — compact, secondary, 2-col on mobile */}
      <div
        className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3"
        aria-label="Key metrics"
      >
        {role.stats.map((card, i) => (
          <RenderStatCard key={i} card={card} />
        ))}
      </div>

      {/* 4. Core skills gained */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate">
          Core skills gained
        </p>
        <ul
          className="flex flex-wrap gap-1.5"
          aria-label={`Skills gained at ${role.company}`}
        >
          {role.skills.map((skill) => (
            <li key={skill}>
              <SkillTag label={skill} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ExperienceCard — single card with whole-card hover + click-pin interaction
// ---------------------------------------------------------------------------

interface ExperienceCardProps {
  role: Role
  isOpen: boolean
  reduce: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onTogglePin: () => void
}

function ExperienceCard({
  role,
  isOpen,
  reduce,
  onMouseEnter,
  onMouseLeave,
  onTogglePin,
}: ExperienceCardProps) {
  const panelId = `experience-panel-${role.id}`
  const headerId = `experience-header-${role.id}`
  const { Icon } = role

  return (
    // Hover handlers on the WHOLE card wrapper so moving into the expanded
    // body keeps the card open; it collapses only when leaving the entire card.
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-linen",
        "transition-[border-color,box-shadow] duration-300",
        isOpen ? "border-sea/30 shadow-sm" : "border-deep-sea/10",
      )}
      onMouseEnter={reduce ? undefined : onMouseEnter}
      onMouseLeave={reduce ? undefined : onMouseLeave}
    >
      {/* Left accent bar — visible when open */}
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
        onClick={onTogglePin}
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

        {/* Company + role + dates */}
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
            <span className="min-w-0 truncate text-xs text-slate sm:text-sm">
              {role.title}
            </span>
            <span className="text-xs text-slate/50" aria-hidden="true">·</span>
            <span className="shrink-0 whitespace-nowrap text-xs text-slate sm:text-sm">
              {role.dates}
            </span>
          </div>
        </div>

        {/* Headline-metric chip — hidden xs, visible sm+ */}
        <span
          className="hidden shrink-0 rounded-full border border-golden-hour/30 bg-golden-hour/10 px-2.5 py-1 text-xs font-medium text-golden-hour sm:inline-block"
          aria-hidden="true"
        >
          {role.chip}
        </span>

        {/* Rotating chevron */}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.3, ease: EASE }}
          aria-hidden="true"
          className="ml-1 inline-flex shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-slate" />
        </motion.span>
      </button>

      {/* ── Panel ── */}
      {reduce ? (
        // Reduced-motion: instant mount/unmount, no animation
        isOpen ? (
          <div id={panelId} role="region" aria-labelledby={headerId}>
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
              transition={{ duration: 0.32, ease: EASE }}
              style={{ overflow: "hidden" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.28, ease: EASE, delay: 0.06 }}
              >
                <PanelContent role={role} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------

/** The id of the card that is open by default on first load. */
const DEFAULT_OPEN_ID = "nationwide"

/**
 * Maps the deep-link element id (the DOM id placed on the card wrapper,
 * prefixed with "exp-") to the Role id used in the forced/hovered state.
 * e.g. location.hash === "#exp-nationwide" → role id "nationwide"
 */
const HASH_TO_ROLE_ID: Record<string, string> = {
  "exp-nationwide": "nationwide",
  "exp-yaf":        "yaf",
  "exp-oxbridge":   "oxbridge",
  "exp-fintech":    "fintech",
}

export function Experience() {
  const reduce = useReducedMotion() ?? false

  // forced: Record<id, boolean>
  //   id in forced && forced[id] === true  → force-open (overrides hover)
  //   id in forced && forced[id] === false → force-closed (overrides hover)
  //   id not in forced                     → hover-driven
  // Initialise with Nationwide forced-open so it shows expanded on load.
  const [forced, setForced] = useState<Record<string, boolean>>({
    [DEFAULT_OPEN_ID]: true,
  })
  const [hovered, setHovered] = useState<string | null>(null)

  const isOpen = useCallback(
    (id: string): boolean =>
      id in forced ? forced[id] : hovered === id,
    [forced, hovered],
  )

  const handleMouseEnter = useCallback((id: string) => {
    setHovered(id)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHovered(null)
  }, [])

  // Definitive toggle: current open state (forced OR hovered) → flip forced to opposite.
  // After this the card's open/closed state is driven by forced[id], not hover.
  const handleToggle = useCallback(
    (id: string) => {
      const open = id in forced ? forced[id] : hovered === id
      setForced((prev) => ({ ...prev, [id]: !open }))
    },
    [forced, hovered],
  )

  // Deep-link support: on mount and on hashchange, if the hash matches one of
  // the four role card ids (exp-nationwide / exp-yaf / exp-oxbridge / exp-fintech),
  // force that card open and scroll it into view.  The card stays open until the
  // user explicitly collapses it with its arrow (normal toggle behaviour).
  useEffect(() => {
    function handleHash() {
      const hash = window.location.hash.replace(/^#/, "")
      const roleId = HASH_TO_ROLE_ID[hash]
      if (!roleId) return

      // Force the matched card open (may already be open — that's fine).
      setForced((prev) => ({ ...prev, [roleId]: true }))

      // Scroll the card wrapper into view after a short tick so the DOM id is
      // already painted.  Respect prefers-reduced-motion.
      requestAnimationFrame(() => {
        const el = document.getElementById(hash)
        if (!el) return
        el.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        })
      })
    }

    // Run immediately on mount in case the page loaded with a hash.
    handleHash()

    window.addEventListener("hashchange", handleHash)
    return () => window.removeEventListener("hashchange", handleHash)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]) // `reduce` is stable after first render; setForced is stable

  return (
    <Section
      id="experience"
      aria-labelledby="where-i-ve-done-the-work"
      className="bg-sand"
    >
      {/* Section heading */}
      <Reveal>
        <SectionHeading
          eyebrow="Experience"
          title="Where I've done the work"
          lead="Four roles across finance reporting, operations, consulting research and quantitative analysis."
        />
      </Reveal>

      {/* Card list */}
      <div
        className="mt-10 flex flex-col gap-3 sm:mt-14 sm:gap-4"
        role="list"
        aria-label="Experience cards"
      >
        {ROLES.map((role) => {
          const open = isOpen(role.id)
          return (
            <div
              key={role.id}
              id={`exp-${role.id}`}
              role="listitem"
              className="scroll-mt-24"
            >
              <ExperienceCard
                role={role}
                isOpen={open}
                reduce={reduce}
                onMouseEnter={() => handleMouseEnter(role.id)}
                onMouseLeave={handleMouseLeave}
                onTogglePin={() => handleToggle(role.id)}
              />
            </div>
          )
        })}
      </div>
    </Section>
  )
}
