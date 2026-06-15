import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function LocationGate() {
  const { profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-lavender-300 border-t-lavender-500 animate-spin" />
      </div>
    )
  }

  if (!profile?.city && location.pathname !== '/dashboard/location') {
    return <Navigate to="/dashboard/location" replace />
  }

  return <Outlet />
}
