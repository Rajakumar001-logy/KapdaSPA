import { motion } from 'framer-motion'
import { MapPin, Package, Clock } from 'lucide-react'

export function PhoneMockup() {
  return (
    <motion.div
      className="relative mx-auto w-[260px] sm:w-[280px]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute -inset-8 bg-lavender-400/20 rounded-full blur-3xl" />

      {/* Phone frame */}
      <div className="relative rounded-[2.5rem] border-[6px] border-foreground/10 bg-foreground p-2 shadow-2xl dark:border-white/20">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-foreground rounded-full z-10" />

        {/* Screen */}
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-b from-lavender-50 to-white dark:from-lavender-950 dark:to-surface-muted aspect-[9/19]">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-2 text-[10px] font-medium text-foreground/70">
            <span>9:41</span>
            <div className="flex gap-1">
              <span className="w-3 h-2 rounded-sm bg-foreground/30" />
              <span className="w-3 h-2 rounded-sm bg-foreground/30" />
            </div>
          </div>

          {/* App header */}
          <div className="px-5 pt-2 pb-4">
            <p className="text-[10px] text-muted uppercase tracking-wider">KapdaSPA</p>
            <h3 className="text-sm font-bold text-foreground mt-0.5">Track Your Order</h3>
          </div>

          {/* Order card */}
          <motion.div
            className="mx-4 p-3 rounded-2xl glass-card"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-lavender-500 flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-foreground">Order #KS-2847</p>
                <p className="text-[9px] text-muted">Wash & Fold · 12 items</p>
              </div>
            </div>

            {/* Progress steps */}
            <div className="space-y-2">
              {[
                { label: 'Picked Up', done: true, icon: MapPin },
                { label: 'Cleaning', done: true, icon: Package },
                { label: 'Out for Delivery', done: false, active: true, icon: Clock },
              ].map((step) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      step.done
                        ? 'bg-lavender-500'
                        : step.active
                          ? 'bg-lavender-200 ring-2 ring-lavender-400'
                          : 'bg-lavender-100'
                    }`}
                  >
                    <step.icon className={`w-2.5 h-2.5 ${step.done || step.active ? 'text-white' : 'text-lavender-400'}`} />
                  </div>
                  <span
                    className={`text-[10px] ${step.active ? 'font-semibold text-foreground' : 'text-muted'}`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ETA banner */}
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-lavender-500 text-white text-center">
            <p className="text-[9px] opacity-80">Estimated delivery</p>
            <p className="text-xs font-bold">Today, 4:30 PM</p>
          </div>

          {/* Book button */}
          <div className="absolute bottom-6 left-4 right-4">
            <div className="py-2.5 rounded-full bg-foreground text-white text-[11px] font-semibold text-center">
              Book New Pickup
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
