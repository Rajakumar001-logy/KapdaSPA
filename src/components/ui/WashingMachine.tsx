import { motion } from 'framer-motion'

const bubbles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${8 + (i * 7.5) % 84}%`,
  size: 6 + (i % 4) * 4,
  delay: i * 0.4,
  duration: 3.5 + (i % 3),
}))

export function BubbleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="absolute bottom-0 rounded-full bg-lavender-300/30 dark:bg-lavender-400/20 animate-bubble-rise"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDelay: `${b.delay}s`,
            // @ts-expect-error CSS custom property
            '--duration': `${b.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

export function WaterWaves() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg
        className="absolute bottom-0 w-[200%] h-full animate-wave opacity-30 dark:opacity-20"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z"
          fill="currentColor"
          className="text-lavender-300"
        />
      </svg>
      <svg
        className="absolute bottom-0 w-[200%] h-3/4 animate-wave opacity-20 dark:opacity-10"
        style={{ animationDuration: '12s', animationDirection: 'reverse' }}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,80 C200,20 400,100 600,50 C800,0 1000,90 1200,40 L1200,120 L0,120 Z"
          fill="currentColor"
          className="text-lavender-400"
        />
      </svg>
    </div>
  )
}

export function WashingMachine() {
  return (
    <motion.div
      className="relative w-64 h-72 sm:w-72 sm:h-80"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glow */}
      <div className="absolute inset-4 rounded-3xl bg-lavender-400/20 blur-3xl" />

      <svg
        viewBox="0 0 280 320"
        className="relative w-full h-full drop-shadow-2xl"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5f3fa" />
            <stop offset="100%" stopColor="#e8e4f0" />
          </linearGradient>
          <linearGradient id="doorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ddd4f0" />
            <stop offset="100%" stopColor="#c4b5e4" />
          </linearGradient>
          <clipPath id="drumClip">
            <circle cx="140" cy="195" r="72" />
          </clipPath>
        </defs>

        {/* Body */}
        <rect x="30" y="40" width="220" height="260" rx="24" fill="url(#bodyGrad)" stroke="#c4b5e4" strokeWidth="2" />
        <rect x="30" y="40" width="220" height="50" rx="24" fill="#ede8f8" />
        <rect x="30" y="70" width="220" height="20" fill="#ede8f8" />

        {/* Control panel */}
        <circle cx="70" cy="65" r="8" fill="#8b7fd4" opacity="0.8">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="95" cy="65" r="6" fill="#a894d4" />
        <rect x="120" y="58" width="50" height="14" rx="4" fill="#ddd4f0" />
        <rect x="125" y="61" width="20" height="8" rx="2" fill="#8b7fd4">
          <animate attributeName="width" values="10;35;10" dur="3s" repeatCount="indefinite" />
        </rect>

        {/* Door outer ring */}
        <circle cx="140" cy="195" r="82" fill="#f8f6fc" stroke="#c4b5e4" strokeWidth="3" />
        <circle cx="140" cy="195" r="72" fill="url(#doorGrad)" stroke="#a894d4" strokeWidth="2" />

        {/* Drum water */}
        <circle cx="140" cy="195" r="68" fill="#b8aae8" opacity="0.5" />

        {/* Spinning clothes */}
        <g clipPath="url(#drumClip)">
          <g className="animate-spin-slow" style={{ transformOrigin: '140px 195px' }}>
            <ellipse cx="140" cy="175" rx="28" ry="12" fill="#8b7fd4" opacity="0.7" transform="rotate(0 140 195)" />
            <ellipse cx="155" cy="200" rx="22" ry="10" fill="#7264b8" opacity="0.6" transform="rotate(60 140 195)" />
            <ellipse cx="125" cy="205" rx="20" ry="9" fill="#a894d4" opacity="0.65" transform="rotate(120 140 195)" />
            <ellipse cx="145" cy="220" rx="24" ry="11" fill="#5c5099" opacity="0.5" transform="rotate(180 140 195)" />
          </g>
          {/* Bubbles in drum */}
          {[0, 1, 2, 3, 4].map((i) => (
            <circle
              key={i}
              cx={120 + i * 10}
              cy={180 + (i % 3) * 15}
              r={3 + (i % 2)}
              fill="white"
              opacity="0.6"
            >
              <animate
                attributeName="cy"
                values={`${190 + i * 5};${170 + i * 3};${190 + i * 5}`}
                dur={`${1.5 + i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {/* Door handle */}
        <rect x="210" y="185" width="12" height="20" rx="4" fill="#a894d4" />

        {/* Feet */}
        <rect x="50" y="295" width="20" height="10" rx="3" fill="#c4b5e4" />
        <rect x="210" y="295" width="20" height="10" rx="3" fill="#c4b5e4" />
      </svg>

      {/* Floating accent bubbles around machine */}
      {[...Array(5)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-lavender-300/40 border border-lavender-200/60"
          style={{
            width: 12 + i * 4,
            height: 12 + i * 4,
            top: `${15 + i * 12}%`,
            right: `${-5 + i * 3}%`,
          }}
          animate={{ y: [0, -10, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  )
}
