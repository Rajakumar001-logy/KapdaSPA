import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/sections/Hero'
import { Features } from '../components/sections/Features'
import { HowItWorks } from '../components/sections/HowItWorks'
import { Services } from '../components/sections/Services'
import { Trust } from '../components/sections/Trust'
import { FAQ } from '../components/sections/FAQ'
import { ServiceAreas } from '../components/sections/ServiceAreas'

export function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Services />
        <Trust />
        <FAQ />
        <ServiceAreas />
      </main>
      <Footer />
    </>
  )
}
