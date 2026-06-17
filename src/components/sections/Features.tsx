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
              className="group relative p-6 md:p-8 rounded-2xl glass-card cursor-default overflow-hidden hover:border-lavender-300 transition-colors"
            >
              <motion.div
                className="relative w-12 h-12 rounded-xl bg-lavender-100 flex items-center justify-center mb-5 group-hover:bg-lavender-200 transition-colors duration-300"
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="w-6 h-6 text-lavender-400 group-hover:text-lavender-500 transition-colors duration-300" strokeWidth={1.75} />
              </motion.div>

              <h3 className="relative text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="relative text-sm text-muted leading-relaxed">{feature.description}</p>
            </motion.article>
          ))}

          {/* Highlight card spanning full width on mobile, 2 cols on lg */}
          <motion.article
            variants={item}
            whileHover={{ y: -6 }}
            className="sm:col-span-2 lg:col-span-1 group relative p-6 md:p-8 rounded-2xl bg-lavender-400 text-white overflow-hidden"
          >
            <p className="text-lavender-100 text-sm font-medium mb-2">Trusted by thousands</p>
            <p className="font-heading text-2xl leading-snug">
              Join 2,000+ customers who never worry about laundry again.
            </p>
          </motion.article>
        </motion.div>
      </div>
    </section>
  )
}
