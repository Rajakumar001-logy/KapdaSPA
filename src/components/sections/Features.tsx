import { motion } from 'framer-motion'
import {
  Truck,
  Sparkles,
  Zap,
  BadgeIndianRupee,
  Leaf,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Truck,
    title: 'Doorstep Pickup',
    description: 'Schedule a pickup from home or office — we handle the rest, on your schedule.',
  },
  {
    icon: Sparkles,
    title: 'Premium Cleaning',
    description: 'Expert care for every fabric with professional-grade detergents and techniques.',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: 'Same-day and next-day options so your wardrobe is never out of rotation.',
  },
  {
    icon: BadgeIndianRupee,
    title: 'Affordable Pricing',
    description: 'Transparent plans with no hidden fees. Premium quality that fits your budget.',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Process',
    description: 'Biodegradable detergents and water-efficient machines for a greener clean.',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export function Features() {
  return (
    <section id="features" className="section-padding bg-surface-muted">
      <div className="container-narrow">
        <SectionHeader
          label="Why KapdaSPA"
          title="Everything you need for spotless clothes"
          description="We combine premium care with modern convenience — so laundry never slows you down."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              variants={item}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group relative p-6 md:p-8 rounded-2xl glass-card cursor-default overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-lavender-100/0 to-lavender-200/0 group-hover:from-lavender-100/40 group-hover:to-lavender-200/20 dark:group-hover:from-lavender-900/20 dark:group-hover:to-lavender-800/10 transition-all duration-500 rounded-2xl" />

              <motion.div
                className="relative w-12 h-12 rounded-xl bg-lavender-100 dark:bg-lavender-900/40 flex items-center justify-center mb-5 group-hover:bg-lavender-500 transition-colors duration-300"
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="w-6 h-6 text-lavender-600 group-hover:text-white transition-colors duration-300" />
              </motion.div>

              <h3 className="relative text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="relative text-sm text-muted leading-relaxed">{feature.description}</p>
            </motion.article>
          ))}

          {/* Highlight card spanning full width on mobile, 2 cols on lg */}
          <motion.article
            variants={item}
            whileHover={{ y: -6 }}
            className="sm:col-span-2 lg:col-span-1 group relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-lavender-500 to-lavender-600 text-white overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <p className="text-lavender-100 text-sm font-medium mb-2">Trusted by thousands</p>
            <p className="font-serif text-2xl leading-snug">
              Join 2,000+ customers who never worry about laundry again.
            </p>
          </motion.article>
        </motion.div>
      </div>
    </section>
  )
}
