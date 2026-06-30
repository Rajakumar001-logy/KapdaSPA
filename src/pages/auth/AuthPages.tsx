import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { Logo } from '../../components/ui/Logo'
import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { supabase } from '../../lib/supabase'
import { GoogleSignInButton, AuthDivider } from '../../components/auth/GoogleSignInButton'

function getPostAuthPath(fallback: string): string {
  const stored = sessionStorage.getItem('kapdaspa-auth-redirect')
  if (stored) {
    sessionStorage.removeItem('kapdaspa-auth-redirect')
    return stored
  }
  return fallback
}

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? '/dashboard'

  useEffect(() => {
    if (user) navigate(getPostAuthPath(from), { replace: true })
  }, [user, from, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: err } = await signIn(email, password)
    setSubmitting(false)
    if (err) {
      setError(err)
    } else {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-lavender-50 via-white to-lavender-50/50 dark:from-surface dark:via-surface-muted dark:to-surface px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-10">
          <h1 className="font-heading text-3xl text-foreground text-center">Welcome back</h1>
          <p className="text-muted text-center mt-2 text-sm">Sign in to manage your laundry</p>

          <div className="mt-8">
            <GoogleSignInButton redirectTo={from} label="Sign in with Google" />
          </div>

          <AuthDivider />

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  state={{ email }}
                  className="text-xs text-lavender-600 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" className="w-full !rounded-xl" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign In'}
              {!submitting && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-lavender-600 font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { signUp, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate(getPostAuthPath('/dashboard'), { replace: true })
  }, [user, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: err } = await signUp(email, password, fullName)
    setSubmitting(false)
    if (err) {
      setError(err)
    } else {
      setSuccess(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-lavender-50 via-white to-lavender-50/50 dark:from-surface dark:via-surface-muted dark:to-surface px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-10">
          {success ? (
            <div className="text-center">
              <h1 className="font-heading text-2xl text-foreground">Check your email</h1>
              <p className="text-muted mt-3 text-sm leading-relaxed">
                We sent a confirmation link to <strong className="text-foreground">{email}</strong>.
                Click it to activate your account, then sign in.
              </p>
              <Link to="/login">
                <Button className="mt-6 !rounded-xl">Go to Sign In</Button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-3xl text-foreground text-center">Create account</h1>
              <p className="text-muted text-center mt-2 text-sm">Start your effortless laundry journey</p>

              <div className="mt-8">
                <GoogleSignInButton label="Sign up with Google" />
              </div>

              <AuthDivider />

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-foreground mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-sm font-medium text-foreground mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      id="reg-password"
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
                      placeholder="Min. 6 characters"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full !rounded-xl" disabled={submitting}>
                  {submitting ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted">
                Already have an account?{' '}
                <Link to="/login" className="text-lavender-600 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export function ForgotPasswordPage() {
  const location = useLocation()
  const initialEmail = (location.state as { email?: string })?.email ?? ''
  const [email, setEmail] = useState(initialEmail)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: err } = await resetPassword(email)
    setSubmitting(false)
    if (err) {
      setError(err)
    } else {
      setSuccess(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-lavender-50 via-white to-lavender-50/50 dark:from-surface dark:via-surface-muted dark:to-surface px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-10">
          {success ? (
            <div className="text-center">
              <h1 className="font-heading text-2xl text-foreground">Check your email</h1>
              <p className="text-muted mt-3 text-sm leading-relaxed">
                If an account exists for <strong className="text-foreground">{email}</strong>, we sent a
                password reset link. Click it to choose a new password.
              </p>
              <Link to="/login">
                <Button className="mt-6 !rounded-xl">Back to Sign In</Button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-3xl text-foreground text-center">Forgot password?</h1>
              <p className="text-muted text-center mt-2 text-sm">
                Enter your email and we&apos;ll send you a reset link
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-foreground mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full !rounded-xl" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send reset link'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted">
                Remember your password?{' '}
                <Link to="/login" className="text-lavender-600 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [ready, setReady] = useState(false)
  const [linkExpired, setLinkExpired] = useState(false)
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const isRecoveryLink =
      window.location.hash.includes('type=recovery') ||
      window.location.search.includes('type=recovery')

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })

    if (isRecoveryLink) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) setReady(true)
      })
    }

    const timeout = setTimeout(() => setLinkExpired(true), 8000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)
    const { error: err } = await updatePassword(password)
    setSubmitting(false)

    if (err) {
      setError(err)
    } else {
      navigate('/dashboard', { replace: true })
    }
  }

  if (!ready) {
    if (linkExpired) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-lavender-50 via-white to-lavender-50/50 px-5 py-12">
          <div className="glass-card rounded-3xl p-8 md:p-10 text-center max-w-md w-full">
            <h1 className="font-heading text-2xl text-foreground">Link expired or invalid</h1>
            <p className="text-muted mt-3 text-sm">
              Request a new password reset link and try again.
            </p>
            <Link to="/forgot-password">
              <Button className="mt-6 !rounded-xl">Request new link</Button>
            </Link>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-lavender-300 border-t-lavender-500 animate-spin" />
          <p className="text-sm text-muted">Verifying reset link...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-lavender-50 via-white to-lavender-50/50 dark:from-surface dark:via-surface-muted dark:to-surface px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-10">
          <h1 className="font-heading text-3xl text-foreground text-center">Set new password</h1>
          <p className="text-muted text-center mt-2 text-sm">Choose a strong password for your account</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-foreground mb-1.5">
                New password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  id="new-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
                  placeholder="Min. 6 characters"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lavender-400"
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            <Button type="submit" className="w-full !rounded-xl" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update password'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
