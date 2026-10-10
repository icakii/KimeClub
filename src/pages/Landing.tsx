import { useClub } from '../hooks/useClub'
import { Nav } from '../components/landing/Nav'
import { Hero } from '../components/landing/Hero'
import { FeatureCards } from '../components/landing/FeatureCards'
import { AppShowcase } from '../components/landing/AppShowcase'
import { CompetitionsShowcase } from '../components/landing/CompetitionsShowcase'
import { Schedule } from '../components/landing/Schedule'
import { BeltLadder } from '../components/landing/BeltLadder'
import { Coaches } from '../components/landing/Coaches'
import { ManagedService } from '../components/landing/ManagedService'
import { Contact } from '../components/landing/Contact'
import { Footer } from '../components/landing/Footer'

export function Landing() {
  const { data: club, isLoading, isError } = useClub()

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-muted">...</div>
  }

  if (isError || !club) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center text-muted">
        Could not load this club's site. Check that a club_domains row exists for this hostname.
      </div>
    )
  }

  return (
    <div>
      <Nav />
      <Hero />
      <FeatureCards />
      <AppShowcase />
      <CompetitionsShowcase />
      <Schedule clubId={club.id} />
      <BeltLadder clubId={club.id} />
      <Coaches coaches={club.theme.coaches} />
      <ManagedService />
      <Contact />
      <Footer clubName={club.name} />
    </div>
  )
}
