import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User } from 'lucide-react'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Services', href: '#services' },
  { label: 'FAQ', href: '#faq' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, loading } = useAuth()
  const location = useLocation()
  const isLanding = location.pathname === '/'


  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const bookLink = user ? '/dashboard/book' : '/login'
  const bookLabel = user ? 'Book Pickup' : 'Sign In'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b ${
        mobileOpen ? 'bg-black border-white/10' : 'bg-surface/95 border-border backdrop-blur-sm'
      }`}
    >
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-[4.5rem]">
          <Logo size="md" light={mobileOpen} />

          {isLanding && (
            <ul className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-muted hover:text-lavender-500 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className="hidden lg:flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <Button to="/dashboard" variant="secondary" className="!py-2.5 !px-5 !text-sm gap-2">
                    <User className="w-4 h-4" />
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button to="/login" variant="secondary" className="!py-2.5 !px-5 !text-sm">
                      Sign In
                    </Button>
                    <Button to="/register" className="!py-2.5 !px-5 !text-sm">
                      Register
                    </Button>
                  </>
                )}
                <Button to={bookLink} className="!py-2.5 !px-5 !text-sm">
                  {user ? 'Book Pickup' : 'Get Started'}
                </Button>
              </>
            )}
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className={`p-2 rounded-full transition-colors ${
                mobileOpen ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-lavender-100'
              }`}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 top-[4.5rem] z-40 bg-black/60"
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="lg:hidden fixed inset-x-0 top-[4.5rem] bottom-0 z-50 bg-black border-t border-white/10 shadow-lg overflow-y-auto"
            >
              <div className="px-5 py-6 space-y-6">
                {isLanding && (
                  <ul className="flex flex-col gap-1">
                    {navLinks.map((link, i) => (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <a
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-xl px-4 py-3.5 text-base font-medium text-white bg-black hover:bg-white/10 active:bg-white/15 transition-colors"
                        >
                          {link.label}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                )}
                <div className={`flex flex-col gap-3 ${isLanding ? 'pt-2 border-t border-white/10' : ''}`}>
                  {user ? (
                    <>
                      <Button to="/dashboard" onClick={() => setMobileOpen(false)}>
                        Dashboard
                      </Button>
                      <Button to="/dashboard/book" variant="secondary" onClick={() => setMobileOpen(false)}>
                        Book Pickup
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button to="/register" onClick={() => setMobileOpen(false)}>
                        Register
                      </Button>
                      <Button to="/login" variant="secondary" onClick={() => setMobileOpen(false)}>
                        {bookLabel}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
