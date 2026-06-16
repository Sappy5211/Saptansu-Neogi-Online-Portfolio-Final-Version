import { Cpu, GraduationCap } from "lucide-react"
import { useReducedMotion } from "motion/react"

import { Section, SectionHeading } from "@/components/ui/section"
import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"

interface NowItem {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  details: string
  note?: string
}

const nowItems: NowItem[] = [
  {
    id: "trading",
    icon: Cpu,
    title: "Systematic trading strategy",
    description: "Refining Python signal logic, back-testing structure, and risk-adjusted evaluation.",
    details: "Independent work in progress. No performance figures claimed.",
    note: "in development",
  },
  {
    id: "cfa",
    icon: GraduationCap,
    title: "CFA Level 1 candidate (November 2026)",
    description: "Studying quantitative methods, financial reporting, equities, fixed income, derivatives, ethics, and portfolio management.",
    details: "Building deeper knowledge across investment analysis and portfolio management.",
  },
]

export function Now() {
  const headingId = "what-i-m-working-on-right-now"
  const reduce = useReducedMotion()

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes nowspin {
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes nowping {
            0% {
              transform: scale(1);
              opacity: 0.6;
            }
            100% {
              transform: scale(2.4);
              opacity: 0;
            }
          }
        }
      `}</style>

      <Section id="now" className="bg-sand" aria-labelledby={headingId}>
        <div className="space-y-16">
          <SectionHeading
            eyebrow="Currently building"
            title="What I'm working on right now"
          />

          <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2">
            {nowItems.map((item, index) => {
              const Icon = item.icon
              const isInDevelopment = item.note === "in development"

              return (
                <Reveal key={item.id} delay={index * 0.08}>
                  {isInDevelopment && !reduce ? (
                    /* Animated gradient border card for in-development item */
                    <div className="relative rounded-2xl p-[1.5px] overflow-hidden">
                      <span
                        className="absolute inset-[-100%] opacity-100"
                        style={{
                          background: "conic-gradient(from 0deg, #2b7a8c, #bfe0e8, #d9a441, #2b7a8c)",
                          animation: "nowspin 6s linear infinite",
                        }}
                        aria-hidden="true"
                      />

                      <div className="group relative rounded-2xl bg-linen p-6 sm:p-8">
                        {/* Icon and title row */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-shrink-0">
                            <Icon className="w-6 h-6 text-sea" aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2">
                              <h3 className="text-lg font-semibold text-deep-sea leading-tight">
                                {item.title}
                              </h3>
                              {item.note && (
                                <div className="relative inline-flex items-center gap-1">
                                  <span className="text-xs font-medium text-slate bg-deep-sea/5 px-2 py-1 rounded">
                                    {item.note}
                                  </span>
                                  {/* Pulsing dot with ping ring */}
                                  <div className="relative flex h-2 w-2">
                                    <span
                                      className="absolute h-2 w-2 rounded-full bg-sea"
                                      style={{
                                        animation: "nowping 1.8s ease-out infinite",
                                      }}
                                      aria-hidden="true"
                                    />
                                    <span className="h-2 w-2 rounded-full bg-sea" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-base leading-relaxed text-deep-sea/75 mb-4">
                          {item.description}
                        </p>

                        {/* Note (if trading strategy) */}
                        {item.note === "in development" && (
                          <p className="text-xs text-slate italic mb-4">
                            {item.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : isInDevelopment && reduce ? (
                    /* Static border card (reduced motion) */
                    <div
                      className={cn(
                        "group relative rounded-2xl border border-sea/40 bg-linen p-6 sm:p-8",
                        "transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-sm"
                      )}
                    >
                      {/* Icon and title row */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0">
                          <Icon className="w-6 h-6 text-sea" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <h3 className="text-lg font-semibold text-deep-sea leading-tight">
                              {item.title}
                            </h3>
                            {item.note && (
                              <span className="text-xs font-medium text-slate bg-deep-sea/5 px-2 py-1 rounded">
                                {item.note}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-base leading-relaxed text-deep-sea/75 mb-4">
                        {item.description}
                      </p>

                      {/* Note (if trading strategy) */}
                      {item.note === "in development" && (
                        <p className="text-xs text-slate italic mb-4">
                          {item.details}
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Standard card for CFA item */
                    <div
                      className={cn(
                        "group relative rounded-2xl border border-deep-sea/10 bg-linen p-6 sm:p-8",
                        "transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-deep-sea/20 hover:shadow-sm"
                      )}
                    >
                      {/* Icon and title row */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0">
                          <Icon className="w-6 h-6 text-sea" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <h3 className="text-lg font-semibold text-deep-sea leading-tight">
                              {item.title}
                            </h3>
                            {item.note && (
                              <span className="text-xs font-medium text-slate bg-deep-sea/5 px-2 py-1 rounded">
                                {item.note}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-base leading-relaxed text-deep-sea/75 mb-4">
                        {item.description}
                      </p>

                      {/* Supporting detail (for CFA) */}
                      {!item.note && (
                        <p className="text-sm text-deep-sea/70">
                          {item.details}
                        </p>
                      )}
                    </div>
                  )}
                </Reveal>
              )
            })}
          </div>
        </div>
      </Section>
    </>
  )
}
