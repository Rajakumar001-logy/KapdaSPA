import { motion } from 'framer-motion'
import { Bell, MapPin, CreditCard } from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'
import { PhoneMockup } from '../ui/PhoneMockup'
import { StoreBadge } from '../ui/StoreBadges'

const appFeatures = [
  { icon: MapPin, title: 'One-Tap Booking', description: 'Schedule pickups in seconds with saved addresses.' },
  { icon: Bell, title: 'Live Tracking', description: 'Real-time updates from pickup to delivery.' },
  { icon: CreditCard, title: 'Secure Payments', description: 'Pay via UPI, cards, or wallet — all in-app.' },
]

export function MobileApp() {
  return (
    <section id="app" className="mt-10 md:mt-14">
      <div className="rounded-3xl border-2 border-pink-200/80 bg-pink-50 p-3 md:p-4 shadow-[0_0_0_1px_rgba(251,207,232,0.9),0_16px_48px_-16px_rgba(244,114,182,0.2)]">
        <div className="rounded-2xl border border-pink-200/60 bg-pink-50/60 p-6 md:p-10 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
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

              <div className="space-y-4 -mt-6">
                {appFeatures.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 p-4 rounded-xl bg-white/70 border border-pink-100 hover:bg-white/90 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-lavender-100 flex items-center justify-center shrink-0">
                      <feature.icon className="w-5 h-5 text-lavender-400" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-foreground font-medium mt-0.5">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <StoreBadge variant="google" theme="light" />
                <StoreBadge variant="apple" theme="light" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
