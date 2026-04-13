import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useEms } from '../../context/EmsContext.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Input from '../../components/ui/Input.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Badge from '../../components/ui/Badge.jsx'

export default function DepartmentsPage() {
  const { departments, employees, addDepartment, deleteDepartment } = useEms()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [confirmId, setConfirmId] = useState(null)

  const counts = useMemo(() => {
    const m = new Map()
    for (const d of departments) m.set(d.id, 0)
    for (const e of employees) m.set(e.departmentId, (m.get(e.departmentId) || 0) + 1)
    return m
  }, [departments, employees])

  async function onAdd() {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Department name is required.')
      return
    }
    const exists = departments.some((d) => d.name.toLowerCase() === trimmed.toLowerCase())
    if (exists) {
      setError('A department with that name already exists.')
      return
    }
    try {
      await addDepartment(trimmed)
      toast.success('Department added')
      setName('')
      setError('')
      setOpen(false)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add department')
    }
  }

  async function onDeleteConfirmed() {
    if (!confirmId) return
    try {
      await deleteDepartment(confirmId)
      setConfirmId(null)
      toast.success('Department deleted')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete department')
    }
  }

  const confirmDept = departments.find((d) => d.id === confirmId)
  const confirmCount = confirmDept ? counts.get(confirmDept.id) || 0 : 0

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Departments
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Departments
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Manage departments with a clean modal workflow.
          </p>
        </div>

        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      {departments.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {departments.map((d) => (
            <Card key={d.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {d.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Employees:{' '}
                    <span className="font-semibold">{counts.get(d.id) || 0}</span>
                  </p>
                </div>
                <button
                  className="grid h-10 w-10 place-items-center rounded-2xl text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                  onClick={() => setConfirmId(d.id)}
                  aria-label="Delete department"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4">
                <Badge variant="neutral">ID: {d.id}</Badge>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No departments yet"
          description="Add a department to start organizing employees."
          actionLabel="Add department"
          onAction={() => setOpen(true)}
        />
      )}

      <Modal
        open={open}
        title="Add Department"
        description="Create a new department (dummy data stored in localStorage)."
        onClose={() => {
          setOpen(false)
          setError('')
        }}
      >
        <div className="space-y-4">
          <Input
            label="Department name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            error={error}
            placeholder="e.g. Customer Success"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onAdd}>Add</Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!confirmId}
        title="Delete department?"
        description="Employees in this department will be left without a department in this demo."
        onClose={() => setConfirmId(null)}
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {confirmDept?.name || 'Department'}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Affected employees: <span className="font-semibold">{confirmCount}</span>
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onDeleteConfirmed}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

