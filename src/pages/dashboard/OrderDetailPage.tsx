import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, MapPin, Package } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { Order } from '../../types/database'
import { orderServiceLabel, STATUS_LABELS } from '../../types/database'
import { formatPrice } from '../../lib/location'

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !id) return

    supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        setOrder(data as Order | null)
        setLoading(false)
      })
  }, [user, id])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded-lg bg-lavender-100/50 animate-pulse" />
        <div className="h-64 rounded-2xl bg-lavender-100/50 animate-pulse" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Order not found.</p>
        <Link to="/dashboard/orders" className="text-lavender-600 text-sm hover:underline mt-2 inline-block">
          Back to orders
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        to="/dashboard/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to orders
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl text-foreground">{order.order_number}</h1>
            <p className="text-muted mt-1">{orderServiceLabel(order)}</p>
            {order.laundry_name && (
              <p className="text-sm text-muted mt-0.5">via {order.laundry_name}</p>
            )}
          </div>
          <span
            className={`self-start text-sm font-semibold px-4 py-1.5 rounded-full ${
              order.status === 'delivered'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : order.status === 'cancelled'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-lavender-100 text-lavender-700 dark:bg-lavender-900/40 dark:text-lavender-300'
            }`}
          >
            {STATUS_LABELS[order.status]}
          </span>
        </div>
      </motion.div>

      <div className="mt-8 max-w-xl">
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Order Details</h2>

          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-lavender-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Pickup</p>
              <p className="text-sm text-muted">
                {order.pickup_date} · {order.pickup_time}
              </p>
            </div>
          </div>

          {order.estimated_delivery && (
            <div className="flex items-start gap-3">
              <Package className="w-4 h-4 text-lavender-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Est. Delivery</p>
                <p className="text-sm text-muted">
                  {new Date(order.estimated_delivery).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-lavender-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Address</p>
              <p className="text-sm text-muted">{order.address}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-border space-y-2">
            {order.service_price != null && (
              <p className="text-sm text-muted">
                Service: <span className="font-medium text-foreground">{formatPrice(order.service_price)}</span>
              </p>
            )}
            {order.delivery_charge != null && (
              <p className="text-sm text-muted">
                Delivery: <span className="font-medium text-foreground">{formatPrice(order.delivery_charge)}</span>
              </p>
            )}
            {order.total_amount != null && (
              <p className="text-sm font-semibold text-foreground">
                Total: {formatPrice(order.total_amount)}
              </p>
            )}
            {order.notes && (
              <p className="text-sm text-muted mt-2">
                <span className="font-medium text-foreground">Notes:</span> {order.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
