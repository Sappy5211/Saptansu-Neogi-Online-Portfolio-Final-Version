/**
 * project-detail.tsx — full case-study page (client-side hash route #/project/<slug>).
 *
 * Layout: sticky top bar (wordmark + Back to portfolio) → body grid with the
 * case-study content (left/main) and a sticky "Case studies" switcher sidebar
 * (right on lg, horizontal scroller above on mobile). On-brand coastal palette,
 * light surface. Visualisations: MOIC-by-case bar chart, cash-flow chart,
 * sensitivity heatmap tables, and the real model/EDA chart images.
 *
 * a11y: skip link, focus moves to <h1> on route change, aria-current on the
 * active sidebar item, ≥44px targets, lazy images, reduced-motion safe (charts
 * are static SVG), no horizontal page scroll.
 */

import { useEffect } from "react"
import { ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Reveal } from "@/components/ui/reveal"
import {
  PROJECTS_CONTENT,
  PROJECT_SIDEBAR_ITEMS,
  type ProjectContent,
  type SensitivityGrid,
  type CashFlowRow,
  type SourcesUsesRow,
  type ChartImage,
} from "@/data/projects-content"

// ---------------------------------------------------------------------------
// Headline MOIC-by-case data (matches the spec / content module figures)
// ---------------------------------------------------------------------------

const HEADLINE_MOIC: Record<string, { label: string; moic: number; irr: string }[]> = {
  voltagrid: [
    { label: "Downside", moic: 1.62, irr: "c.12%" },
    { label: "Base", moic: 2.2, irr: "c.20%" },
    { label: "Upside", moic: 2.68, irr: "c.25%" },
  ],
  aquaserve: [
    { label: "Downside", moic: 1.24, irr: "4.4%" },
    { label: "Base", moic: 2.21, irr: "17.2%" },
    { label: "Upside", moic: 2.56, irr: "20.7%" },
  ],
}

function goTo(hash: string) {
  window.location.hash = hash
}

// ---------------------------------------------------------------------------
// Small layout primitives
// ---------------------------------------------------------------------------

