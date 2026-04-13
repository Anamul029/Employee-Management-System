import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ROLES } from '../../utils/constants.js'
import { useAuth } from '../../context/AuthContext.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import Card from '../../components/ui/Card.jsx'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    role: ROLES.EMPLOYEE,
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  function validate(next) {
    const e = {}
    if (!next.fullName?.trim()) e.fullName = 'Full name is required.'
    if (!next.email?.includes('@')) e.email = 'Enter a valid email.'
    if (!next.password || next.password.length < 3)
      e.password = 'Use at least 3 characters (dummy validation).'
    return e
  }

  async function onSubmit(ev) {
    ev.preventDefault()
    const e = validate(form)
    setErrors(e)
    if (Object.keys(e).length) return

    setBusy(true)
    try {
      await register(form)
      toast.success('Account created!')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      toast.error(error?.message || 'Registration failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 lg:grid-cols-2">
      <div className="space-y-4">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Create your EMS account
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          This is a UI-only project for now. Registration saves your role to
          localStorage and unlocks the dashboard.
        </p>
        <div className="rounded-2xl p-5 glass">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Tip
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Choose <span className="font-semibold">Admin</span> to access edit/delete actions.
          </p>
        </div>
      </div>

      <Card className="p-6 sm:p-8">
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            label="Full name"
            name="fullName"
            value={form.fullName}
            onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
            error={errors.fullName}
            autoComplete="name"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            error={errors.email}
            autoComplete="email"
          />
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Role
            </label>
            <select
              className="w-full rounded-xl bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500/40 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10"
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
            >
              {Object.values(ROLES).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            error={errors.password}
            autoComplete="new-password"
          />

          <Button className="w-full" type="submit" disabled={busy}>
            {busy ? 'Creating…' : 'Create account'}
          </Button>

          <p className="text-center text-sm text-slate-600 dark:text-slate-300">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-700 dark:text-brand-200">
              Sign in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}

