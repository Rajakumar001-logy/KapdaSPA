import { motion } from 'framer-motion'
import { CalendarClock, Shirt, PackageCheck } from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'

const steps = [
  {
    icon: CalendarClock,
    step: '01',
    title: 'Schedule Pickup',
    description: 'Pick a time slot via our app or website. We collect from your doorstep — no trips needed.',
  },
  {
    icon: Shirt,
    step: '02',
    title: 'We Clean Your Clothes',
    description: 'Our experts sort, wash, dry clean, and iron with premium care tailored to each garment.',
  },
  {
    icon: PackageCheck,
    step: '03',
    title: 'We Deliver Fresh',
    description: 'Crisp, folded, and ready to wear — delivered back to your door on schedule.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-surface relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-lavender-100/40 via-transparent to-transparent dark:from-lavender-900/20 pointer-events-none" />

      <div className="container-narrow relative">
        <SectionHeader
          label="How It Works"
          title="Three steps to fresh laundry"
          description="From pickup to delivery, we've designed every touchpoint to be effortless."
        />

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-lavender-200 via-lavender-400 to-lavender-200 dark:from-lavender-800 dark:via-lavender-600 dark:to-lavender-800" />

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative md:grid md:grid-cols-2 md:gap-12 md:items-center md:py-10 ${
                    isEven ? '' : 'md:[&>div:first-child]:order-2'
                  }`}
                >
                  {/* Content */}
                  <div className={`${isEven ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <span className="text-xs font-bold tracking-widest text-lavender-500 uppercase">
                      Step {step.step}
                    </span>
                    <h3 className="mt-2 font-serif text-2xl md:text-3xl text-foreground">{step.title}</h3>
                    <p className="mt-3 text-muted leading-relaxed max-w-sm md:ml-auto md:mr-0 mx-auto">
                      {step.description}
                    </p>
                  </div>

                  {/* Icon node */}
                  <div className={`flex ${isEven ? 'md:justify-start' : 'md:justify-end'} justify-center mt-6 md:mt-0`}>
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className="hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-lavender-500 border-4 border-surface shadow-glow z-10 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:-left-[calc(50%+1.5rem)]" />
                      <div className="w-20 h-20 rounded-2xl glass-card flex items-center justify-center shadow-glow">
                        <step.icon className="w-9 h-9 text-lavender-500" />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
