import { motion, type HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: Variant
  href?: string
}

const variants: Record<Variant, string> = {
  primary:
    'bg-lavender-500 text-white shadow-glow hover:bg-lavender-600 hover:shadow-[0_12px_40px_-8px_rgba(139,127,212,0.5)]',
  secondary:
    'glass text-foreground hover:bg-lavender-50 dark:hover:bg-white/10 border border-lavender-200/60 dark:border-white/15',
  ghost: 'text-muted hover:text-foreground hover:bg-lavender-50/80 dark:hover:bg-white/5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', href, children, ...props }, ref) => {
    const classes = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-300 ${variants[variant]} ${className}`

    if (href) {
      return (
        <motion.a
          href={href}
          className={classes}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          {children}
        </motion.a>
      )
    }

    return (
      <motion.button
        ref={ref}
        className={classes}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.button>
    )
  },
)

Button.displayName = 'Button'
