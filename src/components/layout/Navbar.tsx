import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Moon, Sun, User } from 'lucide-react'
import { Button } from '../ui/Button'
import { Logo } from '../ui/Logo'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 border-b border-border backdrop-blur-sm">
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-[4.5rem]">
          <Logo size="md" />

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
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2.5 rounded-full hover:bg-lavender-100 dark:hover:bg-white/10 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-lavender-300" />
              ) : (
                <Moon className="w-4 h-4 text-lavender-600" />
              )}
            </button>

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
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2 rounded-full hover:bg-lavender-100 dark:hover:bg-white/10"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="p-2 rounded-full hover:bg-lavender-100 dark:hover:bg-white/10"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-surface border-t border-border z-40 px-6 py-8"
          >
            {isLanding && (
              <ul className="flex flex-col gap-6">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-lg font-medium text-foreground"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            )}
            <div className={`flex flex-col gap-3 ${isLanding ? 'mt-8' : ''}`}>
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
