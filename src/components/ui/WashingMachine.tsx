import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Power } from 'lucide-react'
import { useBubbleBurst } from '../../context/BubbleBurstContext'

export function WashingMachine() {
  const [isOn, setIsOn] = useState(false)
  const powerBtnRef = useRef<HTMLButtonElement>(null)
  const { triggerBurst } = useBubbleBurst()

  const handlePowerToggle = () => {
    if (isOn) {
      setIsOn(false)
      return
    }

    setIsOn(true)

    if (powerBtnRef.current) {
      const rect = powerBtnRef.current.getBoundingClientRect()
      triggerBurst({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
    } else {
      triggerBurst()
    }
  }

  return (
    <motion.div
      className="relative w-64 h-72 sm:w-72 sm:h-80"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`absolute inset-4 rounded-3xl blur-3xl transition-colors duration-500 ${
          isOn ? 'bg-lavender-300' : 'bg-lavender-200'
        }`}
      />

      <svg
        viewBox="0 0 280 320"
        className="relative w-full h-full drop-shadow-2xl"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
          <linearGradient id="doorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f3e8ff" />
            <stop offset="100%" stopColor="#e9d5ff" />
          </linearGradient>
          <clipPath id="drumClip">
            <circle cx="140" cy="195" r="72" />
          </clipPath>
        </defs>

        <rect x="30" y="40" width="220" height="260" rx="24" fill="url(#bodyGrad)" stroke="#9333ea" strokeWidth="2.5" />
        <rect x="30" y="40" width="220" height="50" rx="24" fill="#f8fafc" stroke="#9333ea" strokeWidth="2" />
        <rect x="30" y="70" width="220" height="20" fill="#f8fafc" />
        <line x1="30" y1="90" x2="250" y2="90" stroke="#c4b5fd" strokeWidth="1.5" />

        {/* Power indicator (visual — actual button is HTML overlay) */}
        <circle
          cx="70"
          cy="65"
          r="10"
          fill={isOn ? '#a78bfa' : '#ede9fe'}
          stroke="#7e22ce"
          strokeWidth="1.5"
        />
        {isOn && (
          <circle cx="70" cy="65" r="4" fill="#ffffff">
            <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite" />
          </circle>
        )}

        <circle cx="95" cy="65" r="6" fill="#c4b5fd" stroke="#9333ea" strokeWidth="1.5" />
        <rect x="120" y="58" width="50" height="14" rx="4" fill="#e9d5ff" stroke="#9333ea" strokeWidth="1.5" />
        <rect x="125" y="61" width="20" height="8" rx="2" fill="#a78bfa">
          {isOn && (
            <animate attributeName="width" values="10;40;10" dur="1.2s" repeatCount="indefinite" />
          )}
        </rect>

        <circle cx="140" cy="195" r="82" fill="#ffffff" stroke="#9333ea" strokeWidth="3.5" />
        <circle cx="140" cy="195" r="72" fill="url(#doorGrad)" stroke="#7e22ce" strokeWidth="2.5" />
        <circle cx="140" cy="195" r="68" fill="#ddd6fe" opacity="0.6" stroke="#a78bfa" strokeWidth="1" />

        <g clipPath="url(#drumClip)">
          <g
            className={isOn ? 'animate-spin-fast' : 'animate-spin-slow'}
            style={{ transformOrigin: '140px 195px' }}
          >
            <ellipse cx="140" cy="175" rx="28" ry="12" fill="#a78bfa" opacity="0.7" transform="rotate(0 140 195)" />
            <ellipse cx="155" cy="200" rx="22" ry="10" fill="#9333ea" opacity="0.6" transform="rotate(60 140 195)" />
            <ellipse cx="125" cy="205" rx="20" ry="9" fill="#c4b5fd" opacity="0.65" transform="rotate(120 140 195)" />
            <ellipse cx="145" cy="220" rx="24" ry="11" fill="#7e22ce" opacity="0.5" transform="rotate(180 140 195)" />
          </g>
          {isOn &&
            [0, 1, 2, 3, 4, 5].map((i) => (
              <circle
                key={i}
                cx={120 + i * 10}
                cy={180 + (i % 3) * 15}
                r={3 + (i % 2)}
                fill="white"
                opacity="0.7"
              >
                <animate
                  attributeName="cy"
                  values={`${190 + i * 5};${165 + i * 3};${190 + i * 5}`}
                  dur={`${0.8 + i * 0.2}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
        </g>

        <rect x="210" y="185" width="12" height="20" rx="4" fill="#c4b5fd" stroke="#7e22ce" strokeWidth="1.5" />
        <rect x="50" y="295" width="20" height="10" rx="3" fill="#ede9fe" stroke="#9333ea" strokeWidth="1.5" />
        <rect x="210" y="295" width="20" height="10" rx="3" fill="#ede9fe" stroke="#9333ea" strokeWidth="1.5" />
      </svg>

      {/* Interactive power button */}
      <button
        ref={powerBtnRef}
        type="button"
        onClick={handlePowerToggle}
        aria-label={isOn ? 'Turn washing machine off' : 'Turn washing machine on'}
        aria-pressed={isOn}
        title={isOn ? 'Power off' : 'Power on'}
        className={`absolute flex items-center justify-center rounded-full border-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender-400 focus-visible:ring-offset-2 ${
          isOn
            ? 'bg-lavender-400 border-lavender-600 text-white shadow-glow scale-105'
            : 'bg-lavender-50 border-lavender-400 text-lavender-600 hover:bg-lavender-100'
        }`}
        style={{
          width: '2.25rem',
          height: '2.25rem',
          top: '17%',
          left: '19%',
        }}
      >
        <Power className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </motion.div>
  )
}
