import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/** Only required before booking a pickup — not for overview, profile, or orders. */
export function BookLocationGate() {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-lavender-300 border-t-lavender-500 animate-spin" />
      </div>
    )
  }

  if (!profile?.city) {
    return <Navigate to="/dashboard/location" replace state={{ from: '/dashboard/book' }} />
  }

  return <Outlet />
}
