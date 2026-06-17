import { motion } from 'framer-motion'
import {
  Layers,
  Shirt,
  Wind,
  Footprints,
  BedDouble,
  Gem,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'

const services: { icon: LucideIcon; title: string; description: string; price: string }[] = [
  {
    icon: Layers,
    title: 'Wash & Fold',
    description: 'Everyday laundry washed, dried, and neatly folded.',
    price: 'From ₹49/kg',
  },
  {
    icon: Shirt,
    title: 'Wash & Iron',
    description: 'Crisp, wrinkle-free clothes ready to wear.',
    price: 'From ₹79/kg',
  },
  {
    icon: Wind,
    title: 'Dry Cleaning',
    description: 'Delicate fabrics and formal wear expertly cleaned.',
    price: 'From ₹149/piece',
  },
  {
    icon: Footprints,
    title: 'Shoe Cleaning',
    description: 'Restore sneakers and leather shoes to like-new condition.',
    price: 'From ₹199/pair',
  },
  {
    icon: BedDouble,
    title: 'Blanket Cleaning',
    description: 'Deep clean for comforters, duvets, and heavy linens.',
    price: 'From ₹399/piece',
  },
  {
    icon: Gem,
    title: 'Premium Garment Care',
    description: 'Designer labels and luxury fabrics with white-glove treatment.',
    price: 'Custom quote',
  },
]

function ServicesCurveTop() {
  return (
    <svg
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className="block w-full h-16 sm:h-20 md:h-24"
      aria-hidden="true"
    >
      <path
        fill="#0a0a0a"
        d="M0,6 Q720,94 1440,6 V100 H0 Z"
      />
    </svg>
  )
}

function ServicesCurveBottom() {
  return (
    <svg
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className="block w-full h-16 sm:h-20 md:h-24"
      aria-hidden="true"
    >
      <path
        fill="#0a0a0a"
        d="M0,0 H1440 V94 Q720,6 0,94 Z"
      />
    </svg>
  )
}

export function Services() {
  return (
    <section id="services" className="relative">
      {/* Curved out — top */}
      <div className="leading-[0] bg-surface">
        <ServicesCurveTop />
      </div>

      <div className="bg-[#0a0a0a] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
          <div className="max-w-6xl mx-auto w-full">
            <SectionHeader
              label="Our Services"
              title="Care for every garment"
              description="From daily wear to designer pieces — choose the service that fits your wardrobe."
              variant="dark"
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service, index) => (
                <motion.article
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col hover:border-lavender-400/40 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-lavender-400/15 flex items-center justify-center group-hover:bg-lavender-400/25 transition-colors duration-300">
                      <service.icon className="w-5 h-5 text-lavender-300" strokeWidth={1.75} />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-lavender-400/60 group-hover:text-lavender-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                  <p className="mt-2 text-sm text-white/80 leading-relaxed flex-1">{service.description}</p>
                  <p className="mt-4 text-sm font-semibold text-lavender-300">{service.price}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Curved in — bottom */}
      <div className="leading-[0] bg-surface-muted">
        <ServicesCurveBottom />
      </div>
    </section>
  )
}
