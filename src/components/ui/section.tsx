import { type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface SectionProps {
  id: string
  children: ReactNode
  /** Outer background classes, e.g. "bg-sand" or "bg-linen". */
  className?: string
  /** Inner container max width. Default max-w-5xl. */
  containerClassName?: string
  "aria-labelledby"?: string
}

/** Standard section: full-bleed background, scroll-anchor offset, centered container. */
export function Section({
  id,
  children,
  className,
  containerClassName,
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-20 px-6 py-20 sm:py-28", className)}
      {...rest}
    >
      <div className={cn("mx-auto w-full max-w-5xl", containerClassName)}>
        {children}
      </div>
    </section>
  )
}

interface SectionHeadingProps {
  eyebrow: string
  title: string
  /** Optional supporting line under the title. */
  lead?: string
  className?: string
}

/** Consistent eyebrow + h2 + optional lead. The h2 id mirrors the title for aria-labelledby. */
export function SectionHeading({ eyebrow, title, lead, className }: SectionHeadingProps) {
  const headingId = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-sea">
        {eyebrow}
      </p>
      <h2
        id={headingId}
        className="mt-3 text-3xl font-semibold tracking-tight text-deep-sea sm:text-4xl lg:text-5xl"
      >
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 text-lg leading-relaxed text-deep-sea/75 sm:text-xl">
          {lead}
        </p>
      ) : null}
    </div>
  )
}
