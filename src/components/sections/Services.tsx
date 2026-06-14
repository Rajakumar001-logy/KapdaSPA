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

export function Services() {
  return (
    <section id="services" className="section-padding bg-surface-muted">
      <div className="container-narrow">
        <SectionHeader
          label="Our Services"
          title="Care for every garment"
          description="From daily wear to designer pieces — choose the service that fits your wardrobe."
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
              className="group relative p-6 rounded-2xl glass-card flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-lavender-100 dark:bg-lavender-900/40 flex items-center justify-center group-hover:bg-lavender-500 transition-colors duration-300">
                  <service.icon className="w-5 h-5 text-lavender-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-lavender-300 group-hover:text-lavender-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed flex-1">{service.description}</p>
              <p className="mt-4 text-sm font-semibold text-lavender-600 dark:text-lavender-400">
                {service.price}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
