import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Share2, Globe, MessageCircle, Heart, ArrowRight } from 'lucide-react'
import { contactConfig } from '../../config/contact'
import { Logo } from '../ui/Logo'
import { StoreBadge } from '../ui/StoreBadges'
import { MobileApp } from '../sections/MobileApp'

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
    <footer>
      <div className="section-padding pb-0 bg-white">
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

        <MobileApp />
      </div>

      <div className="w-full bg-[#0a0a0a] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="pb-10 border-b border-white/10">
            <p className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Currently serving
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {contactConfig.servingCities.map((city) => (
                <span
                  key={city}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-sm font-semibold text-white border border-white/15"
                >
                  {city}
                </span>
              ))}
            </div>
            <p className="text-sm font-medium text-white mb-6">
              Coming soon in your city —{' '}
              <a href="#service-areas" className="text-white font-semibold underline underline-offset-2 hover:text-lavender-300 transition-colors">
                request service here
              </a>
            </p>

            <p className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Mobile app
            </p>
            <div className="flex flex-wrap gap-4">
              <StoreBadge variant="google" theme="dark" />
              <StoreBadge variant="apple" theme="dark" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 py-10">
            <div className="lg:col-span-2">
              <Logo size="md" footer />
              <p className="mt-4 text-white text-sm font-medium leading-relaxed max-w-xs">
                Premium laundry and dry cleaning with doorstep pickup &amp; delivery.
              </p>

              <div className="mt-6 space-y-2.5 text-sm font-medium text-white">
                <a
                  href={`mailto:${contactConfig.email}`}
                  className="flex items-center gap-2 hover:text-lavender-300 transition-colors"
                >
                  <Mail className="w-4 h-4 text-lavender-300 shrink-0" />
                  {contactConfig.email}
                </a>
                <a
                  href={`tel:${contactConfig.phoneTel}`}
                  className="flex items-center gap-2 hover:text-lavender-300 transition-colors"
                >
                  <Phone className="w-4 h-4 text-lavender-300 shrink-0" />
                  {contactConfig.phone}
                </a>
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-lavender-300 shrink-0 mt-0.5" />
                  {contactConfig.address}
                </p>
              </div>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-bold text-sm uppercase tracking-wider text-white mb-4">
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm font-medium text-white hover:text-lavender-300 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h4 className="font-bold text-lg text-white">Stay in the loop</h4>
                <p className="text-sm font-medium text-white mt-1">
                  Get tips, offers, and laundry hacks in your inbox.
                </p>
              </div>

              {subscribed ? (
                <p className="text-lavender-300 text-sm font-bold">
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
                    className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lavender-400"
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

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-semibold text-white">
              &copy; {new Date().getFullYear()} KapdaSPA. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-lavender-400 hover:border-lavender-400 transition-colors"
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
