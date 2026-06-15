import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { Order } from '../../types/database'
import { SERVICE_LABELS, STATUS_LABELS } from '../../types/database'
import { OrderTracker } from '../../components/dashboard/OrderTracker'

export function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  useEffect(() => {
    if (!user) return

    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) ?? [])
        setLoading(false)
      })
  }, [user])

  const filtered = orders.filter((o) => {
    if (filter === 'active') return !['delivered', 'cancelled'].includes(o.status)
    if (filter === 'completed') return o.status === 'delivered'
    return true
  })

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl text-foreground">Order History</h1>
        <p className="text-muted mt-1">View and track all your laundry orders</p>
      </motion.div>

      <div className="mt-6 flex gap-2">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-lavender-500 text-white'
                : 'bg-lavender-100/80 dark:bg-white/5 text-muted hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-lavender-100/50 dark:bg-white/5 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center">
            <Package className="w-10 h-10 text-lavender-300 mx-auto mb-3" />
            <p className="text-muted">No orders found.</p>
            <Link to="/dashboard/book" className="text-lavender-600 text-sm font-medium hover:underline mt-2 inline-block">
              Book a pickup
            </Link>
          </div>
        ) : (
          filtered.map((order) => (
            <Link
              key={order.id}
              to={`/dashboard/orders/${order.id}`}
              className="block glass-card rounded-xl p-5 hover:shadow-glow transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{order.order_number}</p>
                  <p className="text-sm text-muted mt-0.5">
                    {SERVICE_LABELS[order.service_type]} · {order.item_count} items
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Pickup: {order.pickup_date} at {order.pickup_time}
                  </p>
                </div>
                <span
                  className={`self-start text-xs font-semibold px-3 py-1 rounded-full ${
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
              <div className="mt-4">
                <OrderTracker status={order.status} compact />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
