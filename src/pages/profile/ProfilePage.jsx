import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { ImagePlus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export default function ProfilePage() {
  const { auth, updateProfile } = useAuth()
  const user = auth?.user

  const [form, setForm] = useState(() => ({
    fullName: user?.fullName || '',
    email: user?.email || '',
    avatarUrl: user?.avatarUrl || '',
  }))
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setForm({
      fullName: user?.fullName || '',
      email: user?.email || '',
      avatarUrl: user?.avatarUrl || '',
    })
  }, [user?.id, user?.fullName, user?.email, user?.avatarUrl])

  const preview = useMemo(
    () => form.avatarUrl || 'https://i.pravatar.cc/150?img=8',
    [form.avatarUrl],
  )

  function validate(next) {
    const e = {}
    if (!next.fullName?.trim()) e.fullName = 'Full name is required.'
    if (!next.email?.includes('@')) e.email = 'Valid email is required.'
    return e
  }

  async function onSubmit(ev) {
    ev.preventDefault()
    const e = validate(form)
    setErrors(e)
    if (Object.keys(e).length) return

    setBusy(true)
    try {
      await updateProfile({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        avatarUrl: form.avatarUrl,
      })
      toast.success('Profile updated')
    } catch (error) {
      toast.error(error?.message || 'Failed to update profile')
    } finally {
      setBusy(false)
    }
  }

  async function onAvatarChange(file) {
    if (!file) return
    if (!file.type?.startsWith('image/')) {
      toast.error('Please select an image file.')
      return
    }
    const url = await fileToDataUrl(file)
    setForm((p) => ({ ...p, avatarUrl: url }))
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Profile
        </p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Your Profile
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Update your personal details (stored in localStorage).
        </p>
      </div>

      <form className="grid gap-4 xl:grid-cols-3" onSubmit={onSubmit}>
        <Card className="p-5 xl:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full name"
              value={form.fullName}
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
              error={errors.fullName}
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              error={errors.email}
            />
            <Input
              label="Role"
              value={user?.role || '—'}
              disabled
              hint="Role is set during login/register for this demo."
            />
            <Input label="User ID" value={user?.id || '—'} disabled />
          </div>

          <div className="mt-5 flex justify-end border-t border-slate-200/70 pt-5 dark:border-white/10">
            <Button type="submit" disabled={busy}>
              {busy ? 'Saving…' : 'Save profile'}
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
            Profile image
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Upload a new image for your account.
          </p>

          <div className="mt-4 flex items-center gap-4">
            <img
              src={preview}
              alt="Profile preview"
              className="h-16 w-16 rounded-3xl object-cover ring-1 ring-slate-200/70 dark:ring-white/10"
            />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200/60 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-white/15">
              <ImagePlus className="h-4 w-4" />
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onAvatarChange(e.target.files?.[0])}
              />
            </label>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Tip
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Try toggling dark mode in the top navbar.
            </p>
          </div>
        </Card>
      </form>
    </div>
  )
}

