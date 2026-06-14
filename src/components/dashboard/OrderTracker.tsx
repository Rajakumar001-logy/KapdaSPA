import { motion } from 'framer-motion'
import { Check, MapPin, Package, Sparkles, Truck, Clock } from 'lucide-react'
import type { OrderStatus } from '../../types/database'
import { STATUS_LABELS, STATUS_STEPS } from '../../types/database'

const STEP_ICONS: Record<OrderStatus, typeof MapPin> = {
  scheduled: Clock,
  picked_up: MapPin,
  cleaning: Sparkles,
  ready: Package,
  out_for_delivery: Truck,
  delivered: Check,
  cancelled: Clock,
}

interface OrderTrackerProps {
  status: OrderStatus
  compact?: boolean
}

export function OrderTracker({ status, compact = false }: OrderTrackerProps) {
  const isCancelled = status === 'cancelled'
  const currentIndex = isCancelled ? -1 : STATUS_STEPS.indexOf(status)

  const steps = STATUS_STEPS.map((step) => ({
    key: step,
    label: STATUS_LABELS[step],
    icon: STEP_ICONS[step],
    done: !isCancelled && STATUS_STEPS.indexOf(step) <= currentIndex,
    active: !isCancelled && step === status,
  }))

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {steps.map((step, i) => (
          <div key={step.key} className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full ${
                step.done ? 'bg-lavender-500' : step.active ? 'bg-lavender-400 ring-2 ring-lavender-300' : 'bg-lavender-200 dark:bg-lavender-800'
              }`}
            />
            {i < steps.length - 1 && (
              <div className={`w-4 h-0.5 ${step.done ? 'bg-lavender-500' : 'bg-lavender-200 dark:bg-lavender-800'}`} />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="relative">
      {isCancelled && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium">
          This order has been cancelled.
        </div>
      )}

      <div className="space-y-0">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isLast = index === steps.length - 1

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    step.done
                      ? 'bg-lavender-500 text-white'
                      : step.active
                        ? 'bg-lavender-200 dark:bg-lavender-800 text-lavender-600 ring-2 ring-lavender-400'
                        : 'bg-lavender-100 dark:bg-lavender-900/40 text-lavender-400'
                  }`}
                >
                  {step.done ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 min-h-[32px] my-1 ${
                      step.done && steps[index + 1]?.done ? 'bg-lavender-500' : 'bg-lavender-200 dark:bg-lavender-800'
                    }`}
                  />
                )}
              </div>
              <div className={`pb-8 ${isLast ? 'pb-0' : ''}`}>
                <p
                  className={`font-medium ${
                    step.active || step.done ? 'text-foreground' : 'text-muted'
                  }`}
                >
                  {step.label}
                </p>
                {step.active && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-lavender-600 dark:text-lavender-400 mt-0.5"
                  >
                    In progress
                  </motion.p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
