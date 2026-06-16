import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Check, CheckCircle2, Copy, Download, Send } from "lucide-react"

import { cn } from "@/lib/utils"
import { Reveal } from "@/components/ui/reveal"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"

// TODO: replace with real email before launch
const EMAIL = "saptansu.neogi@example.com"

const LINKEDIN_URL = "https://www.linkedin.com/in/saptansu-neogi/"
const CV_PATH = "/Saptansu-Neogi-CV.pdf"

/** Heading ID used by aria-labelledby on the Section */
const HEADING_ID = "contact-heading"

const MAX_MESSAGE_LENGTH = 1000

// ---------------------------------------------------------------------------
// AuroraBackground — 3 slowly drifting soft radial gradients
// ---------------------------------------------------------------------------

/**
 * Absolutely-positioned decorative layer behind the contact content.
 * Three large radial gradients (sea / sky-mist / golden-hour) at low
 * alpha (0.10-0.18) drift independently on slow loops (16-24 s).
 * Under prefers-reduced-motion the gradients are static (no drift).
 * pointer-events-none so it never blocks interaction.
 */
function AuroraBackground() {
  const reduce = useReducedMotion()

  const drift1 = reduce
    ? {}
    : {
        animate: {
          x: [0, 38, 12, -28, 0],
          y: [0, -22, 32, 8, 0],
        },
        transition: {
          duration: 22,
          ease: "easeInOut" as const,
          repeat: Infinity,
          repeatType: "loop" as const,
        },
      }

  const drift2 = reduce
    ? {}
    : {
        animate: {
          x: [0, -30, 18, 44, 0],
          y: [0, 28, -18, -36, 0],
        },
        transition: {
          duration: 18,
          ease: "easeInOut" as const,
          repeat: Infinity,
          repeatType: "loop" as const,
          delay: 3,
        },
      }

  const drift3 = reduce
    ? {}
    : {
        animate: {
          x: [0, 22, -42, 14, 0],
          y: [0, -40, 10, 30, 0],
        },
        transition: {
          duration: 26,
          ease: "easeInOut" as const,
          repeat: Infinity,
          repeatType: "loop" as const,
          delay: 7,
        },
      }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Blob 1 — sea (#2b7a8c) at ~0.14 alpha, top-left */}
      <motion.div
        className="absolute -left-32 -top-20 h-[560px] w-[560px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(43,122,140,0.14) 0%, transparent 70%)",
          willChange: reduce ? undefined : "transform",
        }}
        {...drift1}
      />

      {/* Blob 2 — sky-mist (#bfe0e8) at ~0.10 alpha, bottom-right */}
      <motion.div
        className="absolute -bottom-24 -right-28 h-[640px] w-[640px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(191,224,232,0.10) 0%, transparent 68%)",
          willChange: reduce ? undefined : "transform",
        }}
        {...drift2}
      />

      {/* Blob 3 — golden-hour (#d9a441) at ~0.10 alpha, centre-right */}
      <motion.div
        className="absolute right-[10%] top-1/3 h-[400px] w-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(217,164,65,0.10) 0%, transparent 65%)",
          willChange: reduce ? undefined : "transform",
        }}
        {...drift3}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// LinkedInIcon — official mark, inherits text colour
// ---------------------------------------------------------------------------

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// ShineWrapper — diagonal light sweep on hover
// ---------------------------------------------------------------------------

interface ShineWrapperProps {
  children: React.ReactNode
  reduce: boolean
  roundedClass?: string
}

function ShineWrapper({ children, reduce, roundedClass = "rounded-full" }: ShineWrapperProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <span
      className={cn("relative inline-flex overflow-hidden", roundedClass)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {children}

      {!reduce && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
            translateX: "-100%",
          }}
          animate={
            hovered
              ? { translateX: "160%", opacity: [0, 1, 1, 0] }
              : { translateX: "-100%", opacity: 0 }
          }
          transition={{
            duration: 0.52,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      )}
    </span>
  )
}

// ---------------------------------------------------------------------------
// CopyEmailButton — fallback shown on error state
// ---------------------------------------------------------------------------

function CopyEmailButton() {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  function handleCopy() {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true)
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        setCopied(false)
        timerRef.current = null
      }, 2000)
    })
  }

  return (
    <ShineWrapper reduce={!!reduce} roundedClass="rounded-full">
      <Button
        variant="default"
        size="sm"
        onClick={handleCopy}
        aria-live="polite"
        aria-label={copied ? "Email address copied to clipboard" : "Copy email address"}
        className={cn(
          "focus-visible:ring-sky-mist focus-visible:ring-offset-deep-sea",
          "gap-2",
          "relative overflow-hidden",
        )}
      >
        {copied ? (
          <>
            <Check aria-hidden="true" />
            Copied
          </>
        ) : (
          <>
            <Copy aria-hidden="true" />
            Copy email
          </>
        )}
      </Button>
    </ShineWrapper>
  )
}

