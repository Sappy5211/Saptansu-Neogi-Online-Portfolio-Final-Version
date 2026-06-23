import { useEffect, useState } from "react"

const VALID_SLUGS = ["voltagrid", "aquaserve", "water"] as const
type ProjectSlug = (typeof VALID_SLUGS)[number]

function parseHash(hash: string): string | null {
  const match = hash.match(/^#\/project\/(.+)$/)
  if (!match) return null
  const slug = match[1]
  return (VALID_SLUGS as readonly string[]).includes(slug) ? slug : null
}

/**
 * Reads the hash portion of the URL and returns the project slug if it matches
 * `#/project/<slug>` (where slug is one of voltagrid | aquaserve | water),
 * otherwise null. Subscribes to `hashchange` so the returned value is reactive.
 * SSR-safe: guards `typeof window`.
 */
export function useProjectRoute(): ProjectSlug | null {
  const [slug, setSlug] = useState<ProjectSlug | null>(() => {
    if (typeof window === "undefined") return null
    return parseHash(window.location.hash) as ProjectSlug | null
  })

  useEffect(() => {
    function handleHashChange() {
      setSlug(parseHash(window.location.hash) as ProjectSlug | null)
    }

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  return slug
}
