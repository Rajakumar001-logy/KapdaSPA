import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Share2, Globe, MessageCircle, Heart, ArrowRight } from 'lucide-react'
import { contactConfig } from '../../config/contact'
import { Logo } from '../ui/Logo'

const footerLinks = {
  Company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Blog', href: '#' },
  ],
  Services: [
    { label: 'Wash & Fold', href: '#services' },
    { label: 'Dry Cleaning', href: '#services' },
    { label: 'Premium Care', href: '#services' },
    { label: 'Pricing', href: '#pricing' },
  ],
  Support: [
    { label: 'Help Center', href: '#faq' },
    { label: 'Request a Call', href: '#service-areas' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
}

const socials = [
  { icon: Share2, href: contactConfig.social.instagram, label: 'Instagram' },
  { icon: Globe, href: contactConfig.social.twitter, label: 'Twitter' },
  { icon: MessageCircle, href: contactConfig.social.linkedin, label: 'LinkedIn' },
  { icon: Heart, href: contactConfig.social.facebook, label: 'Facebook' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-black text-white dark:bg-white dark:text-slate-900">
      <div className="section-padding pb-0">
        <div className="container-narrow relative rounded-2xl bg-lavender-400 p-8 md:p-12 text-center">
          <h2 className="font-heading font-bold text-2xl md:text-4xl text-white">
            Ready for effortless laundry?
          </h2>
          <p className="mt-3 text-white/90 max-w-lg mx-auto text-sm md:text-base font-medium">
            Book your first pickup today and experience premium care — on us for new customers.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-slate-100 transition-colors"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-narrow">
          <div className="mb-12 pb-10 border-b border-white/15 dark:border-slate-200">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Currently serving
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {contactConfig.servingCities.map((city) => (
                <span
                  key={city}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-sm font-semibold text-white border border-white/15 dark:bg-slate-100 dark:text-slate-800 dark:border-slate-200"
                >
                  {city}
                </span>
              ))}
            </div>
            <p className="text-sm font-medium text-slate-400 dark:text-slate-600 mb-6">
              Coming soon in your city —{' '}
              <a href="#service-areas" className="text-lavender-300 font-semibold hover:text-lavender-200 dark:text-lavender-600 dark:hover:text-lavender-700">
                request service here
              </a>
            </p>

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Mobile app
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 text-sm font-medium text-slate-200 border border-white/15 dark:bg-slate-100 dark:text-slate-700 dark:border-slate-200">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                  <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5ZM16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12ZM20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81ZM6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" />
                </svg>
                Google Play — Coming Soon
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 text-sm font-medium text-slate-200 border border-white/15 dark:bg-slate-100 dark:text-slate-700 dark:border-slate-200">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 21.95 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                </svg>
                App Store — Coming Soon
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            <div className="lg:col-span-2">
              <Logo size="md" footer />
              <p className="mt-4 text-slate-400 dark:text-slate-600 text-sm font-medium leading-relaxed max-w-xs">
                Premium laundry and dry cleaning with doorstep pickup &amp; delivery.
              </p>

              <div className="mt-6 space-y-2.5 text-sm font-medium text-slate-300 dark:text-slate-700">
                <a
                  href={`mailto:${contactConfig.email}`}
                  className="flex items-center gap-2 hover:text-lavender-300 dark:hover:text-lavender-600 transition-colors"
                >
                  <Mail className="w-4 h-4 text-lavender-400 dark:text-lavender-600 shrink-0" />
                  {contactConfig.email}
                </a>
                <a
                  href={`tel:${contactConfig.phoneTel}`}
                  className="flex items-center gap-2 hover:text-lavender-300 dark:hover:text-lavender-600 transition-colors"
                >
                  <Phone className="w-4 h-4 text-lavender-400 dark:text-lavender-600 shrink-0" />
                  {contactConfig.phone}
                </a>
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-lavender-400 dark:text-lavender-600 shrink-0 mt-0.5" />
                  {contactConfig.address}
                </p>
              </div>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-bold text-sm uppercase tracking-wider text-white dark:text-slate-900 mb-4">
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm font-medium text-slate-400 hover:text-lavender-300 dark:text-slate-600 dark:hover:text-lavender-600 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 pt-10 border-t border-white/15 dark:border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h4 className="font-bold text-lg text-white dark:text-slate-900">Stay in the loop</h4>
                <p className="text-sm font-medium text-slate-400 dark:text-slate-600 mt-1">
                  Get tips, offers, and laundry hacks in your inbox.
                </p>
              </div>

              {subscribed ? (
                <p className="text-lavender-300 dark:text-lavender-600 text-sm font-bold">
                  Thanks for subscribing!
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lavender-400 dark:bg-slate-100 dark:border-slate-200 dark:text-slate-900 dark:placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-lavender-400 hover:bg-lavender-500 text-white text-sm font-bold transition-colors shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/15 dark:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-500">
              &copy; {new Date().getFullYear()} KapdaSPA. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-lavender-400 hover:border-lavender-400 transition-colors dark:bg-slate-100 dark:border-slate-200 dark:text-slate-700 dark:hover:bg-lavender-400 dark:hover:text-white dark:hover:border-lavender-400"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
