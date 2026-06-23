import { useEffect } from "react"

import { Navbar } from "@/components/ui/navbar"
import { Hero } from "@/components/ui/hero"
import { About } from "@/components/sections/about"
import { Experience } from "@/components/sections/experience"
import { Projects } from "@/components/sections/projects"
import { Now } from "@/components/sections/now"
import { Contact } from "@/components/sections/contact"
import { ProjectDetail } from "@/components/sections/project-detail"
import { useProjectRoute } from "@/lib/use-hash-route"

export default function App() {
  const slug = useProjectRoute()

  // Returning from a project page to "#projects" scrolls the section into view.
  useEffect(() => {
    if (slug === null && window.location.hash === "#projects") {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const id = window.setTimeout(() => {
        document
          .getElementById("projects")
          ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
      }, 50)
      return () => window.clearTimeout(id)
    }
  }, [slug])

  if (slug) {
    return <ProjectDetail slug={slug} />
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Now />
        <Contact />
      </main>
    </>
  )
}
