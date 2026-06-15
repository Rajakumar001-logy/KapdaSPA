import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'
import { contactConfig } from '../../config/contact'

const faqs = [
  {
    question: 'How does doorstep pickup work?',
    answer:
      'Choose a time slot through our app or website. Our delivery partner collects your laundry bag from your doorstep, and we return it cleaned within your selected turnaround window.',
  },
  {
    question: 'What areas do you currently serve?',
    answer:
      `We currently serve ${contactConfig.servingCities.join(', ')}. More cities are launching soon — scroll to the bottom of this page to request service in your city.`,
  },
  {
    question: 'How do you handle delicate or designer garments?',
    answer:
      'Every item is sorted and tagged individually. Delicate fabrics are separated and processed using our Premium Garment Care service with specialized solvents and hand-finishing where needed.',
  },
  {
    question: 'What is your turnaround time?',
    answer:
      'Standard wash & fold takes 48 hours. Premium plan members get 24-hour service, and same-day delivery is available in select areas for an additional fee.',
  },
  {
    question: 'Are your cleaning products eco-friendly?',
    answer:
      'Yes. We use biodegradable, phosphate-free detergents and water-efficient machines. Our Premium and Family plans include our full eco-formula line at no extra cost.',
  },
  {
    question: 'Can I pause or cancel my subscription?',
    answer:
      'Absolutely. Pause or cancel anytime from your account dashboard with no cancellation fees. Unused credits roll over for up to 30 days.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="section-padding bg-surface-muted">
      <div className="container-narrow max-w-3xl">
        <SectionHeader
          label="FAQ"
          title="Questions? We've got answers."
          description="Everything you need to know before your first pickup."
        />

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl glass-card overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left hover:bg-lavender-50/50 dark:hover:bg-white/5 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 w-8 h-8 rounded-full bg-lavender-100 dark:bg-lavender-900/40 flex items-center justify-center"
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-lavender-600" />
                    ) : (
                      <Plus className="w-4 h-4 text-lavender-600" />
                    )}
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-5 md:px-6 pb-5 md:pb-6 text-muted leading-relaxed text-sm md:text-base">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
