import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Mail, Phone, MapPin, Share2, Globe, MessageCircle, Heart, ArrowRight } from 'lucide-react'

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
    { label: 'Contact Us', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
}

const socials = [
  { icon: Share2, href: '#', label: 'Instagram' },
  { icon: Globe, href: '#', label: 'Twitter' },
  { icon: MessageCircle, href: '#', label: 'LinkedIn' },
  { icon: Heart, href: '#', label: 'Facebook' },
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
    <footer className="bg-lavender-900 text-white dark:bg-[#0c0a12] relative overflow-hidden">
      {/* CTA Banner */}
      <div className="section-padding pb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container-narrow relative rounded-3xl bg-gradient-to-br from-lavender-500 to-lavender-700 p-8 md:p-12 lg:p-16 text-center overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <h2 className="relative font-serif text-3xl md:text-4xl lg:text-5xl text-white">
            Ready for effortless laundry?
          </h2>
          <p className="relative mt-4 text-lavender-100 max-w-lg mx-auto">
            Book your first pickup today and experience premium care — on us for new customers.
          </p>
          <a
            href="#pricing"
            className="relative inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-full bg-white text-lavender-600 font-semibold hover:bg-lavender-50 transition-colors shadow-lg"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>

      <div className="section-padding">
        <div className="container-narrow">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <a href="#" className="flex items-center gap-2 text-white">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-lavender-500">
                  <Sparkles className="w-4 h-4 text-white" />
                </span>
                <span className="font-serif text-xl text-white">
                  Kapda<span className="text-lavender-300">SPA</span>
                </span>
              </a>
              <p className="mt-4 text-lavender-200/80 text-sm leading-relaxed max-w-xs">
                Premium laundry and dry cleaning with doorstep pickup &amp; delivery. Making clean clothes effortless since 2024.
              </p>

              <div className="mt-6 space-y-2.5 text-sm text-lavender-100">
                <a href="mailto:hello@kapdaspa.com" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-lavender-300 shrink-0" />
                  hello@kapdaspa.com
                </a>
                <a href="tel:+911800123456" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-lavender-300 shrink-0" />
                  1800-123-456
                </a>
                <p className="flex items-start gap-2 text-lavender-100">
                  <MapPin className="w-4 h-4 text-lavender-300 shrink-0 mt-0.5" />
                  Mumbai · Delhi · Bangalore · Hyderabad
                </p>
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-semibold text-sm uppercase tracking-wider text-white mb-4">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-lavender-200/80 hover:text-white transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mt-14 pt-10 border-t border-lavender-700/50 dark:border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h4 className="font-semibold text-lg text-white">Stay in the loop</h4>
                <p className="text-sm text-lavender-200/80 mt-1">Get tips, offers, and laundry hacks in your inbox.</p>
              </div>

              {subscribed ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lavender-300 text-sm font-medium"
                >
                  Thanks for subscribing!
                </motion.p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 md:w-64 px-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-lavender-500 hover:bg-lavender-400 text-white text-sm font-semibold transition-colors shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-lavender-700/50 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-lavender-300/70">
              &copy; {new Date().getFullYear()} KapdaSPA. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-lavender-500 transition-colors"
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
