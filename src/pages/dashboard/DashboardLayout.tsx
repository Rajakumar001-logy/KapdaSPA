import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, Package, User, PlusCircle, LogOut, MapPin } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Logo } from '../../components/ui/Logo'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/orders', label: 'Orders', icon: Package, end: false },
  { to: '/dashboard/book', label: 'Book Pickup', icon: PlusCircle, end: false },
  { to: '/dashboard/profile', label: 'Profile', icon: User, end: false },
]

export function DashboardLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      {/* Top bar */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          <Logo size="sm" />

          <div className="flex items-center gap-2">
            {profile?.city && (
              <Link
                to="/dashboard/location"
                className="text-xs text-muted hidden md:flex items-center gap-1 hover:text-foreground"
              >
                <MapPin className="w-3.5 h-3.5" />
                {profile.city}
              </Link>
            )}
            <span className="text-sm text-muted hidden md:block">
              Hi, {profile?.full_name?.split(' ')[0] ?? 'there'}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="p-2 rounded-full hover:bg-lavender-100 text-muted hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <nav className="lg:w-56 shrink-0">
            <ul className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
              {navItems.map((item) => (
                <li key={item.to} className="shrink-0">
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-lavender-400 text-white shadow-glow'
                          : 'text-muted hover:text-foreground hover:bg-lavender-50'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
