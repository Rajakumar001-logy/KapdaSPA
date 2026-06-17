import { motion } from 'framer-motion'

interface SectionHeaderProps {
  label: string
  title: string
  description?: string
  align?: 'center' | 'left'
  variant?: 'light' | 'dark'
}

export function SectionHeader({
  label,
  title,
  description,
  align = 'center',
  variant = 'light',
}: SectionHeaderProps) {
  const isCenter = align === 'center'
  const isDark = variant === 'dark'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-14 md:mb-16 ${isCenter ? 'text-center mx-auto max-w-2xl' : 'max-w-xl'}`}
    >
      <span
        className={`inline-block mb-4 px-3 py-1 rounded-lg text-xs font-semibold tracking-wide uppercase border ${
          isDark
            ? 'bg-white/10 text-lavender-300 border-white/15'
            : 'bg-lavender-50 text-lavender-600 border-lavender-200'
        }`}
      >
        {label}
      </span>
      <h2
        className={`font-heading font-bold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight ${
          isDark ? 'text-white' : 'text-foreground'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 font-medium text-base md:text-lg leading-relaxed ${
            isDark ? 'text-white/90' : 'text-foreground'
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  )
}
