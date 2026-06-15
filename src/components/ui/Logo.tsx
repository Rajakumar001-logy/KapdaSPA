import { Link } from 'react-router-dom'

type LogoSize = 'sm' | 'md' | 'lg'

interface LogoProps {
  size?: LogoSize
  showText?: boolean
  to?: string
  className?: string
  /** Light text for dark backgrounds (footer) */
  light?: boolean
}

const sizeMap: Record<LogoSize, { img: string; text: string; gap: string }> = {
  sm: { img: 'h-11 w-11', text: 'text-xl', gap: 'gap-2.5' },
  md: { img: 'h-14 w-14 sm:h-16 sm:w-16', text: 'text-[1.75rem] sm:text-[2rem]', gap: 'gap-3' },
  lg: { img: 'h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20', text: 'text-4xl sm:text-[2.75rem]', gap: 'gap-4' },
}

export function Logo({
  size = 'md',
  showText = true,
  to = '/',
  className = '',
  light = false,
}: LogoProps) {
  const s = sizeMap[size]

  const content = (
    <>
      <img
        src="/logo.png"
        alt="KapdaSPA"
        className={`${s.img} object-contain shrink-0 rounded-lg`}
      />
      {showText && (
        <span className={`font-brand ${s.text} leading-none tracking-tight ${light ? 'text-white' : ''}`}>
          <span className={light ? 'text-white' : 'text-foreground'}>Kapda</span>
          <span className={`text-lavender-400 italic ${light ? 'text-lavender-300' : ''}`}>SPA</span>
        </span>
      )}
    </>
  )

  const classes = `inline-flex items-center ${s.gap} ${className}`

  if (to) {
    return (
      <Link to={to} className={`${classes} group`}>
        {content}
      </Link>
    )
  }

  return <div className={classes}>{content}</div>
}
