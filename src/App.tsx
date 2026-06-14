import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { Features } from './components/sections/Features'
import { HowItWorks } from './components/sections/HowItWorks'
import { Services } from './components/sections/Services'
import { Pricing } from './components/sections/Pricing'
import { Trust } from './components/sections/Trust'
import { MobileApp } from './components/sections/MobileApp'
import { FAQ } from './components/sections/FAQ'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Services />
        <Pricing />
        <Trust />
        <MobileApp />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}

export default App
