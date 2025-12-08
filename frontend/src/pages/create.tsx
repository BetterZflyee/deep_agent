import HeroBanner from '../components/create/HeroBanner'
import AgentPosterGrid from '../components/create/AgentPosterGrid'
import Highlights from '../components/create/Highlights'
import HowItWorks from '../components/create/HowItWorks'
import CTASection from '../components/create/CTASection'
import Header from '../components/common/Header'

export default function CreatePage() {
  return (
    <div>
      <Header />
      <HeroBanner />
      <main>
        <AgentPosterGrid />
        <Highlights />
        <HowItWorks />
        <CTASection />
      </main>
    </div>
  )
}
