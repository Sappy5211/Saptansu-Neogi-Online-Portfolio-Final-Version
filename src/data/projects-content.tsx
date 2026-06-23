/**
 * projects-content.tsx
 * All project case-study data transcribed exactly from PROJECTS_DETAIL_SPEC.md.
 * Do NOT alter numbers or captions.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MetricChip {
  label: string
  hero?: boolean // render in golden-hour
}

export interface CashFlowRow {
  year: string
  amount: number // £m, negative = outflow
  note: string
}

export interface TableRow {
  label: string
  downside: string
  base: string
  upside: string
}

export interface SensitivityGrid {
  /** Row labels (left axis) */
  rowLabels: string[]
  /** Column labels (top axis) */
  colLabels: string[]
  /** cells[row][col] */
  cells: string[][]
  /** Zero-based [row, col] of base cell */
  baseCell: [number, number]
  rowAxisLabel: string
  colAxisLabel: string
}

export interface SourcesUsesRow {
  label: string
  amount: string
}

export interface ChartImage {
  src: string
  alt: string
  caption: string
}

export interface ProjectContent {
  slug: string
  title: string
  type: string
  tools: string
  background: string[]
  metricChips: MetricChip[]
  // LBO-specific
  threeCase?: TableRow[]
  cashFlow?: CashFlowRow[]
  moicSensitivity?: SensitivityGrid
  // AquaServe-specific
  sourcesUses?: { uses: SourcesUsesRow[]; sources: SourcesUsesRow[] }
  returnsTable?: { label: string; value: string }[]
  irrSensitivity?: SensitivityGrid
  // Water-specific
  keyFindings?: string[]
  deliverables?: string[]
  chartImages?: ChartImage[]
  // Prose blocks
  methodology?: string[]
  knownGaps?: string[]
  // LBO model images
  modelImages?: ChartImage[]
}

// ---------------------------------------------------------------------------
// VoltaGrid Energy Ltd
// ---------------------------------------------------------------------------

const voltagrid: ProjectContent = {
  slug: "voltagrid",
  title: "VoltaGrid Energy Ltd",
  type: "PE / LBO",
  tools: "Excel, Python, PowerPoint",
  background: [
    "LBO investment-committee case on VoltaGrid Energy Ltd, a UK grid-scale battery energy storage (BESS) platform. Norland Capital acquires a 60% stake at £45.0m enterprise value (7.5x FY24 EBITDA of £6.0m). 5-year hold, FY24–FY29. Three cases built (downside / base / upside), all on a total-equity MOIC and full cash-flow IRR.",
  ],
  metricChips: [
    { label: "2.2x MOIC", hero: true },
    { label: "~20% IRR (base)" },
    { label: "£45.0m EV" },
  ],
  threeCase: [
    { label: "Exit multiple", downside: "7.5x", base: "8.0x", upside: "9.0x" },
    { label: "Rev per MW annual growth", downside: "2.0%", base: "3.0%", upside: "3.0%" },
    { label: "Exit EBITDA margin", downside: "35.0%", base: "36.0%", upside: "36.0%" },
    { label: "FY29 EBITDA", downside: "£24.3m", base: "£26.3m", upside: "£26.3m" },
    { label: "Exit EV", downside: "£182.6m", base: "£210.3m", upside: "£236.6m" },
    { label: "Exit net debt (post-sweep)", downside: "£93.4m", base: "£92.3m", upside: "£92.3m" },
    { label: "Exit equity (100%)", downside: "£89.2m", base: "£118.1m", upside: "£144.3m" },
    { label: "Norland exit proceeds (60%)", downside: "£53.5m", base: "£70.8m", upside: "£86.6m" },
    { label: "+ FY29 distribution", downside: "£1.9m", base: "£2.3m", upside: "£2.3m" },
    { label: "Norland Y5 total", downside: "£55.4m", base: "£73.1m", upside: "£88.9m" },
    { label: "Total equity invested", downside: "£34.3m", base: "£33.3m", upside: "£33.3m" },
    { label: "MOIC (total equity)", downside: "1.62x", base: "2.20x", upside: "2.68x" },
    { label: "Full CF IRR", downside: "c.12%", base: "c.20%", upside: "c.25%" },
  ],
  cashFlow: [
    { year: "FY24", amount: -20.40, note: "Initial equity cheque" },
    { year: "FY25", amount: -4.58, note: "Construction draw" },
    { year: "FY26", amount: -5.50, note: "Construction draw" },
    { year: "FY27", amount: -2.80, note: "Construction draw" },
    { year: "FY28", amount: 0.20, note: "Fleet near-complete, small return" },
    { year: "FY29", amount: 73.15, note: "Exit £70.8m + FY29 distribution £2.3m" },
  ],
  moicSensitivity: {
    rowAxisLabel: "Revenue growth (per MW)",
    colAxisLabel: "Exit multiple",
    rowLabels: ["2.0%", "2.5%", "3.0%", "3.5%", "4.0%"],
    colLabels: ["7.0x", "7.5x", "8.0x", "8.5x", "9.0x"],
    cells: [
      ["1.3x", "1.6x", "1.8x", "2.1x", "2.4x"],
      ["1.5x", "1.7x", "2.0x", "2.2x", "2.5x"],
      ["1.8x", "2.0x", "2.2x", "2.5x", "2.7x"],
      ["1.9x", "2.2x", "2.4x", "2.7x", "2.9x"],
      ["2.1x", "2.4x", "2.6x", "2.9x", "3.2x"],
    ],
    baseCell: [2, 2], // 3.0% × 8.0x = 2.2x
  },
  methodology: [
    "MOIC = total proceeds / total equity invested. Denominator = initial cheque (£20.4m) plus all construction draws. Numerator = all positive Norland cash flows (FY29 distribution + exit proceeds).",
    "IRR = full-timeline cash-flow IRR (npf.irr), not a CAGR and not calculated on the initial cheque only.",
    "The 50% cash sweep is already reflected in the exit net-debt balance, so only the non-swept distributable FCF (£1.9–2.3m Norland share) is counted separately — no double count.",
  ],
  knownGaps: [
    "Revenue per MW assumptions (£0.150m FY24, 2–3% growth) are not anchored to a contracted offtake — this is the key diligence gate.",
    "Exit margin (35–36%) needs validation against comparables; battery degradation is not explicitly modelled.",
    "The 1.6x–2.7x MOIC spread reflects sensitivity to multiple re-rating; revenue quality is the primary determinant of whether the base case holds.",
  ],
  modelImages: [
    {
      src: "/projects/voltagrid/returns.png",
      alt: "Excel spreadsheet showing three-case returns summary for VoltaGrid: downside 1.62x MOIC c.12% IRR, base 2.20x c.20%, upside 2.68x c.25%",
      caption: "Three-case returns — Excel model",
    },
    {
      src: "/projects/voltagrid/sensitivity.png",
      alt: "Sensitivity analysis tab in Excel showing MOIC and IRR grids across exit multiples and revenue growth rates",
      caption: "Sensitivity tab — MOIC and IRR grids",
    },
  ],
}

