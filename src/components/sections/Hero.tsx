import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'
import { WashingMachine, BubbleField, WaterWaves } from '../ui/WashingMachine'

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-lavender-50 via-white to-lavender-50/50 dark:from-surface dark:via-surface-muted dark:to-surface"
    >
      {/* Background orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-lavender-300/20 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-lavender-400/15 rounded-full blur-3xl" aria-hidden="true" />

      <BubbleField />
      <WaterWaves />

      <div className="container-narrow section-padding relative z-10 w-full pt-28 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm text-lavender-700 dark:text-lavender-300"
            >
              <Sparkles className="w-4 h-4 text-lavender-500" />
              Premium laundry, delivered to your door
            </motion.div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.08] tracking-tight">
              Laundry Made{' '}
              <span className="text-gradient italic">Effortless</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted max-w-lg leading-relaxed">
              Professional washing, dry cleaning, ironing, and doorstep pickup &amp; delivery.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button href="#pricing">
                Book Pickup
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button href="#pricing" variant="secondary">
                View Pricing
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-8">
              {[
                { value: '10K+', label: 'Items cleaned' },
                { value: '98%', label: 'Satisfaction' },
                { value: '24h', label: 'Turnaround' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="animate-float">
              <WashingMachine />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
