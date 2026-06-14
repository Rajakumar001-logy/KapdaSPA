import { motion } from 'framer-motion'

interface SectionHeaderProps {
  label: string
  title: string
  description?: string
  align?: 'center' | 'left'
}

export function SectionHeader({
  label,
  title,
  description,
  align = 'center',
}: SectionHeaderProps) {
  const isCenter = align === 'center'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-14 md:mb-16 ${isCenter ? 'text-center mx-auto max-w-2xl' : 'max-w-xl'}`}
    >
      <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-lavender-100 text-lavender-700 dark:bg-lavender-900/50 dark:text-lavender-300">
        {label}
      </span>
      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-muted text-base md:text-lg leading-relaxed">{description}</p>
      )}
    </motion.div>
  )
}