function Block({
  title,
  children,
  delay = 0,
}: {
  title: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <Reveal delay={delay} className="w-full">
      <section className="w-full">
        <h2 className="text-xl font-semibold tracking-tight text-deep-sea sm:text-2xl">
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </section>
    </Reveal>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-deep-sea/10 bg-linen p-5 shadow-sm", className)}>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// MOIC by case — grouped bar chart (headline visual for LBOs)
// ---------------------------------------------------------------------------

function MoicBarChart({ data }: { data: { label: string; moic: number; irr: string }[] }) {
  const W = 640
  const H = 320
  const PAD_X = 40
  const BASE_Y = 250
  const TOP_Y = 40
  const MAX = 3.0 // headroom above the 2.68x upside
  const usable = BASE_Y - TOP_Y
  const slotW = (W - PAD_X * 2) / data.length
  const barW = Math.min(120, slotW * 0.5)

  return (
    <Card>
      <p className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-slate">
        Returns by case — MOIC (total equity)
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`MOIC by case: ${data.map((d) => `${d.label} ${d.moic} times`).join(", ")}`}
      >
        {/* Gridlines */}
        {[1, 2, 3].map((g) => {
          const y = BASE_Y - (g / MAX) * usable
          return (
            <g key={g}>
              <line x1={PAD_X} y1={y} x2={W - PAD_X} y2={y} stroke="#14323b" strokeOpacity={0.08} strokeWidth={1} />
              <text x={PAD_X - 8} y={y + 4} textAnchor="end" fontSize={12} fill="#5e6e72" fontFamily="inherit">
                {g}x
              </text>
            </g>
          )
        })}
        {/* Baseline */}
        <line x1={PAD_X} y1={BASE_Y} x2={W - PAD_X} y2={BASE_Y} stroke="#14323b" strokeOpacity={0.25} strokeWidth={1.5} />

        {data.map((d, i) => {
          const isBase = d.label === "Base"
          const h = (d.moic / MAX) * usable
          const x = PAD_X + i * slotW + (slotW - barW) / 2
          const y = BASE_Y - h
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={barW} height={h} rx={6} fill={isBase ? "#d9a441" : "#2b7a8c"} />
              {/* MOIC value */}
              <text x={x + barW / 2} y={y - 22} textAnchor="middle" fontSize={22} fontWeight={700} fill="#14323b" fontFamily="inherit">
                {d.moic.toFixed(2)}x
              </text>
              {/* IRR */}
              <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize={12} fill="#5e6e72" fontFamily="inherit">
                {d.irr} IRR
              </text>
              {/* Case label */}
              <text x={x + barW / 2} y={BASE_Y + 22} textAnchor="middle" fontSize={14} fontWeight={isBase ? 700 : 500} fill={isBase ? "#1e5c6b" : "#14323b"} fontFamily="inherit">
                {d.label}
              </text>
            </g>
          )
        })}
      </svg>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Cash-flow timeline chart (VoltaGrid)
// ---------------------------------------------------------------------------

function CashFlowChart({ rows }: { rows: CashFlowRow[] }) {
  const W = 640
  const H = 320
  const PAD_X = 36
  const ZERO_Y = 232 // baseline near the bottom — most flows are negative early
  const TOP = 24
  const BOTTOM = 296
  const maxPos = Math.max(...rows.map((r) => r.amount), 0)
  const maxNeg = Math.min(...rows.map((r) => r.amount), 0)
  const posScale = maxPos > 0 ? (ZERO_Y - TOP) / maxPos : 0
  const negScale = maxNeg < 0 ? (BOTTOM - ZERO_Y) / Math.abs(maxNeg) : 0
  const slotW = (W - PAD_X * 2) / rows.length
  const barW = Math.min(64, slotW * 0.46)

  return (
    <Card>
      <p className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-slate">
        Norland cash-flow timeline — base case (£m)
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Cash-flow timeline: outflows FY24 to FY27, then a large exit inflow in FY29.">
        <line x1={PAD_X} y1={ZERO_Y} x2={W - PAD_X} y2={ZERO_Y} stroke="#14323b" strokeOpacity={0.25} strokeWidth={1.5} />
        {rows.map((r, i) => {
          const pos = r.amount >= 0
          const h = pos ? r.amount * posScale : Math.abs(r.amount) * negScale
          const x = PAD_X + i * slotW + (slotW - barW) / 2
          const y = pos ? ZERO_Y - h : ZERO_Y
          const isExit = r.amount === maxPos
          return (
            <g key={r.year}>
              <rect x={x} y={y} width={barW} height={Math.max(h, 1)} rx={5} fill={pos ? (isExit ? "#d9a441" : "#2b7a8c") : "#1e5c6b"} fillOpacity={pos ? 1 : 0.85} />
              <text x={x + barW / 2} y={pos ? y - 8 : y + h + 16} textAnchor="middle" fontSize={12} fontWeight={600} fill="#14323b" fontFamily="inherit">
                {r.amount > 0 ? "+" : ""}{r.amount.toFixed(1)}
              </text>
              <text x={x + barW / 2} y={H - 6} textAnchor="middle" fontSize={12} fill="#5e6e72" fontFamily="inherit">
                {r.year}
              </text>
            </g>
          )
        })}
      </svg>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Three-case table (VoltaGrid)
// ---------------------------------------------------------------------------

function ThreeCaseTable({ rows }: { rows: ProjectContent["threeCase"] }) {
  if (!rows) return null
  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-deep-sea/10 text-left">
            <th className="py-2 pr-4 font-medium text-slate">Metric</th>
            <th className="py-2 px-3 text-right font-medium text-slate">Downside</th>
            <th className="py-2 px-3 text-right font-semibold text-sea-deep">Base</th>
            <th className="py-2 pl-3 text-right font-medium text-slate">Upside</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-deep-sea/5 last:border-0">
              <td className="py-2 pr-4 text-deep-sea/80">{r.label}</td>
              <td className="py-2 px-3 text-right tabular-nums text-deep-sea/80">{r.downside}</td>
              <td className="py-2 px-3 text-right font-semibold tabular-nums text-deep-sea">{r.base}</td>
              <td className="py-2 pl-3 text-right tabular-nums text-deep-sea/80">{r.upside}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Sources & uses (AquaServe)
// ---------------------------------------------------------------------------

function SourcesUsesTable({ data }: { data: { uses: SourcesUsesRow[]; sources: SourcesUsesRow[] } }) {
  const col = (rows: SourcesUsesRow[], heading: string) => (
    <div className="flex-1">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-slate">{heading}</p>
      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map((r, i) => {
            const total = i === rows.length - 1
            return (
              <tr key={r.label} className={cn("border-b border-deep-sea/5", total && "border-t-2 border-t-deep-sea/15")}>
                <td className={cn("py-2 pr-3", total ? "font-semibold text-deep-sea" : "text-deep-sea/80")}>{r.label}</td>
                <td className={cn("py-2 text-right tabular-nums", total ? "font-semibold text-deep-sea" : "text-deep-sea/80")}>{r.amount}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
  return (
    <Card className="flex flex-col gap-6 sm:flex-row sm:gap-10">
      {col(data.uses, "Uses")}
      {col(data.sources, "Sources")}
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Returns key/value table (AquaServe)
// ---------------------------------------------------------------------------

function ReturnsTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <Card className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-deep-sea/5 last:border-0">
              <td className="py-2 pr-4 text-deep-sea/80">{r.label}</td>
              <td className="py-2 text-right font-medium tabular-nums text-deep-sea">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Sensitivity heatmap table
// ---------------------------------------------------------------------------

function num(s: string): number {
  const v = parseFloat(s.replace(/[^0-9.]/g, ""))
  return Number.isFinite(v) ? v : 0
}

function SensitivityTable({ grid, unit }: { grid: SensitivityGrid; unit: string }) {
  const flat = grid.cells.flat().map(num)
  const min = Math.min(...flat)
  const max = Math.max(...flat)
  const span = max - min || 1

  return (
    <Card className="overflow-x-auto">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-slate">
        {grid.rowAxisLabel} <span aria-hidden="true">·</span> {grid.colAxisLabel} <span className="text-slate/70">({unit})</span>
      </p>
      <table className="w-full min-w-[420px] border-collapse text-center text-sm">
        <thead>
          <tr>
            <th className="p-2" />
            {grid.colLabels.map((c) => (
              <th key={c} className="p-2 text-xs font-medium text-slate">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.cells.map((row, ri) => (
            <tr key={grid.rowLabels[ri]}>
              <th className="p-2 text-right text-xs font-medium text-slate">{grid.rowLabels[ri]}</th>
              {row.map((cell, ci) => {
                const isBase = ri === grid.baseCell[0] && ci === grid.baseCell[1]
                const intensity = (num(cell) - min) / span // 0..1
                const bg = `rgba(43,122,140,${(0.08 + intensity * 0.34).toFixed(3)})`
                return (
                  <td key={ci} className="p-1.5">
                    <span
                      className={cn(
                        "flex min-h-[40px] items-center justify-center rounded-md px-2 font-medium tabular-nums text-deep-sea",
                        isBase && "ring-2 ring-golden-hour font-semibold",
                      )}
                      style={{ background: isBase ? "rgba(217,164,65,0.32)" : bg }}
                    >
                      {cell}
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Image figure + gallery
// ---------------------------------------------------------------------------

function ImageFigure({ img }: { img: ChartImage }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-deep-sea/10 bg-linen shadow-sm">
      <img src={img.src} alt={img.alt} loading="lazy" decoding="async" className="h-auto w-full" />
      <figcaption className="px-4 py-3 text-xs text-slate">{img.caption}</figcaption>
    </figure>
  )
}

// ---------------------------------------------------------------------------
// Prose bullet list
// ---------------------------------------------------------------------------

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-base leading-relaxed text-deep-sea/80">
          <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-sea" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

// ---------------------------------------------------------------------------
// Sidebar — project switcher
// ---------------------------------------------------------------------------

function Sidebar({ activeSlug }: { activeSlug: string }) {
  return (
    <aside
      aria-label="Other case studies"
      className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start"
    >
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-slate">Case studies</p>
      <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {PROJECT_SIDEBAR_ITEMS.map((item, i) => {
          const active = item.slug === activeSlug
          return (
            <li key={item.slug} className="w-[220px] shrink-0 lg:w-auto lg:shrink">
              <a
                href={`#/project/${item.slug}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-xl border px-4 py-3 transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2 focus-visible:ring-offset-sand",
                  active
                    ? "border-sea/40 bg-linen text-deep-sea ring-1 ring-sea/30"
                    : "border-deep-sea/10 bg-linen/50 text-slate hover:bg-linen hover:text-deep-sea",
                )}
              >
                <span className="block text-[10px] font-semibold tabular-nums text-sea">0{i + 1}</span>
                <span className="mt-0.5 block text-sm font-semibold leading-snug">{item.title}</span>
                <span className="mt-0.5 block text-xs text-slate">{item.type}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

// ---------------------------------------------------------------------------
// Project body
// ---------------------------------------------------------------------------

function ProjectBody({ project }: { project: ProjectContent }) {
  const headline = HEADLINE_MOIC[project.slug]

  return (
    <div className="space-y-10">
      {/* Header */}
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-sea">
          {project.type} <span aria-hidden="true">·</span> {project.tools}
        </p>
        <h1
          id="detail-h1"
          tabIndex={-1}
          className="mt-3 text-3xl font-semibold tracking-tight text-deep-sea outline-none sm:text-4xl"
        >
          {project.title}
        </h1>
        {project.background.map((p, i) => (
          <p key={i} className="mt-4 max-w-2xl text-base leading-relaxed text-deep-sea/80">
            {p}
          </p>
        ))}
        <div className="mt-5 flex flex-wrap gap-2.5">
          {project.metricChips.map((c) => (
            <span
              key={c.label}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-semibold",
                c.hero
                  ? "bg-golden-hour text-deep-sea"
                  : "bg-linen text-deep-sea ring-1 ring-deep-sea/10",
              )}
            >
              {c.label}
            </span>
          ))}
        </div>
      </Reveal>

      {/* Headline visual */}
      {headline ? (
        <Reveal delay={0.05}>
          <MoicBarChart data={headline} />
        </Reveal>
      ) : null}

      {project.sourcesUses ? (
        <Block title="Sources and uses">
          <SourcesUsesTable data={project.sourcesUses} />
        </Block>
      ) : null}

      {project.threeCase ? (
        <Block title="Three-case returns">
          <ThreeCaseTable rows={project.threeCase} />
        </Block>
      ) : null}

      {project.returnsTable ? (
        <Block title="Returns">
          <ReturnsTable rows={project.returnsTable} />
        </Block>
      ) : null}

      {project.cashFlow ? (
        <Block title="Cash-flow timeline">
          <CashFlowChart rows={project.cashFlow} />
        </Block>
      ) : null}

      {project.moicSensitivity ? (
        <Block title="Sensitivity — MOIC">
          <SensitivityTable grid={project.moicSensitivity} unit="MOIC" />
        </Block>
      ) : null}

      {project.irrSensitivity ? (
        <Block title="Sensitivity — IRR">
          <SensitivityTable grid={project.irrSensitivity} unit="IRR" />
        </Block>
      ) : null}

      {project.keyFindings ? (
        <Block title="Key findings">
          <BulletList items={project.keyFindings} />
        </Block>
      ) : null}

      {project.chartImages ? (
        <Block title="The analysis">
          <div className="grid gap-5 sm:grid-cols-2">
            {project.chartImages.map((img) => (
              <ImageFigure key={img.src} img={img} />
            ))}
          </div>
        </Block>
      ) : null}

      {project.deliverables ? (
        <Block title="Deliverables">
          <BulletList items={project.deliverables} />
        </Block>
      ) : null}

      {project.methodology ? (
        <Block title="Methodology">
          <BulletList items={project.methodology} />
        </Block>
      ) : null}

      {project.knownGaps ? (
        <Block title="Known gaps and interview flags">
          <BulletList items={project.knownGaps} />
        </Block>
      ) : null}

      {project.modelImages ? (
        <Block title="From the model">
          <div className="grid gap-5 sm:grid-cols-2">
            {project.modelImages.map((img) => (
              <ImageFigure key={img.src} img={img} />
            ))}
          </div>
        </Block>
      ) : null}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ProjectDetail page
// ---------------------------------------------------------------------------

export function ProjectDetail({ slug }: { slug: string }) {
  const project = PROJECTS_CONTENT[slug]

  // Scroll to top + move focus to the heading on each route change.
  useEffect(() => {
    window.scrollTo(0, 0)
    const id = window.setTimeout(() => {
      document.getElementById("detail-h1")?.focus()
    }, 40)
    return () => window.clearTimeout(id)
  }, [slug])

  if (!project) return null

  return (
    <div className="min-h-dvh bg-sand text-deep-sea">
      <a
        href="#detail-main"
        className="sr-only rounded-lg bg-deep-sea px-4 py-2 text-linen focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-deep-sea/10 bg-sand/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <button
            type="button"
            onClick={() => goTo("#top")}
            className="rounded text-sm font-semibold tracking-tight text-deep-sea focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
          >
            Saptansu Neogi
          </button>
          <button
            type="button"
            onClick={() => goTo("#projects")}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-deep-sea/20 px-4 text-sm font-medium text-deep-sea transition-colors duration-200 hover:bg-deep-sea/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to portfolio
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <Sidebar activeSlug={slug} />
        <main id="detail-main" className="order-2 min-w-0 lg:order-1">
          <ProjectBody project={project} />
        </main>
      </div>
    </div>
  )
}
