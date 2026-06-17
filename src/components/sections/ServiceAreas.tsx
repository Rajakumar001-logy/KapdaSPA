import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Send, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { contactConfig } from '../../config/contact'
import { SectionHeader } from '../ui/SectionHeader'
import { Button } from '../ui/Button'

export function ServiceAreas() {
  const [cityForm, setCityForm] = useState({ name: '', email: '', phone: '', city: '', message: '' })
  const [callForm, setCallForm] = useState({ name: '', phone: '', preferredTime: '', message: '' })
  const [citySuccess, setCitySuccess] = useState(false)
  const [callSuccess, setCallSuccess] = useState(false)
  const [cityError, setCityError] = useState('')
  const [callError, setCallError] = useState('')
  const [citySubmitting, setCitySubmitting] = useState(false)
  const [callSubmitting, setCallSubmitting] = useState(false)

  const handleCitySubmit = async (e: FormEvent) => {
    e.preventDefault()
    setCityError('')
    setCitySubmitting(true)

    const { error } = await supabase.from('city_requests').insert({
      name: cityForm.name,
      email: cityForm.email || null,
      phone: cityForm.phone || null,
      city: cityForm.city,
      message: cityForm.message || null,
    })

    setCitySubmitting(false)
    if (error) {
      setCityError('Could not submit request. Please try again or call us directly.')
    } else {
      setCitySuccess(true)
      setCityForm({ name: '', email: '', phone: '', city: '', message: '' })
    }
  }

  const handleCallSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setCallError('')
    setCallSubmitting(true)

    const { error } = await supabase.from('call_requests').insert({
      name: callForm.name,
      phone: callForm.phone,
      preferred_time: callForm.preferredTime || null,
      message: callForm.message || null,
    })

    setCallSubmitting(false)
    if (error) {
      setCallError('Could not submit request. Please call us at ' + contactConfig.phone)
    } else {
      setCallSuccess(true)
      setCallForm({ name: '', phone: '', preferredTime: '', message: '' })
    }
  }

  return (
    <section id="service-areas" className="section-padding bg-surface">
      <div className="container-narrow">
        <SectionHeader
          label="Service Areas"
          title="Currently serving select cities"
          description={`We're live in ${contactConfig.servingCities.slice(0, 3).join(', ')} and more — and expanding fast.`}
        />

        {/* Serving cities */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-6"
        >
          {contactConfig.servingCities.map((city) => (
            <span
              key={city}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-lavender-100 text-black text-sm font-semibold border border-lavender-200/60"
            >
              <MapPin className="w-4 h-4 text-lavender-600" />
              {city}
            </span>
          ))}
        </motion.div>

        <p className="text-center text-foreground text-sm font-medium mb-12">
          <span className="font-semibold">Coming soon in your city.</span>{' '}
          Request service below and we&apos;ll notify you when we launch near you.
        </p>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Request city */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-lavender-100 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-lavender-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Request service in your city</h3>
                <p className="text-xs text-foreground font-medium">We&apos;ll reach out when we&apos;re nearby</p>
              </div>
            </div>

            {citySuccess ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 text-green-700">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">Thanks! We&apos;ve received your request and will be in touch.</p>
              </div>
            ) : (
              <form onSubmit={handleCitySubmit} className="space-y-4">
                {cityError && (
                  <p className="text-sm text-red-600">{cityError}</p>
                )}
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={cityForm.name}
                  onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-black/50 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
                />
                <input
                  type="text"
                  required
                  placeholder="Your city"
                  value={cityForm.city}
                  onChange={(e) => setCityForm({ ...cityForm, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-black/50 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={cityForm.email}
                    onChange={(e) => setCityForm({ ...cityForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-black/50 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={cityForm.phone}
                    onChange={(e) => setCityForm({ ...cityForm, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-black/50 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Anything else? (optional)"
                  value={cityForm.message}
                  onChange={(e) => setCityForm({ ...cityForm, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-black/50 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400 resize-none"
                />
                <Button type="submit" className="w-full !rounded-xl gap-2" disabled={citySubmitting}>
                  <Send className="w-4 h-4" />
                  {citySubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            )}
          </motion.div>

          {/* Request a call */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-lavender-100 flex items-center justify-center">
                <Phone className="w-5 h-5 text-lavender-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Request a call from us</h3>
                <p className="text-xs text-foreground font-medium">We&apos;ll call you back at your preferred time</p>
              </div>
            </div>

            {callSuccess ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 text-green-700">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">Got it! Our team will call you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleCallSubmit} className="space-y-4">
                {callError && (
                  <p className="text-sm text-red-600">{callError}</p>
                )}
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={callForm.name}
                  onChange={(e) => setCallForm({ ...callForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-black/50 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone number"
                  value={callForm.phone}
                  onChange={(e) => setCallForm({ ...callForm, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-black/50 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
                />
                <input
                  type="text"
                  placeholder="Preferred time to call (e.g. 10 AM – 12 PM)"
                  value={callForm.preferredTime}
                  onChange={(e) => setCallForm({ ...callForm, preferredTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-black/50 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
                />
                <textarea
                  rows={2}
                  placeholder="What can we help with? (optional)"
                  value={callForm.message}
                  onChange={(e) => setCallForm({ ...callForm, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder:text-black/50 text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400 resize-none"
                />
                <Button type="submit" className="w-full !rounded-xl gap-2" disabled={callSubmitting}>
                  <Phone className="w-4 h-4" />
                  {callSubmitting ? 'Submitting...' : 'Request a Call'}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
