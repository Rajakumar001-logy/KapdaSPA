import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, PlusCircle, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import type { Order } from '../../types/database'
import { SERVICE_LABELS, STATUS_LABELS } from '../../types/database'
import { OrderTracker } from '../../components/dashboard/OrderTracker'
import { Button } from '../../components/ui/Button'

export function OverviewPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        setOrders((data as Order[]) ?? [])
        setLoading(false)
      })
  }, [user])

  const activeOrder = orders.find(
    (o) => !['delivered', 'cancelled'].includes(o.status),
  )

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl text-foreground">Dashboard</h1>
        <p className="text-muted mt-1">Manage your laundry orders and bookings</p>
      </motion.div>

      <div className="mt-8 grid gap-6">
        {/* Quick action */}
        <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-foreground">Need a pickup?</h2>
            <p className="text-sm text-muted mt-1">Schedule a new laundry pickup in under a minute.</p>
          </div>
          <Link to="/dashboard/book">
            <Button className="!rounded-xl gap-2">
              <PlusCircle className="w-4 h-4" />
              Book Pickup
            </Button>
          </Link>
        </div>

        {/* Active order tracking */}
        {activeOrder ? (
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-lavender-500">
                  Active Order
                </p>
                <h2 className="font-serif text-2xl text-foreground mt-1">{activeOrder.order_number}</h2>
                <p className="text-sm text-muted mt-1">
                  {SERVICE_LABELS[activeOrder.service_type]} · {STATUS_LABELS[activeOrder.status]}
                </p>
              </div>
              <Link
                to={`/dashboard/orders/${activeOrder.id}`}
                className="text-sm text-lavender-600 font-medium hover:underline flex items-center gap-1 shrink-0"
              >
                Details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <OrderTracker status={activeOrder.status} />
          </div>
        ) : !loading ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Package className="w-10 h-10 text-lavender-300 mx-auto mb-3" />
            <p className="text-muted">No active orders. Book your first pickup to get started!</p>
          </div>
        ) : null}

        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Orders</h2>
            <Link to="/dashboard/orders" className="text-sm text-lavender-600 hover:underline">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-lavender-100/50 dark:bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <p className="text-sm text-muted">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  to={`/dashboard/orders/${order.id}`}
                  className="block glass-card rounded-xl p-4 hover:shadow-glow transition-shadow"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">{order.order_number}</p>
                      <p className="text-sm text-muted">
                        {SERVICE_LABELS[order.service_type]} · {order.pickup_date}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
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
                  <div className="mt-3">
                    <OrderTracker status={order.status} compact />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
