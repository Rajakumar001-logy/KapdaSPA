import { motion } from 'framer-motion'
import { Bell, MapPin, CreditCard } from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'
import { PhoneMockup } from '../ui/PhoneMockup'

const appFeatures = [
  { icon: MapPin, title: 'One-Tap Booking', description: 'Schedule pickups in seconds with saved addresses.' },
  { icon: Bell, title: 'Live Tracking', description: 'Real-time updates from pickup to delivery.' },
  { icon: CreditCard, title: 'Secure Payments', description: 'Pay via UPI, cards, or wallet — all in-app.' },
]

export function MobileApp() {
  return (
    <section id="app" className="section-padding bg-surface-muted relative overflow-hidden">
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
              description="Our app is launching soon on Google Play and the Apple App Store."
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
                  className="flex gap-4 p-4 rounded-xl hover:bg-white/60 dark:hover:bg-white/5 transition-colors"
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

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl glass-card text-sm">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-lavender-600" fill="currentColor" aria-hidden="true">
                  <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5ZM16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12ZM20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81ZM6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" />
                </svg>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted">Coming soon on</p>
                  <p className="font-semibold text-foreground">Google Play</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl glass-card text-sm">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-lavender-600" fill="currentColor" aria-hidden="true">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 21.95 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                </svg>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted">Coming soon on</p>
                  <p className="font-semibold text-foreground">App Store</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
