/**
 * Navbar — fixed top, transparent over hero, solid on scroll.
 *
 * Desktop (≥ md):
 *   - Hover-follow pill: a single translucent pill that slides/resizes
 *     to sit behind the hovered tab, fading out on mouse-leave.
 *   - Active "lamp" spotlight: a spring-animated glowing bar above the
 *     scroll-spy active tab using layoutId, combined with tinted text.
 *   Both animations run together — hover pill slides, lamp persists.
 *
 * Mobile (< md):
 *   - Hamburger button morphs into X; opens a full-width dropdown sheet
 *     with rectangular FlowButton-style items per section plus a Download
 *     CV CTA. Items stagger in with translateY and a gooey SVG filter
 *     that makes them merge like liquid as they settle. The filter is
 *     removed once items are at rest so text stays crisp.
 *
 * A11y: <header><nav aria-label="Primary">, focus rings, Escape, aria-expanded,
 *        aria-current, aria-hidden on decorative elements, click-away close.
 * Motion: useReducedMotion disables all transitions/springs, goo filter, and
 *          expanding-fill — menus remain fully operable.
 */

import { useEffect, useRef, useState, useCallback } from "react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type MotionStyle,
} from "motion/react"
import {
  Menu,
  X,
  Download,
  ArrowRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { EASE } from "@/lib/motion"

// ── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "About",      href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects",   href: "#projects" },
  { label: "Now",        href: "#now" },
  { label: "Contact",    href: "#contact" },
] as const

const SECTION_IDS = ["about", "experience", "projects", "now", "contact"] as const

type SectionId = (typeof SECTION_IDS)[number]

const MOBILE_MENU_ID = "mobile-menu"
const LAMP_LAYOUT_ID = "nav-lamp"

// ── GooeyFilter ──────────────────────────────────────────────────────────────
// Hidden SVG filter — gaussian blur + colour-matrix threshold produces the
// "liquid merge" effect when adjacent solid-background elements are blurred
// together under the filter. Must be aria-hidden (purely decorative).

interface GooeyFilterProps {
  id?: string
  strength?: number
}

function GooeyFilter({ id = "goo-filter", strength = 8 }: GooeyFilterProps) {
  return (
    <svg className="hidden absolute" aria-hidden="true">
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={strength} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  )
}

// ── MobileNavItem ─────────────────────────────────────────────────────────────
// Rectangular FlowButton-style nav item.
// - Inactive rest state: solid bg-linen (required for goo merge to work)
// - Active section: persistently bg-sea text-linen
// - On press (active:): expanding bg-sea circle sweeps the rectangle;
//   text + arrow transition to text-linen via CSS group-active selectors.
// - Under prefers-reduced-motion: no expanding fill, no translateY stagger.

interface MobileNavItemProps {
  label: string
  isActive: boolean
  index: number
  prefersReduced: boolean
  onClick: () => void
}

function MobileNavItem({
  label,
  isActive,
  index,
  prefersReduced,
  onClick,
}: MobileNavItemProps) {
  // Stagger: each item drops in 55 ms after the previous one.
  // Total stagger for 5 items = ~275 ms + 150 ms animation = ~425 ms.
  // gooActive timer (450 ms) is calibrated to cover this window.
  const delay = prefersReduced ? 0 : index * 0.055

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={
        prefersReduced
          ? { opacity: 0 }
          : { opacity: 0, y: 8, transition: { duration: 0.12, ease: EASE } }
      }
      transition={
        prefersReduced
          ? { duration: 0 }
          : { duration: 0.22, delay, ease: EASE }
      }
    >
      <button
        type="button"
        role="menuitem"
        aria-current={isActive ? "true" : undefined}
        onClick={onClick}
        className={cn(
          // Layout — rectangular, full-width, min 48 px touch target
          "group relative flex w-full min-h-[48px] items-center justify-between overflow-hidden",
          "rounded-lg px-5 py-3.5",
          // Border + focus
          "border-[1.5px] transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2 focus-visible:ring-offset-sand",
          // Active section — persistently filled
          isActive
            ? "border-transparent bg-sea text-linen"
            : [
                // Inactive rest: solid bg-linen so goo blur can merge adjacent items
                "bg-linen border-deep-sea/20 text-deep-sea",
                // Press state — border fades, text and arrow go linen
                "active:border-transparent active:text-linen",
              ],
        )}
      >
        {/* Expanding fill circle — sweeps on press for inactive items.
            Disabled under prefers-reduced-motion. */}
        {!isActive && !prefersReduced && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute left-1/2 top-1/2 h-4 w-4",
              "-translate-x-1/2 -translate-y-1/2 rounded-full bg-sea",
              "opacity-0 transition-all duration-[600ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
              "group-active:h-[300px] group-active:w-[300px] group-active:opacity-100",
            )}
          />
        )}

        {/* Label */}
        <span className="relative z-10 text-sm font-semibold">
          {label}
        </span>

        {/* Arrow — shifts right slightly on press */}
        <ArrowRight
          aria-hidden="true"
          className={cn(
            "relative z-10 h-4 w-4 shrink-0 transition-all duration-300",
            isActive
              ? "stroke-linen"
              : "stroke-deep-sea/50 group-active:translate-x-1 group-active:stroke-linen",
          )}
        />
      </button>
    </motion.div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function scrollToAnchor(href: string, prefersReduced: boolean) {
  if (href === "#top") {
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" })
    return
  }
  const id = href.replace("#", "")
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" })
}

