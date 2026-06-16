import { useEffect, useState } from "react"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { ArrowDown, Download } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { ParticleTextEffect } from "@/components/ui/particle-text-effect"
import { HeroVideoBackground } from "@/components/ui/hero-video-background"
import { cn } from "@/lib/utils"

const NAME = "Saptansu Neogi"
const CV_HREF = "/Saptansu-Neogi-CV.pdf"

const metrics = [
  { value: "12%", label: "Reporting cycle cut" },
  { value: "£43.3m", label: "LBO deal modelled" },
  { value: "+25%", label: "Sharpe · back-testing" },
  { value: "10+", label: "Client engagements" },
]

const EASE = [0.22, 1, 0.36, 1] as const

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.075, delayChildren: 0.05 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

type Phase = "hello" | "journey" | "content"

function readStaticPreference() {
  if (typeof window === "undefined") return false
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(max-width: 767px)").matches
  )
}

function useStaticHero() {
  const [isStatic, setIsStatic] = useState(readStaticPreference)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const small = window.matchMedia("(max-width: 767px)")
    const update = () => setIsStatic(reduce.matches || small.matches)
    update()
    reduce.addEventListener("change", update)
    small.addEventListener("change", update)
    return () => {
      reduce.removeEventListener("change", update)
      small.removeEventListener("change", update)
    }
  }, [])

  return isStatic
}

export function Hero() {
  const staticHero = useStaticHero()
  const [phase, setPhase] = useState<Phase>(() =>
    readStaticPreference() ? "content" : "hello"
  )

  useEffect(() => {
    if (staticHero) {
      setPhase("content")
      return
    }
    // "Hello" for 1.5 s → "Let's go on a journey together" for 2 s → reveal
    const t1 = window.setTimeout(() => setPhase("journey"), 1500)
    const t2 = window.setTimeout(() => setPhase("content"), 5700)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [staticHero])

  const showContent = phase === "content"
  const particleText =
    phase === "hello" ? "Hello" : "Let's go on a journey together"

  const scrollToProjects = () => {
    const el = document.getElementById("projects")
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
  }

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      <HeroVideoBackground />

      {/* Sequential particle text — "Hello" then the tagline */}
      <AnimatePresence mode="wait">
        {!showContent && (
          <motion.div
            key={particleText}
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <ParticleTextEffect text={particleText} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero content — two-column: text left, pfp right */}
      <motion.div
        variants={container}
        initial={staticHero ? false : "hidden"}
        animate={showContent ? "show" : "hidden"}
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-center gap-10 px-6 py-28 lg:flex-row lg:items-center lg:justify-between"
        style={{ minHeight: "100svh" }}
      >
        {/* ── Left column: all text ── */}
        <div className="flex flex-1 flex-col items-start gap-5 text-left">
          <motion.p
            variants={item}
            className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-sky-mist sm:text-xs"
          >
            BSc Economics · First Class · University of Birmingham
          </motion.p>

          <motion.h1
            variants={item}
            className="text-5xl font-semibold leading-[1.05] tracking-tight text-linen sm:text-6xl lg:text-7xl"
          >
            {NAME}
          </motion.h1>

          <motion.p
            variants={item}
            className="text-lg font-medium text-sky-mist sm:text-xl"
          >
            Finance &amp; Data Analyst
          </motion.p>

          <motion.p
            variants={item}
            className="max-w-xl text-balance text-2xl font-light leading-snug text-linen sm:text-3xl"
          >
            I build decision-ready analysis from real financial problems.
          </motion.p>

          <motion.p
            variants={item}
            className="max-w-xl text-sm leading-relaxed text-linen/75 sm:text-base"
          >
            Finance reporting at Nationwide Building Society, consulting research across 10+
            clients, and independent corporate finance builds. Every output
            traces to a real decision and a measurable outcome.
          </motion.p>

          <motion.div
            variants={item}
            className="grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-linen/15 bg-linen/10 px-4 py-4 backdrop-blur-md"
              >
                <div className="text-2xl font-semibold text-linen sm:text-[1.75rem]">
                  {m.value}
                </div>
                <div className="mt-1 text-[0.7rem] leading-tight text-sky-mist/90">
                  {m.label}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={item}
            className="flex flex-col items-start gap-3 sm:flex-row"
          >
            <Button size="lg" onClick={scrollToProjects}>
              View work
              <ArrowDown />
            </Button>
            <a
              href={CV_HREF}
              download
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Download CV
              <Download />
            </a>
          </motion.div>
        </div>

        {/* ── Right column: profile picture ── */}
        <motion.div variants={item} className="mx-auto shrink-0 lg:mx-0">
          {/*
            Swap in your real photo:
              1. Drop pfp.jpg (or .webp / .png) into /public
              2. Replace the <div> below with:
                 <img src="/pfp.jpg" alt="Saptansu Neogi"
                   className="h-56 w-56 rounded-full object-cover object-top
                              ring-2 ring-linen/20 lg:h-72 lg:w-72" />
          */}
          <div className="flex h-56 w-56 items-center justify-center rounded-full border border-linen/20 bg-linen/10 text-5xl font-semibold text-linen/50 backdrop-blur-sm ring-1 ring-linen/10 lg:h-72 lg:w-72 lg:text-6xl">
            SN
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
