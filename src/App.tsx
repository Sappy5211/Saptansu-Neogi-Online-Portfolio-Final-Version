import { Navbar } from "@/components/ui/navbar"
import { Hero } from "@/components/ui/hero"
import { About } from "@/components/sections/about"
import { Experience } from "@/components/sections/experience"
import { Projects } from "@/components/sections/projects"
import { Now } from "@/components/sections/now"
import { Contact } from "@/components/sections/contact"

export default function App() {
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