// ---------------------------------------------------------------------------
// Form state
// ---------------------------------------------------------------------------

type FormStatus = "idle" | "sending" | "sent" | "error"

interface FormFields {
  name: string
  email: string
  message: string
  /** Honeypot — must remain empty */
  _honey: string
}

interface FormErrors {
  email?: string
  message?: string
}

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {}

  if (!fields.email.trim()) {
    errors.email = "Email is required so I can reply."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = "Please enter a valid email address."
  }

  if (!fields.message.trim()) {
    errors.message = "Message cannot be empty."
  } else if (fields.message.trim().length < 3) {
    errors.message = "Message must be at least 3 characters."
  }

  return errors
}

// ---------------------------------------------------------------------------
// MessageComposer — the chat-style card form (centred, full-width card)
// ---------------------------------------------------------------------------

function MessageComposer() {
  const reduce = useReducedMotion()

  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    message: "",
    _honey: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<{ email?: boolean; message?: boolean }>({})
  const [status, setStatus] = useState<FormStatus>("idle")
  const [serverError, setServerError] = useState<string>("")

  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  // Derive live errors for touched fields only
  const liveErrors: FormErrors = {}
  if (touched.email) liveErrors.email = validate(fields).email
  if (touched.message) liveErrors.message = validate(fields).message

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    // Clear any stale submit-time error for this field as the user edits it,
    // so the message disappears once the field is corrected.
    if (name === "email" || name === "message") {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name } = e.target
    if (name === "email" || name === "message") {
      setTouched((prev) => ({ ...prev, [name]: true }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Touch all validated fields
    setTouched({ email: true, message: true })

    const validationErrors = validate(fields)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      // Focus first invalid field
      if (validationErrors.email) {
        emailRef.current?.focus()
      } else if (validationErrors.message) {
        messageRef.current?.focus()
      }
      return
    }

    // Bot trap — honeypot populated means a bot; silently succeed
    if (fields._honey) {
      setStatus("sent")
      return
    }

    setStatus("sending")
    setServerError("")

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: fields.name.trim() || "Anonymous",
          email: fields.email.trim(),
          message: fields.message.trim(),
          _subject: "New message from your portfolio",
          _template: "table",
          _honey: fields._honey,
        }),
      })

      const data = (await res.json()) as { success: string | boolean; message?: string }

      if (data.success === "true" || data.success === true) {
        setStatus("sent")
      } else {
        throw new Error(data.message ?? "Submission failed.")
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong."
      setServerError(msg)
      setStatus("error")
    }
  }

  function handleReset() {
    setFields({ name: "", email: "", message: "", _honey: "" })
    setErrors({})
    setTouched({})
    setStatus("idle")
    setServerError("")
  }

  const isDisabled = status === "sending"
  const charCount = fields.message.length
  const charOver = charCount > MAX_MESSAGE_LENGTH

  // ---------------------------------------------------------------------------
  // Sent state
  // ---------------------------------------------------------------------------

  if (status === "sent") {
    return (
      <motion.div
        ref={statusRef}
        role="status"
        aria-live="polite"
        className={cn(
          "w-full rounded-2xl border border-linen/15 bg-linen/5 backdrop-blur-sm",
          "px-6 py-10 sm:px-10",
          "flex flex-col items-center gap-5 text-center",
        )}
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sea/20">
          <CheckCircle2 className="size-6 text-sky-mist" aria-hidden="true" />
        </span>

        <div className="space-y-1.5">
          <p className="text-base font-medium text-linen">
            Thanks{fields.name.trim() ? `, ${fields.name.trim()}` : ""}. Your message is on its way.
          </p>
          <p className="text-sm text-linen/65">
            I will reply to{" "}
            <span className="font-mono text-sky-mist break-words">{fields.email.trim()}</span>{" "}
            soon.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className={cn(
            "mt-1 text-xs font-medium text-sky-mist/70 underline-offset-2",
            "hover:text-sky-mist transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-sky-mist focus-visible:ring-offset-2 focus-visible:ring-offset-deep-sea",
            "rounded",
          )}
        >
          Send another message
        </button>
      </motion.div>
    )
  }

  // ---------------------------------------------------------------------------
  // Composer form (idle / sending / error)
  // ---------------------------------------------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Send a message"
      className={cn(
        "w-full rounded-2xl border border-linen/15 bg-linen/5 backdrop-blur-sm",
        "px-6 py-8 sm:px-10 sm:py-10",
      )}
    >
      {/* Honeypot — invisible to real users, attracts bots */}
      <input
        type="text"
        name="_honey"
        value={fields._honey}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0"
      />

      <div className="space-y-5">
        {/* Name (optional) */}
        <div>
          <label
            htmlFor="composer-name"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-linen/55"
          >
            Name <span className="normal-case tracking-normal text-linen/35">(optional)</span>
          </label>
          <input
            id="composer-name"
            name="name"
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={handleChange}
            disabled={isDisabled}
            placeholder="Your name"
            className={cn(
              "w-full rounded-xl border border-linen/20 bg-linen/8 px-4 py-3",
              "text-sm text-linen placeholder:text-linen/30",
              "transition-colors duration-200",
              "hover:border-linen/30",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-sky-mist focus-visible:ring-offset-1 focus-visible:ring-offset-deep-sea",
              "focus-visible:border-sky-mist/50",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          />
        </div>

        {/* Email (required) */}
        <div>
          <label
            htmlFor="composer-email"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-linen/55"
          >
            Email <span className="text-golden-hour" aria-hidden="true">*</span>
          </label>
          <input
            ref={emailRef}
            id="composer-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={fields.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isDisabled}
            placeholder="you@example.com"
            aria-required="true"
            aria-invalid={!!liveErrors.email || !!errors.email ? "true" : undefined}
            aria-describedby={
              liveErrors.email || errors.email ? "email-error" : undefined
            }
            className={cn(
              "w-full rounded-xl border bg-linen/8 px-4 py-3",
              "text-sm text-linen placeholder:text-linen/30",
              "transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-sky-mist focus-visible:ring-offset-1 focus-visible:ring-offset-deep-sea",
              "focus-visible:border-sky-mist/50",
              "disabled:cursor-not-allowed disabled:opacity-50",
              liveErrors.email || errors.email
                ? "border-golden-hour/60 hover:border-golden-hour/80"
                : "border-linen/20 hover:border-linen/30",
            )}
          />
          {/* Reserve height so layout doesn't shift */}
          <div className="mt-1.5 min-h-[1.1rem]">
            {(liveErrors.email ?? errors.email) && (
              <p
                id="email-error"
                role="alert"
                className="text-xs text-golden-hour/90"
              >
                {liveErrors.email ?? errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Message (required) */}
        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-2">
            <label
              htmlFor="composer-message"
              className="block text-xs font-medium uppercase tracking-[0.18em] text-linen/55"
            >
              Message <span className="text-golden-hour" aria-hidden="true">*</span>
            </label>
          </div>
          <textarea
            ref={messageRef}
            id="composer-message"
            name="message"
            required
            rows={5}
            value={fields.message}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isDisabled}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder="A role, a question, or just a hello. Write away."
            aria-required="true"
            aria-invalid={!!liveErrors.message || !!errors.message ? "true" : undefined}
            aria-describedby={cn(
              "message-char-hint",
              (liveErrors.message ?? errors.message) ? " message-error" : "",
            ).trim()}
            className={cn(
              "w-full resize-none rounded-xl border bg-linen/8 px-4 py-3",
              "text-sm leading-relaxed text-linen placeholder:text-linen/30",
              "transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-sky-mist focus-visible:ring-offset-1 focus-visible:ring-offset-deep-sea",
              "focus-visible:border-sky-mist/50",
              "disabled:cursor-not-allowed disabled:opacity-50",
              liveErrors.message || errors.message
                ? "border-golden-hour/60 hover:border-golden-hour/80"
                : "border-linen/20 hover:border-linen/30",
            )}
          />
          <span id="message-char-hint" className="sr-only">
            Maximum {MAX_MESSAGE_LENGTH} characters.
          </span>
          {/* Reserve height for error */}
          <div className="mt-1.5 min-h-[1.1rem]">
            {(liveErrors.message ?? errors.message) && (
              <p
                id="message-error"
                role="alert"
                className="text-xs text-golden-hour/90"
              >
                {liveErrors.message ?? errors.message}
              </p>
            )}
          </div>
        </div>

        {/* Error state — network / server error with fallback */}
        {status === "error" && (
          <div
            role="alert"
            aria-live="assertive"
            className={cn(
              "rounded-xl border border-golden-hour/25 bg-golden-hour/8 px-4 py-4",
              "space-y-3",
            )}
          >
            <p className="text-sm text-linen/90">
              {serverError
                ? `Hmm, something went wrong: ${serverError}`
                : "Could not send the message. Please try again, or reach me directly."}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <p
                className="font-mono text-sm text-sky-mist break-words select-all"
                aria-label={`Email address: ${EMAIL}`}
              >
                {EMAIL}
              </p>
              <CopyEmailButton />
            </div>
          </div>
        )}

        {/* Submit button — full-width within card for prominence */}
        <div className="pt-2">
          <ShineWrapper
            reduce={!!reduce}
            roundedClass="rounded-full"
          >
            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={isDisabled || charOver}
              aria-disabled={isDisabled || charOver}
              className={cn(
                "w-full",
                "gap-2.5 min-h-[48px]",
                "focus-visible:ring-sky-mist focus-visible:ring-offset-deep-sea",
                "relative overflow-hidden",
              )}
            >
              {status === "sending" ? (
                <>
                  {!reduce && (
                    <motion.span
                      aria-hidden="true"
                      className="inline-block size-4 rounded-full border-2 border-linen/30 border-t-linen"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                  Sending{reduce ? "..." : "…"}
                </>
              ) : (
                <>
                  <Send aria-hidden="true" className="size-4" />
                  Send message
                </>
              )}
            </Button>
          </ShineWrapper>
        </div>
      </div>

      {/* Polite live region for non-error status updates */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {status === "sending" ? "Sending your message, please wait." : ""}
      </div>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Contact section
// ---------------------------------------------------------------------------

export function Contact() {
  const reduce = useReducedMotion()

  return (
    <Section
      id="contact"
      aria-labelledby={HEADING_ID}
      className="relative overflow-hidden bg-deep-sea"
    >
      {/* Aurora glow background — behind all content */}
      <AuroraBackground />

      {/* All content sits above the aurora layer, centred */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* ------------------------------------------------------------------ */}
        {/* Eyebrow + heading + lead — centred                                  */}
        {/* ------------------------------------------------------------------ */}
        <Reveal className="w-full">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-sea">
            Contact
          </p>

          <h2
            id={HEADING_ID}
            className="mt-3 text-3xl font-semibold tracking-tight text-linen sm:text-4xl lg:text-5xl"
          >
            Let&apos;s work together
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-linen/70 sm:text-lg">
            Have a role, a question, or just want to connect? Send me a note.
          </p>

          <p className="mt-2 text-sm font-medium text-sky-mist/90">
            Available from June 2026 for roles across finance, banking, consulting and data.
          </p>
        </Reveal>

        {/* ------------------------------------------------------------------ */}
        {/* Message composer card — centred, max-w-xl                           */}
        {/* ------------------------------------------------------------------ */}
        <Reveal delay={0.07} className="mt-10 w-full max-w-xl">
          <MessageComposer />
        </Reveal>

        {/* ------------------------------------------------------------------ */}
        {/* Secondary connect links — centred row below card                    */}
        {/* ------------------------------------------------------------------ */}
        <Reveal delay={0.14} className="mt-6 w-full">
          <div
            className={cn(
              "flex flex-col items-center gap-3",
              "sm:flex-row sm:flex-wrap sm:justify-center",
            )}
          >
            {/* Copy email */}
            <CopyEmailButton />

            {/* LinkedIn */}
            <ShineWrapper reduce={!!reduce} roundedClass="rounded-full">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit LinkedIn profile (opens in new tab)"
                className={cn(
                  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full",
                  "border border-linen/60 bg-transparent px-6 text-sm font-medium text-linen",
                  "transition-[transform,background-color] duration-300 ease-out",
                  "hover:bg-linen/10 hover:-translate-y-0.5",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-sky-mist focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-deep-sea",
                  "relative overflow-hidden",
                )}
              >
                <LinkedInIcon className="size-4 shrink-0" />
                LinkedIn
              </a>
            </ShineWrapper>

            {/* Download CV */}
            <ShineWrapper reduce={!!reduce} roundedClass="rounded-full">
              <a
                href={CV_PATH}
                download
                aria-label="Download CV as PDF"
                className={cn(
                  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full",
                  "border border-linen/60 bg-transparent px-6 text-sm font-medium text-linen",
                  "transition-[transform,background-color] duration-300 ease-out",
                  "hover:bg-linen/10 hover:-translate-y-0.5",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-sky-mist focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-deep-sea",
                  "relative overflow-hidden",
                )}
              >
                <Download aria-hidden="true" className="size-4 shrink-0" />
                Download CV
              </a>
            </ShineWrapper>
          </div>
        </Reveal>

        {/* ------------------------------------------------------------------ */}
        {/* Minimal footer line                                                 */}
        {/* ------------------------------------------------------------------ */}
        <Reveal delay={0.2} className="w-full">
          <p className="mt-14 text-xs text-linen/35 sm:mt-16">
            Saptansu Neogi &middot; {new Date().getFullYear()} &middot; Built with React
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