// ---------------------------------------------------------------------------
// AquaServe Water Services
// ---------------------------------------------------------------------------

const aquaserve: ProjectContent = {
  slug: "aquaserve",
  title: "AquaServe Water Services",
  type: "PE / LBO",
  tools: "Excel, Python, PowerPoint",
  background: [
    "LBO investment-committee case on AquaServe Water Services, a UK water-services business. Entry £43.3m EV / 8.0x EBITDA (c.£5.41m). Sponsor equity £20.6m (total uses £45.0m less senior debt £24.4m). A deliberately conservative base, built to test whether the 20%+ IRR target holds — it does not on conservative assumptions; one turn of exit re-rating is needed.",
  ],
  metricChips: [
    { label: "2.21x MOIC", hero: true },
    { label: "17.2% IRR (base)" },
    { label: "£43.3m EV" },
  ],
  sourcesUses: {
    uses: [
      { label: "Purchase price (EV)", amount: "£43.3m" },
      { label: "Transaction fees (~3% EV)", amount: "£1.2m" },
      { label: "Cash to balance sheet", amount: "£0.5m" },
      { label: "Total uses", amount: "£45.0m" },
    ],
    sources: [
      { label: "Senior debt (4.5x EBITDA)", amount: "£24.4m" },
      { label: "Sponsor equity", amount: "£20.6m" },
      { label: "Total sources", amount: "£45.0m" },
    ],
  },
  returnsTable: [
    { label: "Entry EV", value: "£43.3m (8.0x)" },
    { label: "Entry leverage", value: "4.5x (£24.4m debt)" },
    { label: "Sponsor equity", value: "£20.6m" },
    { label: "Y5 EBITDA", value: "£7.14m (4.0% revenue growth, margin 29.5% → 32.0%)" },
    { label: "Exit EV", value: "£57.1m (8.0x flat)" },
    { label: "Exit net debt", value: "£11.5m (de-levers 4.5x → c.1.6x)" },
    { label: "MOIC", value: "2.21x" },
    { label: "IRR (base)", value: "17.2% (below 20% anchor)" },
    { label: "Upside (9.0x exit)", value: "2.56x / 20.7%" },
    { label: "Downside (7.0x, 2% growth, flat margins, +10% capex)", value: "1.24x / 4.4%" },
  ],
  moicSensitivity: {
    rowAxisLabel: "Exit multiple",
    colAxisLabel: "Revenue growth",
    rowLabels: ["7.0x", "8.0x", "9.0x"],
    colLabels: ["2.0%", "3.0%", "4.0%"],
    cells: [
      ["1.50x", "1.87x", "2.23x"],
      ["1.81x", "2.21x", "2.62x"],
      ["2.12x", "2.56x", "3.00x"],
    ],
    baseCell: [1, 1], // 8.0x × 3.0% = 2.21x
  },
  irrSensitivity: {
    rowAxisLabel: "Exit multiple",
    colAxisLabel: "Revenue growth",
    rowLabels: ["7.0x", "8.0x", "9.0x"],
    colLabels: ["2.0%", "3.0%", "4.0%"],
    cells: [
      ["8.4%", "13.3%", "17.4%"],
      ["12.6%", "17.2%", "21.2%"],
      ["16.2%", "20.7%", "24.5%"],
    ],
    baseCell: [1, 1], // 8.0x × 3.0% = 17.2%
  },
  knownGaps: [
    "Base case gives 17.2% IRR, not 20%+. The hurdle needs an upside multiple or confirmed revenue growth; the model says so explicitly.",
    "Bad-debt exposure is not hedged.",
    "4.0% revenue growth requires volume growth (not just price) in a competitive water-services market.",
  ],
  modelImages: [
    {
      src: "/projects/aquaserve/returns.png",
      alt: "Excel spreadsheet showing AquaServe returns summary: entry 8.0x EV, sponsor equity £20.6m, base MOIC 2.21x IRR 17.2%",
      caption: "Returns summary — Excel model",
    },
    {
      src: "/projects/aquaserve/sensitivity.png",
      alt: "Sensitivity analysis tab in Excel showing AquaServe MOIC and IRR grids across exit multiples and revenue growth rates",
      caption: "Sensitivity tab — MOIC and IRR grids",
    },
  ],
}

