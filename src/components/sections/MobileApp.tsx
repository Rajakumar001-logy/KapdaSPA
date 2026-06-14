import { motion } from 'framer-motion'
import { Smartphone, Bell, MapPin, CreditCard, Download } from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'
import { PhoneMockup } from '../ui/PhoneMockup'
import { Button } from '../ui/Button'

const appFeatures = [
  { icon: MapPin, title: 'One-Tap Booking', description: 'Schedule pickups in seconds with saved addresses.' },
  { icon: Bell, title: 'Live Tracking', description: 'Real-time updates from pickup to delivery.' },
  { icon: CreditCard, title: 'Secure Payments', description: 'Pay via UPI, cards, or wallet — all in-app.' },
]

export function MobileApp() {
  return (
    <section id="app" className="section-padding bg-surface relative overflow-hidden">
      <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-96 h-96 bg-lavender-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container-narrow relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 flex justify-center">
            <PhoneMockup />
          </div>

          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SectionHeader
              label="Mobile App"
              title="Laundry in your pocket"
              description="Book, track, and pay — everything you need in one beautifully designed app."
              align="left"
            />

            <div className="space-y-5 -mt-6">
              {appFeatures.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl hover:bg-lavender-50/80 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-lavender-100 dark:bg-lavender-900/40 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-lavender-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted mt-0.5">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button className="gap-2">
                <Download className="w-4 h-4" />
                Download App
              </Button>
              <Button variant="secondary" className="gap-2">
                <Smartphone className="w-4 h-4" />
                Get App Link
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
