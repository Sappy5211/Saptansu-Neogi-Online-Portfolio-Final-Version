import { type ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

interface RevealProps {
  children: ReactNode
  className?: string
  /** Stagger delay in seconds. */
  delay?: number
}

/**
 * Scroll-triggered entrance: rises up fast with a slight spring bounce when it
 * enters the viewport (once). Under prefers-reduced-motion it renders statically
 * with no transform.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduce = useReducedMotion()

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}
