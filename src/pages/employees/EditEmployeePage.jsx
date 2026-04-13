import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ImagePlus } from 'lucide-react'
import { useEms } from '../../context/EmsContext.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Input from '../../components/ui/Input.jsx'

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export default function EditEmployeePage() {
  const { id } = useParams()
  const { employees, departments, updateEmployee } = useEms()
  const navigate = useNavigate()

  const employee = employees.find((e) => e.id === id)

  const [form, setForm] = useState(() =>
    employee
      ? {
          fullName: employee.fullName || '',
          email: employee.email || '',
          phone: employee.phone || '',
          title: employee.title || '',
          departmentId: employee.departmentId || departments[0]?.id || '',
          salary: String(employee.salary ?? ''),
          hireDate: employee.hireDate || '',
          status: employee.status || 'Active',
          isManager: Boolean(employee.isManager),
          avatarUrl: employee.avatarUrl || '',
        }
      : null,
  )
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const preview = useMemo(() => form?.avatarUrl || 'https://i.pravatar.cc/150?img=24', [form])

  if (!employee || !form) {
    return (
      <EmptyState
        title="Employee not found"
        description="This record may have been deleted."
        actionLabel="Back to employees"
        onAction={() => navigate('/dashboard/employees')}
      />
    )
  }

  function validate(next) {
    const e = {}
    if (!next.fullName?.trim()) e.fullName = 'Full name is required.'
    if (!next.email?.includes('@')) e.email = 'Valid email is required.'
    if (!next.title?.trim()) e.title = 'Job title is required.'
    if (!next.departmentId) e.departmentId = 'Department is required.'
    if (!next.hireDate) e.hireDate = 'Hire date is required.'
    const salaryNum = Number(next.salary)
    if (!salaryNum || salaryNum < 1) e.salary = 'Enter a valid salary.'
    return e
  }

  async function onSubmit(ev) {
    ev.preventDefault()
    const e = validate(form)
    setErrors(e)
    if (Object.keys(e).length) return

    setBusy(true)
    try {
      await updateEmployee(employee.id, {
        ...form,
        salary: Number(form.salary),
      })
      toast.success('Employee updated')
      navigate('/dashboard/employees')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update employee')
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
          Employees
        </p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Edit Employee
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Update the employee record (dummy CRUD stored in localStorage).
        </p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-4 xl:grid-cols-3">
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
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              hint="Optional"
            />
            <Input
              label="Job title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              error={errors.title}
            />

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Department
              </label>
              <select
                className="w-full rounded-xl bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500/40 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10"
                value={form.departmentId}
                onChange={(e) => setForm((p) => ({ ...p, departmentId: e.target.value }))}
              >
                <option value="" disabled>
                  Select department
                </option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.departmentId ? (
                <p className="text-xs font-medium text-rose-600">{errors.departmentId}</p>
              ) : null}
            </div>

            <Input
              label="Salary (USD)"
              type="number"
              value={form.salary}
              onChange={(e) => setForm((p) => ({ ...p, salary: e.target.value }))}
              error={errors.salary}
              min={1}
            />

            <Input
              label="Hire date"
              type="date"
              value={form.hireDate}
              onChange={(e) => setForm((p) => ({ ...p, hireDate: e.target.value }))}
              error={errors.hireDate}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/70 pt-5 dark:border-white/10">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500/40 dark:border-white/20"
                checked={form.isManager}
                onChange={(e) => setForm((p) => ({ ...p, isManager: e.target.checked }))}
              />
              Mark as manager
            </label>

            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
            Profile image
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Upload an image to preview instantly.
          </p>

          <div className="mt-4 flex items-center gap-4">
            <img
              src={preview}
              alt="Preview"
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
        </Card>
      </form>
    </div>
  )
}

