import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { LiveMatches } from "@/components/live-matches"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HeroSection />
        <LiveMatches />
      </main>
    </div>
  )
}

