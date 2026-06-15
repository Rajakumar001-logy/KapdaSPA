import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'
import { Button } from '../ui/Button'

const plans = [
  {
    name: 'Essential',
    price: '₹499',
    period: '/month',
    description: 'Perfect for individuals with light laundry needs.',
    features: ['Up to 8 kg wash & fold', 'Free pickup & delivery', '48-hour turnaround', 'Standard detergent'],
    popular: false,
  },
  {
    name: 'Premium',
    price: '₹899',
    period: '/month',
    description: 'Our most popular plan for busy professionals.',
    features: [
      'Up to 15 kg wash & fold',
      'Free pickup & delivery',
      '24-hour turnaround',
      'Premium eco detergent',
      '2 dry clean items included',
      'Priority support',
    ],
    popular: true,
  },
  {
    name: 'Family',
    price: '₹1,499',
    period: '/month',
    description: 'Complete care for households of four or more.',
    features: [
      'Up to 30 kg wash & fold',
      'Unlimited pickups',
      'Same-day option available',
      'Premium eco detergent',
      '5 dry clean items included',
      'Dedicated account manager',
    ],
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="section-padding bg-surface relative overflow-hidden">
      <div className="container-narrow relative">
        <SectionHeader
          label="Pricing"
          title="Simple, transparent plans"
          description="No surprises. Pick a plan that matches your lifestyle — upgrade or pause anytime."
        />

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: plan.popular ? -8 : -4 }}
              className={`relative flex flex-col p-6 md:p-8 rounded-2xl transition-shadow duration-200 ${
                plan.popular
                  ? 'bg-lavender-400 text-white shadow-glow border-2 border-lavender-400 md:scale-105 z-10'
                  : 'glass-card hover:border-lavender-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-lg bg-foreground text-white text-xs font-bold">
                  <Star className="w-3 h-3 fill-lavender-400 text-lavender-400" />
                  Most Popular
                </div>
              )}

              <div>
                <h3 className={`text-lg font-semibold ${plan.popular ? 'text-white' : 'text-foreground'}`}>
                  {plan.name}
                </h3>
                <p className={`mt-1 text-sm ${plan.popular ? 'text-lavender-100' : 'text-muted'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mt-6 mb-6">
                <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-foreground'}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.popular ? 'text-lavender-200' : 'text-muted'}`}>
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        plan.popular ? 'text-lavender-200' : 'text-lavender-500'
                      }`}
                    />
                    <span className={plan.popular ? 'text-lavender-50' : 'text-muted'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? 'secondary' : 'primary'}
                className={`w-full !rounded-xl ${
                  plan.popular
                    ? '!bg-white !text-lavender-600 hover:!bg-lavender-50'
                    : ''
                }`}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
