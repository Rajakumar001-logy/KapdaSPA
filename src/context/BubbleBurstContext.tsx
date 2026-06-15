import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface BurstOrigin {
  x: number
  y: number
}

interface BubbleBurstContextValue {
  triggerBurst: (origin?: BurstOrigin) => void
}

const BubbleBurstContext = createContext<BubbleBurstContextValue | undefined>(undefined)

function generateBurstBubbles(count = 72) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.6,
    distance: 85 + Math.random() * 95,
    size: 32 + Math.random() * 56,
    delay: Math.random() * 0.1,
  }))
}

function BubbleBurstOverlay({
  active,
  origin,
  burstKey,
}: {
  active: boolean
  origin: BurstOrigin
  burstKey: number
}) {
  const bubbles = useMemo(() => generateBurstBubbles(), [burstKey])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          aria-hidden="true"
        >
          {bubbles.map((b) => {
            const endX = Math.cos(b.angle) * b.distance * (window.innerWidth / 100)
            const endY = Math.sin(b.angle) * b.distance * (window.innerHeight / 100)

            return (
              <motion.span
                key={b.id}
                className="absolute rounded-full"
                style={{
                  width: b.size,
                  height: b.size,
                  left: origin.x,
                  top: origin.y,
                  marginLeft: -b.size / 2,
                  marginTop: -b.size / 2,
                  background:
                    'radial-gradient(circle at 28% 28%, rgba(255,255,255,0.95) 0%, rgba(196,181,253,0.85) 45%, rgba(147,51,234,0.55) 100%)',
                  border: '3px solid #7e22ce',
                  boxShadow:
                    '0 0 16px rgba(147, 51, 234, 0.55), inset 0 0 10px rgba(255, 255, 255, 0.5)',
                }}
                initial={{ x: 0, y: 0, scale: 0.35, opacity: 1 }}
                animate={{ x: endX, y: endY, scale: 1.15, opacity: 0.2 }}
                transition={{
                  duration: 1.8,
                  delay: b.delay,
                  ease: [0.12, 0.8, 0.2, 1],
                }}
              />
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function BubbleBurstProvider({ children }: { children: ReactNode }) {
  const [burstKey, setBurstKey] = useState(0)
  const [active, setActive] = useState(false)
  const [origin, setOrigin] = useState<BurstOrigin>({ x: 0, y: 0 })

  const triggerBurst = useCallback((burstOrigin?: BurstOrigin) => {
    const o = burstOrigin ?? {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }
    setOrigin(o)
    setBurstKey((k) => k + 1)
    setActive(true)
    window.setTimeout(() => setActive(false), 1800)
  }, [])

  return (
    <BubbleBurstContext.Provider value={{ triggerBurst }}>
      {children}
      <BubbleBurstOverlay key={burstKey} active={active} origin={origin} burstKey={burstKey} />
    </BubbleBurstContext.Provider>
  )
}

export function useBubbleBurst() {
  const ctx = useContext(BubbleBurstContext)
  if (!ctx) throw new Error('useBubbleBurst must be used within BubbleBurstProvider')
  return ctx
}
