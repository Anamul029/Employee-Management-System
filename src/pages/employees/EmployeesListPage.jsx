import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext.jsx'
import { useEms } from '../../context/EmsContext.jsx'
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js'
import { ROLES } from '../../utils/constants.js'
import { formatCurrency, formatDate } from '../../utils/format.js'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Input from '../../components/ui/Input.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Pagination from '../../components/ui/Pagination.jsx'
import Table from '../../components/ui/Table.jsx'
import Badge from '../../components/ui/Badge.jsx'

const PAGE_SIZE = 6

export default function EmployeesListPage() {
  const { auth } = useAuth()
  const { employees, departments, getDepartmentName, deleteEmployee } = useEms()
  const navigate = useNavigate()

  const isAdmin = auth?.user?.role === ROLES.ADMIN
  const canAdd = auth?.user?.role === ROLES.ADMIN || auth?.user?.role === ROLES.MANAGER

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 250)
  const [departmentId, setDepartmentId] = useState('all')
  const [page, setPage] = useState(1)
  const [confirmId, setConfirmId] = useState(null)

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    return employees.filter((e) => {
      const matchesQuery =
        !q ||
        e.fullName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      const matchesDept = departmentId === 'all' || e.departmentId === departmentId
      return matchesQuery && matchesDept
    })
  }, [employees, debouncedQuery, departmentId])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const columns = [
    {
      key: 'fullName',
      header: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatarUrl}
            alt={row.fullName}
            className="h-10 w-10 rounded-2xl object-cover ring-1 ring-slate-200/70 dark:ring-white/10"
            loading="lazy"
          />
          <div className="min-w-0">
            <p className="truncate font-bold text-slate-900 dark:text-slate-100">
              {row.fullName}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    { key: 'title', header: 'Title' },
    { key: 'departmentId', header: 'Department', render: (row) => getDepartmentName(row.departmentId) },
    { key: 'salary', header: 'Salary', render: (row) => formatCurrency(row.salary) },
    { key: 'hireDate', header: 'Hire Date', render: (row) => formatDate(row.hireDate) },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'neutral'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      tdClassName: 'whitespace-nowrap',
      render: (row) =>
        isAdmin ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="h-9 w-9 rounded-xl p-0"
              onClick={() => navigate(`/dashboard/employees/${row.id}/edit`)}
              aria-label="Edit"
            >
              <Pencil className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              className="h-9 w-9 rounded-xl p-0 text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
              onClick={() => setConfirmId(row.id)}
              aria-label="Delete"
            >
              <Trash2 className="h-10 w-10" />
            </Button>
          </div>
        ) : (
          <span className="text-xs text-slate-500 dark:text-slate-400">—</span>
        ),
    },
  ]

  const confirmEmployee = employees.find((e) => e.id === confirmId)

  async function onDeleteConfirmed() {
    if (!confirmId) return
    try {
      await deleteEmployee(confirmId)
      setConfirmId(null)
      toast.success('Employee deleted')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete employee')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Employees
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Employee Directory
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Search, filter, and manage employees. Edit/delete are admin-only.
          </p>
        </div>

        {canAdd ? (
          <Button as={Link} to="/dashboard/employees/add" variant="primary">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        ) : null}
      </div>

      <Card className="p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="relative">
              <Input
                label="Search"
                placeholder="Search by name or email…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
                inputClassName="pl-10"
              />
              <Search className="pointer-events-none absolute left-3 top-9 h-4 w-4 text-slate-400" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Department
            </label>
            <select
              className="w-full rounded-xl bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-brand-500/40 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10"
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value)
                setPage(1)
              }}
            >
              <option value="all">All departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <Table
          columns={columns}
          rows={rows}
          empty={
            <EmptyState
              title="No employees found"
              description="Try changing your search or department filter."
              actionLabel={canAdd ? 'Add employee' : undefined}
              onAction={canAdd ? () => navigate('/dashboard/employees/add') : undefined}
            />
          }
        />
        <Pagination page={safePage} pageCount={pageCount} onPageChange={setPage} />
      </div>

      <Modal
        open={!!confirmId}
        title="Delete employee?"
        description="This action only affects dummy data stored in your browser."
        onClose={() => setConfirmId(null)}
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {confirmEmployee?.fullName || 'Employee'}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {confirmEmployee?.email}
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
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

