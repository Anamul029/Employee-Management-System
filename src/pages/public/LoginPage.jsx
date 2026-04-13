import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Card from '../../components/ui/Card.jsx'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = useMemo(() => location.state?.from || '/dashboard', [location.state])

  const [form, setForm] = useState({
    email: 'masud@gmail.com',
    password: 'aaaaa1@',
  })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  function validate(next) {
    const e = {}
    if (!next.email?.includes('@')) e.email = 'Enter a valid email.'
    if (!next.password?.trim()) e.password = 'Password is required.'
    return e
  }

  async function onSubmit(ev) {
    ev.preventDefault()
    const e = validate(form)
    setErrors(e)
    if (Object.keys(e).length) return

    setBusy(true)
    try {
      await login(form)
      toast.success('Welcome back!')
      navigate(redirectTo, { replace: true })
    } catch (error) {
      toast.error(error?.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 lg:grid-cols-2">
      <div className="space-y-4">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Sign in to your dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Login with your account email and password.
        </p>
        <div className="rounded-2xl p-5 glass">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Sign in
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Use the same credentials you used during registration.
          </p>
        </div>
      </div>

      <Card className="p-6 sm:p-8">
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            error={errors.email}
            autoComplete="email"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            error={errors.password}
            autoComplete="current-password"
          />

          <Button className="w-full" type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>

          <p className="text-center text-sm text-slate-600 dark:text-slate-300">
            New here?{' '}
            <Link to="/register" className="font-semibold text-brand-700 dark:text-brand-200">
              Create an account
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}

