import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { SectionHeader } from '../ui/SectionHeader'

const reviews = [
  {
    name: 'Priya Sharma',
    role: 'Marketing Director',
    text: 'KapdaSPA has completely changed how I manage laundry. Pickup is always on time, and my clothes come back smelling incredible. Worth every rupee.',
    rating: 5,
  },
  {
    name: 'Arjun Mehta',
    role: 'Startup Founder',
    text: 'As someone who travels constantly, having reliable dry cleaning with doorstep service is a game-changer. The app tracking is seamless.',
    rating: 5,
  },
  {
    name: 'Ananya Reddy',
    role: 'Working Mom',
    text: 'The Family plan saves us hours every week. Kids\' uniforms, my sarees, everything handled with care. Customer support is genuinely helpful.',
    rating: 5,
  },
  {
    name: 'Rahul Kapoor',
    role: 'Software Engineer',
    text: 'I was skeptical about outsourcing laundry, but the quality exceeded my expectations. Eco-friendly process was the deciding factor for me.',
    rating: 5,
  },
]

const stats = [
  { value: '10,000+', label: 'Clothes Cleaned' },
  { value: '2,000+', label: 'Happy Customers' },
  { value: '98%', label: 'Satisfaction Rate' },
]

export function Trust() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % reviews.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + reviews.length) % reviews.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section id="trust" className="section-padding bg-surface-muted">
      <div className="container-narrow">
        <SectionHeader
          label="Trusted by Thousands"
          title="Loved by customers across the city"
          description="Real stories from people who've made KapdaSPA part of their routine."
        />

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto mb-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-4 md:p-6 rounded-2xl glass-card"
            >
              <p className="text-2xl md:text-4xl font-bold text-gradient">{stat.value}</p>
              <p className="mt-1 text-xs md:text-sm text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-3xl mx-auto">
          <div className="glass-card rounded-3xl p-8 md:p-12 min-h-[240px] flex flex-col justify-center">
            <Quote className="w-10 h-10 text-lavender-300 mb-4" />

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: reviews[current].rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-lavender-400 text-lavender-400" />
                  ))}
                </div>
                <p className="text-lg md:text-xl text-foreground leading-relaxed font-heading font-medium">
                  &ldquo;{reviews[current].text}&rdquo;
                </p>
                <div className="mt-6">
                  <p className="font-semibold text-foreground">{reviews[current].name}</p>
                  <p className="text-sm text-muted">{reviews[current].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous review"
              className="p-2.5 rounded-full glass hover:bg-lavender-100 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to review ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 bg-lavender-500' : 'w-2 bg-lavender-200 dark:bg-lavender-700'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              aria-label="Next review"
              className="p-2.5 rounded-full glass hover:bg-lavender-100 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
