import { type Variants } from "motion/react"

/** Shared easing — matches the hero. */
export const EASE = [0.22, 1, 0.36, 1] as const

/** Fade-and-rise for a single element. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

/** Parent that staggers fadeUp children. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
}
