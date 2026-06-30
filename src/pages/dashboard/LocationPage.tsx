import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight, AlertCircle, Sparkles } from 'lucide-react'
import { contactConfig } from '../../config/contact'
import { useAuth } from '../../context/AuthContext'
import { isServingCity, normalizeCityInput, resolveServingCity } from '../../lib/location'
import { Button } from '../../components/ui/Button'
import { UseCurrentLocationButton } from '../../components/ui/UseCurrentLocationButton'
import type { GeocodedLocation } from '../../lib/location'

export function LocationPage() {
  const { profile, updateProfile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = (location.state as { from?: string })?.from ?? '/dashboard/book'
  const [cityInput, setCityInput] = useState(profile?.city ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [unservedCity, setUnservedCity] = useState<string | null>(null)
  const [detectedHint, setDetectedHint] = useState('')

  const applyDetectedLocation = (detected: GeocodedLocation) => {
    setError('')
    setDetectedHint('')
    setCityInput(detected.city)

    setDetectedHint(
      `Detected ${detected.city}${detected.pinCode ? ` · PIN ${detected.pinCode}` : ''}. Confirm to continue.`,
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setUnservedCity(null)

    const input = normalizeCityInput(cityInput)
    if (!input) {
      setError('Please enter your city')
      return
    }

    setSubmitting(true)

    try {
      const servedCity = resolveServingCity(input)
      const served = servedCity !== null

      const { error: err } = await updateProfile({
        city: served ? servedCity : input,
        location_status: served ? 'served' : 'unserved',
      })

      if (err) {
        setError(err)
        return
      }

      if (served) {
        navigate(returnTo, { replace: true })
      } else {
        setUnservedCity(input)
      }
    } catch {
      setError('Something went wrong. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChangeCity = () => {
    setUnservedCity(null)
    setCityInput('')
  }

  if (unservedCity) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto mt-4"
      >
        <div className="glass-card rounded-3xl p-8 md:p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="font-heading text-2xl md:text-3xl text-foreground">
            Sorry, we&apos;re not in {unservedCity} yet
          </h1>
          <p className="text-muted mt-4 text-sm leading-relaxed">
            KapdaSPA is currently unavailable at your location. We&apos;ll be live in your city soon —
            thank you for your interest!
          </p>
          <p className="text-sm text-muted mt-4">
            We&apos;re serving:{' '}
            <span className="text-foreground font-medium">
              {contactConfig.servingCities.join(', ')}
            </span>
          </p>
          <p className="text-sm text-muted mt-3">
            Need help? Email us at{' '}
            <a href={`mailto:${contactConfig.email}`} className="text-lavender-600 font-medium hover:underline">
              {contactConfig.email}
            </a>
          </p>
          <Button type="button" variant="secondary" className="mt-8 !rounded-xl" onClick={handleChangeCity}>
            Try a different city
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto mt-4"
    >
      <div className="glass-card rounded-3xl p-8 md:p-10">
        <Link
          to="/dashboard"
          className="text-sm text-muted hover:text-foreground mb-4 inline-block"
        >
          ← Back to dashboard
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-lavender-100 dark:bg-lavender-900/30 flex items-center justify-center">
            <MapPin className="w-6 h-6 text-lavender-600" />
          </div>
          <div>
            <h1 className="font-heading text-2xl md:text-3xl text-foreground">Select your location</h1>
            <p className="text-sm text-muted mt-0.5">We need your city before you can book a pickup</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <UseCurrentLocationButton
            disabled={submitting}
            onLocation={(location) => applyDetectedLocation(location)}
            onError={setError}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-surface px-3 text-muted">or enter manually</span>
            </div>
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-foreground mb-1.5">
              Your city
            </label>
            <input
              id="city"
              type="text"
              required
              list="serving-cities"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="e.g. Lucknow, Delhi, Noida..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
            />
            <datalist id="serving-cities">
              {contactConfig.servingCities.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
            {detectedHint && (
              <p className="mt-2 text-xs text-lavender-600">{detectedHint}</p>
            )}
          </div>

          <div className="rounded-xl bg-lavender-50/80 dark:bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-lavender-600 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Currently serving
            </p>
            <div className="flex flex-wrap gap-2">
              {contactConfig.servingCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setCityInput(city)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    isServingCity(cityInput) && resolveServingCity(cityInput) === city
                      ? 'bg-lavender-500 text-white'
                      : 'bg-white dark:bg-white/10 text-muted hover:text-foreground border border-border'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full !rounded-xl gap-2" disabled={submitting}>
            {submitting ? 'Checking...' : 'Continue'}
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </motion.div>
  )
}
