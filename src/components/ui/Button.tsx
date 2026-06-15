import { forwardRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  href?: string
  to?: string
  children?: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-lavender-400 text-white shadow-glow hover:bg-lavender-500 active:bg-lavender-600',
  secondary:
    'bg-surface text-foreground hover:bg-surface-muted border border-border hover:border-lavender-300',
  ghost: 'text-muted hover:text-foreground hover:bg-surface-muted',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', href, to, children, ...props }, ref) => {
    const classes = `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors duration-200 ${variants[variant]} ${className}`

    if (to) {
      return (
        <Link to={to} className={classes}>
          {children}
        </Link>
      )
    }

    if (href) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      )
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
