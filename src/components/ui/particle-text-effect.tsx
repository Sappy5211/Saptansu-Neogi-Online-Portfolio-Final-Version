import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

interface ParticleTextEffectProps {
  /** Word(s) to assemble from particles. Assembled once on mount. */
  text?: string
  /** Particle colour. Defaults to the --color-sky-mist token. */
  color?: string
  className?: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  tx: number
  ty: number
  phase: number
}

export function ParticleTextEffect({
  text = "Saptansu Neogi",
  color,
  className,
}: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resolvedColor =
      color ||
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-sky-mist")
        .trim() ||
      "#bfe0e8"

    let particles: Particle[] = []
    let raf = 0
    let width = 0
    let height = 0
    let dpr = 1
    let dotSize = 1.8
    let t = 0

    let inView = true
    let pageVisible = !document.hidden
    let looping = false

    const stiffness = 0.055
    const friction = 0.86
    const maxSpeed = 5

    /**
     * Compute target pixel positions for the given text.
     *
     * Short texts (e.g. "Hello") render on a single line at maximum size.
     * Long texts automatically wrap to two balanced lines so the font stays
     * large enough to read comfortably.
     */
    const sampleTargets = (): { x: number; y: number }[] => {
      const sample = document.createElement("canvas")
      sample.width = Math.max(1, Math.floor(width))
      sample.height = Math.max(1, Math.floor(height))
      const sctx = sample.getContext("2d")
      if (!sctx || width < 2 || height < 2) return []

      const fontFor = (s: number) =>
        `600 ${s}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`

      const availW = width * 0.88

      // ── Try single-line sizing first ───────────────────────────────────────
      let initFS = Math.min(height * 0.42, width * 0.22)
      sctx.font = fontFor(initFS)
      const measuredSingle = sctx.measureText(text).width
      const scaledSingle =
        measuredSingle > 0
          ? Math.min((initFS * availW) / measuredSingle, height * 0.5)
          : initFS

      let renderLines: string[]
      let renderFontSize: number

      const words = text.split(" ")

      if (scaledSingle >= 90 || words.length <= 2) {
        // Single line is large enough (≥90 px) or text is very short
        renderFontSize = scaledSingle
        renderLines = [text]
      } else {
        // ── Two-line layout ────────────────────────────────────────────────
        // Find the word split that best balances character counts per line
        const totalChars = text.replace(/ /g, "").length
        let bestSplit = Math.ceil(words.length / 2)
        let bestDiff = Infinity
        let cum = 0
        for (let i = 0; i < words.length - 1; i++) {
          cum += words[i].length
          const diff = Math.abs(cum - (totalChars - cum))
          if (diff < bestDiff) {
            bestDiff = diff
            bestSplit = i + 1
          }
        }
        const line1 = words.slice(0, bestSplit).join(" ")
        const line2 = words.slice(bestSplit).join(" ")
        renderLines = [line1, line2]

        // Size so the longer line fills ~88 % of the canvas width
        const initFS2 = Math.min(height * 0.26, width * 0.16)
        sctx.font = fontFor(initFS2)
        const maxMeasured = Math.max(
          sctx.measureText(line1).width,
          sctx.measureText(line2).width,
        )
        renderFontSize =
          maxMeasured > 0
            ? Math.min((initFS2 * availW) / maxMeasured, height * 0.30)
            : initFS2
      }

      // ── Render text to off-screen canvas ────────────────────────────────
      sctx.font = fontFor(renderFontSize)
      sctx.textAlign = "center"
      sctx.textBaseline = "middle"
      sctx.fillStyle = "#fff"

      if (renderLines.length === 1) {
        sctx.fillText(renderLines[0], width / 2, height / 2)
      } else {
        const lineH = renderFontSize * 1.35
        const startY = height / 2 - lineH / 2
        renderLines.forEach((line, i) => {
          sctx.fillText(line, width / 2, startY + i * lineH)
        })
      }

      // ── Sample lit pixels ───────────────────────────────────────────────
      const gap = width < 700 ? 5 : 4
      const data = sctx.getImageData(0, 0, sample.width, sample.height).data
      const pts: { x: number; y: number }[] = []
      for (let y = 0; y < sample.height; y += gap) {
        for (let x = 0; x < sample.width; x += gap) {
          if (data[(y * sample.width + x) * 4 + 3] > 128) pts.push({ x, y })
        }
      }
      return pts
    }

    const init = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dotSize = width < 700 ? 1.6 : 1.8

      const targets = sampleTargets()

      if (particles.length === 0) {
        // First build: scatter across the canvas, then converge into the text.
        particles = targets.map((target) => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (Math.random() * 3 + 2),
          vy: (Math.random() - 0.5) * (Math.random() * 3 + 2),
          tx: target.x,
          ty: target.y,
          phase: Math.random() * Math.PI * 2,
        }))
      } else {
        // Resize: re-fit by reassigning targets to existing particles.
        const next: Particle[] = []
        for (let i = 0; i < targets.length; i++) {
          const base = particles[i % particles.length]
          next.push({
            x: base ? base.x : Math.random() * width,
            y: base ? base.y : Math.random() * height,
            vx: 0,
            vy: 0,
            tx: targets[i].x,
            ty: targets[i].y,
            phase: base ? base.phase : Math.random() * Math.PI * 2,
          })
        }
        particles = next
      }
    }

    const frame = () => {
      t += 0.016
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = resolvedColor
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const sx = p.tx + Math.sin(t * 1.2 + p.phase) * 0.6
        const sy = p.ty + Math.cos(t * 1.1 + p.phase) * 0.6
        p.vx = (p.vx + (sx - p.x) * stiffness) * friction
        p.vy = (p.vy + (sy - p.y) * stiffness) * friction
        const sp = Math.hypot(p.vx, p.vy)
        if (sp > maxSpeed) {
          p.vx = (p.vx / sp) * maxSpeed
          p.vy = (p.vy / sp) * maxSpeed
        }
        p.x += p.vx
        p.y += p.vy
        ctx.fillRect(p.x, p.y, dotSize, dotSize)
      }
      raf = requestAnimationFrame(frame)
    }

    const syncLoop = () => {
      const shouldRun = inView && pageVisible
      if (shouldRun && !looping) {
        looping = true
        raf = requestAnimationFrame(frame)
      } else if (!shouldRun && looping) {
        looping = false
        cancelAnimationFrame(raf)
      }
    }

    init()
    syncLoop()

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true
        syncLoop()
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    const onVisibility = () => {
      pageVisible = !document.hidden
      syncLoop()
    }
    document.addEventListener("visibilitychange", onVisibility)

    let resizeTimer = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        init()
        syncLoop()
      }, 150)
    })
    ro.observe(canvas)

    return () => {
      looping = false
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      clearTimeout(resizeTimer)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [text, color])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  )
}
