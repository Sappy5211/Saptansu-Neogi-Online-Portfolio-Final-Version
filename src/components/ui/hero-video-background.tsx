import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

interface HeroVideoBackgroundProps {
  src?: string
  poster?: string
  className?: string
}

/**
 * Full-bleed looping background video with a deep-sea contrast scrim.
 * Under reduced-motion, small screens, or data-saver the video is left paused
 * and the static poster frame is shown instead.
 */
export function HeroVideoBackground({
  src = "/hero-coastal.mp4",
  poster = "/hero-coastal-poster.jpg",
  className,
}: HeroVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const small = window.matchMedia("(max-width: 767px)")
    const decide = () => {
      const saveData =
        (navigator as Navigator & { connection?: { saveData?: boolean } })
          .connection?.saveData ?? false
      setPlay(!reduce.matches && !small.matches && !saveData)
    }
    decide()
    reduce.addEventListener("change", decide)
    small.addEventListener("change", decide)
    return () => {
      reduce.removeEventListener("change", decide)
      small.removeEventListener("change", decide)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (play) {
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [play])

  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 overflow-hidden bg-deep-sea", className)}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster={poster}
        muted
        loop
        playsInline
        preload={play ? "metadata" : "none"}
        tabIndex={-1}
        disablePictureInPicture
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Contrast scrim — keeps light hero text AA-legible over the bright water. */}
      <div className="absolute inset-0 bg-deep-sea/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-deep-sea/80 via-deep-sea/35 to-deep-sea/50" />
    </div>
  )
}
