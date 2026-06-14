import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Moon, Sun, Sparkles, User } from 'lucide-react'
import { Button } from '../ui/Button'
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
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user, loading } = useAuth()
  const location = useLocation()
  const isLanding = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const bookLink = user ? '/dashboard/book' : '/login'
  const bookLabel = user ? 'Book Pickup' : 'Sign In'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="container-narrow px-5 sm:px-8 lg:px-12 xl:px-16">
        <nav
          className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 ${
            scrolled ? 'glass shadow-soft' : 'bg-transparent'
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-lavender-500 text-white shadow-glow group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-serif text-xl text-foreground tracking-tight">
              Kapda<span className="text-lavender-500">SPA</span>
            </span>
          </Link>

          {isLanding && (
            <ul className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-muted hover:text-lavender-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-lavender-500 after:transition-all hover:after:w-full"
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
            className="lg:hidden fixed inset-x-0 top-[72px] bottom-0 bg-surface/95 backdrop-blur-xl z-40 px-6 py-8"
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
