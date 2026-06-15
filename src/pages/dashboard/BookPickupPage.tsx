import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Package, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { ServiceType } from '../../types/database'
import { SERVICE_LABELS } from '../../types/database'
import { Button } from '../../components/ui/Button'

const SERVICES = Object.entries(SERVICE_LABELS) as [ServiceType, string][]

const TIME_SLOTS = [
  '8:00 AM – 10:00 AM',
  '10:00 AM – 12:00 PM',
  '12:00 PM – 2:00 PM',
  '2:00 PM – 4:00 PM',
  '4:00 PM – 6:00 PM',
  '6:00 PM – 8:00 PM',
]

export function BookPickupPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [serviceType, setServiceType] = useState<ServiceType>('wash_fold')
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState(TIME_SLOTS[0])
  const [address, setAddress] = useState('')
  const [itemCount, setItemCount] = useState(5)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ orderNumber: string; id: string } | null>(null)

  const defaultAddress = [profile?.address, profile?.city, profile?.pin_code]
    .filter(Boolean)
    .join(', ')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return

    setError('')
    setSubmitting(true)

    const deliveryEstimate = new Date(pickupDate)
    deliveryEstimate.setDate(deliveryEstimate.getDate() + 2)

    const { data, error: insertError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        service_type: serviceType,
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

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-10 text-center max-w-md mx-auto mt-8"
      >
        <CheckCircle className="w-14 h-14 text-lavender-500 mx-auto mb-4" />
        <h1 className="font-heading text-2xl text-foreground">Pickup Scheduled!</h1>
        <p className="text-muted mt-2 text-sm">
          Order <strong className="text-foreground">{success.orderNumber}</strong> has been created.
          We&apos;ll pick up your laundry on {pickupDate} between {pickupTime}.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate(`/dashboard/orders/${success.id}`)} className="!rounded-xl">
            Track Order
          </Button>
          <Button variant="secondary" onClick={() => navigate('/dashboard')} className="!rounded-xl">
            Go to Dashboard
          </Button>
        </div>
      </motion.div>
    )
  }

  const minDate = new Date().toISOString().split('T')[0]

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl text-foreground">Book Pickup</h1>
        <p className="text-muted mt-1">Schedule a doorstep laundry pickup</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="mt-8 glass-card rounded-2xl p-6 md:p-8 space-y-6 max-w-xl">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Service</label>
          <div className="grid grid-cols-2 gap-2">
            {SERVICES.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setServiceType(key)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${
                  serviceType === key
                    ? 'bg-lavender-500 text-white'
                    : 'bg-lavender-50 dark:bg-white/5 text-muted hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
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
          {!profile?.address && (
            <p className="text-xs text-muted mt-1">
              <a href="/dashboard/profile" className="text-lavender-600 hover:underline">
                Save address in profile
              </a>{' '}
              for faster booking next time.
            </p>
          )}
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
          {submitting ? 'Scheduling...' : 'Schedule Pickup'}
        </Button>
      </form>
    </div>
  )
}
