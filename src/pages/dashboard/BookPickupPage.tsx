import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  MapPin,
  Package,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Star,
  AlertCircle,
  IndianRupee,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { contactConfig } from '../../config/contact'
import { formatPrice } from '../../lib/location'
import type { Laundry, LaundryService, ServiceType } from '../../types/database'
import { Button } from '../../components/ui/Button'

const TIME_SLOTS = [
  '8:00 AM – 10:00 AM',
  '10:00 AM – 12:00 PM',
  '12:00 PM – 2:00 PM',
  '2:00 PM – 4:00 PM',
  '4:00 PM – 6:00 PM',
  '6:00 PM – 8:00 PM',
]

type Step = 'laundry' | 'service' | 'schedule'

export function BookPickupPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('laundry')
  const [laundries, setLaundries] = useState<Laundry[]>([])
  const [services, setServices] = useState<LaundryService[]>([])
  const [loadingLaundries, setLoadingLaundries] = useState(true)
  const [loadingServices, setLoadingServices] = useState(false)
  const [selectedLaundry, setSelectedLaundry] = useState<Laundry | null>(null)
  const [selectedService, setSelectedService] = useState<LaundryService | null>(null)
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState(TIME_SLOTS[0])
  const [address, setAddress] = useState('')
  const [itemCount, setItemCount] = useState(5)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ orderNumber: string; id: string } | null>(null)

  const deliveryCharge = contactConfig.deliveryCharge
  const servicePrice = selectedService?.price ?? 0
  const totalAmount = servicePrice + deliveryCharge

  const defaultAddress = [profile?.address, profile?.city, profile?.pin_code]
    .filter(Boolean)
    .join(', ')

  const userCity = profile?.city ?? ''
  const isServed = profile?.location_status === 'served'

  useEffect(() => {
    if (!userCity || !isServed) {
      setLoadingLaundries(false)
      return
    }

    supabase
      .from('laundries')
      .select('*')
      .eq('city', userCity)
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message)
        setLaundries((data as Laundry[]) ?? [])
        setLoadingLaundries(false)
      })
  }, [userCity, isServed])

  useEffect(() => {
    if (!selectedLaundry) return

    setLoadingServices(true)
    supabase
      .from('laundry_services')
      .select('*')
      .eq('laundry_id', selectedLaundry.id)
      .eq('is_active', true)
      .order('price', { ascending: true })
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message)
        setServices((data as LaundryService[]) ?? [])
        setLoadingServices(false)
      })
  }, [selectedLaundry])

  const handleSelectLaundry = (laundry: Laundry) => {
    setSelectedLaundry(laundry)
    setSelectedService(null)
    setStep('service')
    setError('')
  }

  const handleSelectService = (service: LaundryService) => {
    setSelectedService(service)
    setStep('schedule')
    setError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user || !selectedLaundry || !selectedService) return

    setError('')
    setSubmitting(true)

    const deliveryEstimate = new Date(pickupDate)
    deliveryEstimate.setDate(deliveryEstimate.getDate() + 2)

    const { data, error: insertError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        service_type: selectedService.service_type as ServiceType,
        laundry_id: selectedLaundry.id,
        laundry_service_id: selectedService.id,
        laundry_name: selectedLaundry.name,
        service_name: selectedService.name,
        service_price: selectedService.price,
        delivery_charge: deliveryCharge,
        total_amount: totalAmount,
        pickup_date: pickupDate,
        pickup_time: pickupTime,
        address: address || defaultAddress,
        item_count: itemCount,
        notes: notes || null,
        estimated_delivery: deliveryEstimate.toISOString(),
      })
      .select('id, order_number')
      .single()

    setSubmitting(false)

    if (insertError) {
      setError(insertError.message)
    } else if (data) {
      const order = data as { id: string; order_number: string }
      setSuccess({ orderNumber: order.order_number, id: order.id })
    }
  }

  if (!isServed) {
    return (
      <div className="glass-card rounded-2xl p-8 md:p-10 text-center max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-lavender-400 mx-auto mb-4" />
        <h1 className="font-heading text-2xl text-foreground">Booking unavailable</h1>
        <p className="text-muted mt-3 text-sm leading-relaxed">
          We&apos;re not serving {profile?.city ?? 'your city'} yet. We&apos;ll be live soon!
        </p>
        <Link to="/dashboard/location">
          <Button variant="secondary" className="mt-6 !rounded-xl">
            Change location
          </Button>
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-10 text-center max-w-md mx-auto mt-4"
      >
        <CheckCircle className="w-14 h-14 text-lavender-500 mx-auto mb-4" />
        <h1 className="font-heading text-2xl text-foreground">Pickup Scheduled!</h1>
        <p className="text-muted mt-2 text-sm">
          Order <strong className="text-foreground">{success.orderNumber}</strong> has been placed with{' '}
          <strong className="text-foreground">{selectedLaundry?.name}</strong>.
        </p>
        <p className="text-sm text-muted mt-2">
          Total: {formatPrice(totalAmount)} (incl. {formatPrice(deliveryCharge)} delivery)
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate(`/dashboard/orders/${success.id}`)} className="!rounded-xl">
            View Order
          </Button>
          <Button variant="secondary" onClick={() => navigate('/dashboard')} className="!rounded-xl">
            Go to Dashboard
          </Button>
        </div>
      </motion.div>
    )
  }

  const minDate = new Date().toISOString().split('T')[0]

  const stepLabels: Record<Step, string> = {
    laundry: 'Choose laundry',
    service: 'Choose service',
    schedule: 'Schedule pickup',
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl text-foreground">Book Pickup</h1>
        <p className="text-muted mt-1">
          Laundries in <span className="text-foreground font-medium">{userCity}</span>
        </p>
      </motion.div>

      {/* Step indicator */}
      <div className="mt-6 flex items-center gap-2 text-sm">
        {(['laundry', 'service', 'schedule'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <span className="text-muted">→</span>}
            <span
              className={
                step === s
                  ? 'font-semibold text-lavender-600'
                  : 'text-muted'
              }
            >
              {i + 1}. {stepLabels[s]}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm max-w-2xl">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'laundry' && (
          <motion.div
            key="laundry"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="mt-8"
          >
            {loadingLaundries ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-36 rounded-2xl bg-lavender-100/50 animate-pulse" />
                ))}
              </div>
            ) : laundries.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 text-center max-w-lg">
                <Package className="w-10 h-10 text-lavender-300 mx-auto mb-3" />
                <p className="text-muted text-sm">
                  No laundries listed in {userCity} yet. Our team is adding partners soon.
                </p>
                <p className="text-xs text-muted mt-2">
                  Contact {contactConfig.email} to get listed.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {laundries.map((laundry) => (
                  <button
                    key={laundry.id}
                    type="button"
                    onClick={() => handleSelectLaundry(laundry)}
                    className="glass-card rounded-2xl p-5 text-left hover:shadow-glow transition-shadow group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-lavender-600 transition-colors">
                          {laundry.name}
                        </h3>
                        {laundry.address && (
                          <p className="text-sm text-muted mt-1 flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            {laundry.address}
                          </p>
                        )}
                      </div>
                      {laundry.rating != null && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full shrink-0">
                          <Star className="w-3 h-3 fill-current" />
                          {laundry.rating}
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm text-lavender-600 font-medium mt-4">
                      View services <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {step === 'service' && selectedLaundry && (
          <motion.div
            key="service"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="mt-8"
          >
            <button
              type="button"
              onClick={() => setStep('laundry')}
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to laundries
            </button>

            <p className="text-sm text-muted mb-4">
              Services at <span className="font-medium text-foreground">{selectedLaundry.name}</span>
            </p>

            {loadingServices ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 rounded-xl bg-lavender-100/50 animate-pulse" />
                ))}
              </div>
            ) : services.length === 0 ? (
              <p className="text-muted text-sm">No services available for this laundry.</p>
            ) : (
              <div className="space-y-3 max-w-xl">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleSelectService(service)}
                    className="w-full glass-card rounded-xl p-4 text-left hover:shadow-glow transition-shadow flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{service.name}</p>
                      {service.description && (
                        <p className="text-sm text-muted mt-0.5">{service.description}</p>
                      )}
                    </div>
                    <span className="font-heading text-lg text-lavender-600 shrink-0">
                      {formatPrice(service.price)}
                      <span className="text-xs text-muted font-normal">/{service.price_unit}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {step === 'schedule' && selectedLaundry && selectedService && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="mt-8"
          >
            <button
              type="button"
              onClick={() => setStep('service')}
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to services
            </button>

            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 space-y-6 max-w-xl">
              {/* Order summary */}
              <div className="rounded-xl bg-lavender-50/80 dark:bg-white/5 p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-lavender-600">Order summary</p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">{selectedLaundry.name} · {selectedService.name}</span>
                  <span className="font-medium text-foreground">{formatPrice(servicePrice)}/{selectedService.price_unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5" /> Delivery charge
                  </span>
                  <span className="font-medium text-foreground">{formatPrice(deliveryCharge)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border font-semibold">
                  <span className="text-foreground">Estimated total</span>
                  <span className="text-lavender-600">{formatPrice(totalAmount)}</span>
                </div>
                <p className="text-xs text-muted">Final amount may vary based on actual weight/items at pickup.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pickupDate" className="block text-sm font-medium text-foreground mb-1.5">
                    Pickup Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      id="pickupDate"
                      type="date"
                      required
                      min={minDate}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="pickupTime" className="block text-sm font-medium text-foreground mb-1.5">
                    Time Slot
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <select
                      id="pickupTime"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400 appearance-none"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="bookAddress" className="block text-sm font-medium text-foreground mb-1.5">
                  Pickup Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-muted" />
                  <textarea
                    id="bookAddress"
                    rows={2}
                    required
                    value={address || defaultAddress}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400 resize-none"
                    placeholder="Enter pickup address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="itemCount" className="block text-sm font-medium text-foreground mb-1.5">
                  Approx. Item Count
                </label>
                <div className="relative">
                  <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    id="itemCount"
                    type="number"
                    min={1}
                    max={100}
                    value={itemCount}
                    onChange={(e) => setItemCount(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-1.5">
                  Special Instructions (optional)
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400 resize-none"
                  placeholder="Stain on blue shirt, handle with care..."
                />
              </div>

              <Button type="submit" className="w-full !rounded-xl" disabled={submitting}>
                {submitting ? 'Placing order...' : `Confirm Pickup · ${formatPrice(totalAmount)}`}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