// ---------------------------------------------------------------------------
// UK Water Utility KPI Dashboard
// ---------------------------------------------------------------------------

const water: ProjectContent = {
  slug: "water",
  title: "UK Water Utility KPI Dashboard",
  type: "Data analytics",
  tools: "Python (pandas, matplotlib, scipy), Chart.js, HTML",
  background: [
    "Data-analytics project on UK water-utility performance, FY2020–FY2024. Synthetic data calibrated to Ofwat PR24 benchmarks across three areas: network and supply operations, customer and retail, and financial and regulatory (ODI).",
  ],
  metricChips: [
    { label: "−24 Ml/d leakage", hero: true },
    { label: "3 dashboards" },
    { label: "2 Python EDA scripts" },
  ],
  keyFindings: [
    "Network: leakage fell from 157 Ml/d (FY2020) to 133 Ml/d (FY2024), down 24 Ml/d, still 13 Ml/d above the 120 Ml/d PR24 target. Mains bursts and leakage are positively correlated (r = 0.53), driven by winter freeze-thaw cycles.",
    "Customer: C-MeX improved from c.78 to c.82 (approaching upper quartile). Complaints per 1,000 customers fell 31%. Bad debt peaked at 2.5% in FY2021 (Covid-19 arrears) and recovered to 1.9% by FY2024.",
    "Financial: totex swung from £5.4m over allowance (FY2020) to £2.8m under allowance (FY2024). Cumulative ODI net +£1.8m over 5 years (3 reward years, 2 penalty years). Supply interruptions fell from 14.1 to 10.2 minutes per property.",
  ],
  deliverables: [
    "3 interactive HTML dashboards (Chart.js, dark theme, year-filter dropdown).",
    "2 Python EDA scripts (leakage; ODI/totex) producing 6 publication-quality charts.",
    "An analyst-voice findings note (10 bullets).",
  ],
  chartImages: [
    {
      src: "/projects/water/leakage-annual.jpg",
      alt: "Bar chart showing annual average leakage in megalitres per day from FY2020 to FY2024, compared to the Ofwat PR24 target of 120 Ml/d",
      caption: "Annual average leakage vs Ofwat PR24 target",
    },
    {
      src: "/projects/water/leakage-monthly.jpg",
      alt: "Line chart showing monthly leakage trend from FY2020 to FY2024, with seasonal peaks visible in winter months",
      caption: "Monthly leakage trend, FY2020–FY2024",
    },
    {
      src: "/projects/water/mains-bursts.jpg",
      alt: "Scatter plot showing mains bursts versus leakage with a positive correlation coefficient of 0.53",
      caption: "Mains bursts vs leakage (r = 0.53)",
    },
    {
      src: "/projects/water/odi-net.jpg",
      alt: "Bar chart showing annual net ODI outcome in pounds millions, with 3 reward years and 2 penalty years over FY2020–FY2024",
      caption: "Annual net ODI outcome (£m)",
    },
    {
      src: "/projects/water/totex.jpg",
      alt: "Bar chart comparing totex actual versus allowance, swinging from £5.4m over in FY2020 to £2.8m under in FY2024",
      caption: "Totex actual vs allowance",
    },
    {
      src: "/projects/water/capex-supply.jpg",
      alt: "Dual-axis chart showing capex against supply interruptions (minutes per property), falling from 14.1 to 10.2 minutes",
      caption: "Capex vs supply interruptions",
    },
  ],
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const PROJECTS_CONTENT: Record<string, ProjectContent> = {
  voltagrid,
  aquaserve,
  water,
}

export const PROJECT_ORDER = ["voltagrid", "aquaserve", "water"] as const

export const PROJECT_SIDEBAR_ITEMS = [
  { slug: "voltagrid", title: "VoltaGrid Energy Ltd", type: "PE / LBO" },
  { slug: "aquaserve", title: "AquaServe Water Services", type: "PE / LBO" },
  { slug: "water", title: "UK Water Utility KPI Dashboard", type: "Data analytics" },
] as const