// ── Component ────────────────────────────────────────────────────────────────

export function Navbar() {
  const prefersReduced = useReducedMotion() ?? false

  // Scrolled state (transparent → solid at 80 px)
  const [scrolled, setScrolled] = useState(false)

  // Scroll-spy active section
  const [activeSection, setActiveSection] = useState<SectionId | null>(null)

  // Mobile menu open/close
  const [menuOpen, setMenuOpen] = useState(false)

  // Gooey filter is active only during open/close animation (not at rest).
  // true  → filter applied while items are staggering in or out.
  // false → filter removed so text is crisp at rest.
  const [gooActive, setGooActive] = useState(false)
  const gooTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Desktop hover-pill state: measured against the <ul> element
  const ulRef = useRef<HTMLUListElement>(null)
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null)
  const [pillVisible, setPillVisible] = useState(false)

  // Ref for the trigger button (for focus return on Escape)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Ref for the radial menu container (for click-away detection)
  const radialMenuRef = useRef<HTMLDivElement>(null)

  // ── Scroll listener ──────────────────────────────────────────────────────
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // ── Scroll-spy via IntersectionObserver ─────────────────────────────────
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  // ── Gooey filter lifecycle ───────────────────────────────────────────────
  // When the menu opens: activate goo immediately, clear it after 450 ms
  // (long enough for all 5 items + last item stagger ~275 ms + 150 ms motion).
  // When the menu closes: activate goo briefly to cover the exit stagger,
  // then clear once all items have exited (~200 ms).
  // Under prefers-reduced-motion the filter is never applied.
  useEffect(() => {
    if (prefersReduced) return
    if (gooTimerRef.current) clearTimeout(gooTimerRef.current)
    if (menuOpen) {
      setGooActive(true)
      gooTimerRef.current = setTimeout(() => setGooActive(false), 450)
    } else {
      setGooActive(true)
      gooTimerRef.current = setTimeout(() => setGooActive(false), 220)
    }
    return () => {
      if (gooTimerRef.current) clearTimeout(gooTimerRef.current)
    }
  // We intentionally react only to menuOpen changes (not prefersReduced —
  // that is stable after mount).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen])

  // ── Escape key closes mobile menu ────────────────────────────────────────
  useEffect(() => {
    if (!menuOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [menuOpen])

  // ── Body scroll lock while mobile menu is open ───────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  // ── Click-away closes mobile menu ────────────────────────────────────────
  useEffect(() => {
    if (!menuOpen) return
    function onPointerDown(e: PointerEvent) {
      if (
        radialMenuRef.current &&
        !radialMenuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [menuOpen])

  // ── Hover-pill measurement ────────────────────────────────────────────────
  const measurePill = useCallback((liEl: HTMLLIElement) => {
    if (!ulRef.current || prefersReduced) return
    const ulRect = ulRef.current.getBoundingClientRect()
    const liRect = liEl.getBoundingClientRect()
    setPillStyle({
      left: liRect.left - ulRect.left,
      width: liRect.width,
    })
    setPillVisible(true)
  }, [prefersReduced])

  const hidePill = useCallback(() => {
    setPillVisible(false)
  }, [])

  // ── Link click handler ────────────────────────────────────────────────────
  function handleLinkClick(href: string) {
    setMenuOpen(false)
    // The mobile menu locks body scroll (overflow:hidden). Release it now so
    // scrollIntoView isn't blocked, then scroll once the close has settled.
    // On desktop the body is never locked, so this is a harmless no-op.
    document.body.style.overflow = ""
    window.setTimeout(() => scrollToAnchor(href, prefersReduced), 70)
  }

  // ── Derived classes ───────────────────────────────────────────────────────
  const headerCls = cn(
    "fixed inset-x-0 top-0 z-50 w-full transition-all duration-300",
    scrolled
      ? "border-b border-deep-sea/10 bg-sand/90 backdrop-blur-md"
      : "bg-transparent"
  )

  const wordmarkCls = cn(
    "rounded text-sm font-semibold tracking-tight transition-colors duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    scrolled
      ? "text-deep-sea focus-visible:ring-sea focus-visible:ring-offset-sand"
      : "text-linen focus-visible:ring-sky-mist"
  )

  const ctaCls = cn(
    "hidden lg:inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium",
    "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    scrolled
      ? "border border-deep-sea/20 text-deep-sea hover:bg-deep-sea/5 focus-visible:ring-sea focus-visible:ring-offset-sand"
      : "border border-linen/30 text-linen hover:bg-linen/10 focus-visible:ring-sky-mist"
  )

  const triggerCls = cn(
    "relative flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:hidden",
    scrolled
      ? "text-deep-sea hover:bg-deep-sea/8 focus-visible:ring-sea focus-visible:ring-offset-sand"
      : "text-linen hover:bg-linen/15 focus-visible:ring-sky-mist"
  )

  // ── Pill overlay style ─────────────────────────────────────────────────────
  // State-aware: over hero → linen/15, scrolled → deep-sea/8
  const pillBg = scrolled ? "rgba(20,50,59,0.08)" : "rgba(251,248,242,0.15)"

  // ── Lamp indicator colour ─────────────────────────────────────────────────
  const lampColor = scrolled ? "#2b7a8c" : "#bfe0e8"   // sea / sky-mist
  const lampGlow  = scrolled ? "rgba(43,122,140,0.20)" : "rgba(191,224,232,0.20)"

  return (
    <header className={headerCls}>
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6"
      >
        {/* ── Wordmark ─────────────────────────────────────────────────── */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            scrollToAnchor("#top", prefersReduced)
          }}
          className={wordmarkCls}
        >
          Saptansu Neogi
        </a>

        {/* ── Desktop pill-group nav ────────────────────────────────────── */}
        <ul
          ref={ulRef}
          className="relative hidden items-center gap-1 md:flex"
          role="list"
          onMouseLeave={hidePill}
        >
          {/* Hover-follow pill (no mix-blend; state-aware bg) */}
          {pillStyle && !prefersReduced && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 my-1 rounded-full"
              style={{ backgroundColor: pillBg } as MotionStyle}
              animate={{
                left: pillStyle.left,
                width: pillStyle.width,
                opacity: pillVisible ? 1 : 0,
              }}
              transition={{ duration: 0.18, ease: EASE }}
            />
          )}

          {NAV_LINKS.map(({ label, href }) => {
            const id = href.replace("#", "") as SectionId
            const isActive = activeSection === id

            const linkTextCls = cn(
              "relative z-10 block px-3.5 py-1.5 text-sm font-medium rounded-full",
              "transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              scrolled
                ? [
                    "focus-visible:ring-sea focus-visible:ring-offset-sand",
                    isActive ? "text-sea" : "text-deep-sea/75 hover:text-deep-sea",
                  ]
                : [
                    "focus-visible:ring-sky-mist",
                    isActive ? "text-sky-mist" : "text-linen/80 hover:text-linen",
                  ]
            )

            return (
              <li
                key={href}
                className="relative"
                onMouseEnter={(e) => measurePill(e.currentTarget)}
              >
                {/* Lamp: glowing top bar for the active section */}
                {isActive && (
                  <motion.span
                    layoutId={prefersReduced ? undefined : LAMP_LAYOUT_ID}
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-px left-3 right-3 h-0.5 rounded-full"
                    style={{ backgroundColor: lampColor }}
                    transition={
                      prefersReduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 300, damping: 30 }
                    }
                  >
                    {/* Glow halo behind the lamp bar */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-x-1 -top-1 h-4 blur-md rounded-full"
                      style={{ backgroundColor: lampGlow }}
                    />
                  </motion.span>
                )}

                <a
                  href={href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick(href)
                  }}
                  className={linkTextCls}
                  aria-current={isActive ? "true" : undefined}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>

        {/* ── Desktop CTA ──────────────────────────────────────────────── */}
        <a href="/Saptansu-Neogi-CV.pdf" download className={ctaCls}>
          <Download aria-hidden="true" className="h-3.5 w-3.5" />
          Download CV
        </a>

        {/* ── Mobile hamburger trigger ──────────────────────────────────── */}
        <button
          ref={triggerRef}
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls={MOBILE_MENU_ID}
          aria-haspopup="true"
          className={triggerCls}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <AnimatePresence mode="wait" initial={false}>
            {menuOpen ? (
              <motion.span
                key="close"
                initial={prefersReduced ? false : { rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={prefersReduced ? { opacity: 0 } : { rotate: 45, opacity: 0 }}
                transition={{ duration: 0.18, ease: EASE }}
                className="flex items-center justify-center"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={prefersReduced ? false : { rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={prefersReduced ? { opacity: 0 } : { rotate: -45, opacity: 0 }}
                transition={{ duration: 0.18, ease: EASE }}
                className="flex items-center justify-center"
              >
                <Menu aria-hidden="true" className="h-5 w-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>

      {/* ── Mobile dropdown panel — full-width sheet below bar ───────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={radialMenuRef}
            id={MOBILE_MENU_ID}
            role="menu"
            aria-label="Site navigation"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -6, transition: { duration: 0.18, ease: EASE } }}
            transition={prefersReduced ? { duration: 0 } : { duration: 0.22, ease: EASE }}
            className={cn(
              "md:hidden border-b border-deep-sea/10",
              "bg-sand/97 backdrop-blur-md",
              // Extra horizontal padding keeps the goo blur from clipping at edges
              "px-6 py-5",
            )}
          >
            {/* Gooey SVG filter — decorative, aria-hidden, rendered once inside panel */}
            <GooeyFilter id="nav-goo" strength={8} />

            {/* Item container — goo filter applied only while animating */}
            <div
              className="flex flex-col gap-2"
              style={
                gooActive && !prefersReduced
                  ? { filter: "url(#nav-goo)" }
                  : undefined
              }
            >
              {NAV_LINKS.map(({ label, href }, i) => {
                const id = href.replace("#", "") as SectionId
                return (
                  <MobileNavItem
                    key={href}
                    label={label}
                    isActive={activeSection === id}
                    index={i}
                    prefersReduced={prefersReduced}
                    onClick={() => handleLinkClick(href)}
                  />
                )
              })}

              {/* Download CV — primary rectangular item (pre-filled bg-sea) */}
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8, transition: { duration: 0.12, ease: EASE } }}
                transition={prefersReduced ? { duration: 0 } : { duration: 0.22, delay: NAV_LINKS.length * 0.055, ease: EASE }}
              >
                <a
                  href="/Saptansu-Neogi-CV.pdf"
                  download
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "group relative flex w-full min-h-[48px] items-center justify-between overflow-hidden",
                    "rounded-lg px-5 py-3.5",
                    "bg-sea text-linen border-[1.5px] border-transparent",
                    "transition-colors duration-200 active:bg-sea-deep",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea focus-visible:ring-offset-2 focus-visible:ring-offset-sand",
                  )}
                >
                  <span className="relative z-10 text-sm font-semibold">Download CV</span>
                  <Download aria-hidden="true" className="relative z-10 h-4 w-4 shrink-0 stroke-linen" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  )
}
