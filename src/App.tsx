import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { LandingPage } from './pages/LandingPage'
import { LoginPage, RegisterPage } from './pages/auth/AuthPages'
import { DashboardLayout } from './pages/dashboard/DashboardLayout'
import { OverviewPage } from './pages/dashboard/OverviewPage'
import { ProfilePage } from './pages/dashboard/ProfilePage'
import { OrdersPage } from './pages/dashboard/OrdersPage'
import { OrderDetailPage } from './pages/dashboard/OrderDetailPage'
import { BookPickupPage } from './pages/dashboard/BookPickupPage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<OverviewPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:id" element={<OrderDetailPage />} />
              <Route path="book" element={<BookPickupPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
