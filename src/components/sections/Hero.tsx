import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'
import { WashingMachine } from '../ui/WashingMachine'
import { useAuth } from '../../context/AuthContext'
import { contactConfig } from '../../config/contact'

export function Hero() {
  const { user } = useAuth()
  const bookLink = user ? '/dashboard/book' : '/register'

  return (
    <section id="hero" className="relative bg-surface border-b border-border">
      <div className="container-narrow section-padding relative w-full pt-24 sm:pt-28 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-lavender-50 mb-5 text-sm font-medium text-lavender-600 border border-lavender-200">
              <Sparkles className="w-4 h-4 text-lavender-400" />
              {contactConfig.tagline}
            </p>

            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-foreground leading-[1.1] tracking-tight">
              Laundry Made{' '}
              <span className="text-lavender-400">Effortless</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted max-w-lg leading-relaxed">
              Professional washing, dry cleaning, ironing, and doorstep pickup &amp; delivery.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button to={bookLink}>
                Book Pickup
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="#services" variant="secondary">
                View Services
              </Button>
            </div>

            <div className="mt-10 pt-8 border-t border-border grid grid-cols-3 gap-4 max-w-md">
              {[
                { value: '10K+', label: 'Items cleaned' },
                { value: '98%', label: 'Satisfaction' },
                { value: '24h', label: 'Turnaround' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <WashingMachine />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
