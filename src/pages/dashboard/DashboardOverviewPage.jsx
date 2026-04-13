import { useMemo } from 'react'
import { BarChart3, Building2, Sparkles, Users, UserCheck } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../../components/ui/Card.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Table from '../../components/ui/Table.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { useEms } from '../../context/EmsContext.jsx'
import { formatDate } from '../../utils/format.js'

function Stat({ icon: Icon, label, value, sub }) {
  return (
    <div className="glass rounded-2xl p-5 transition-all hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/60 text-brand-700 ring-1 ring-white/70 dark:bg-white/10 dark:text-brand-200 dark:ring-white/10">
          <Icon className="h-5 w-5" />
        </div>
        <Badge variant="brand">{label}</Badge>
      </div>
      <p className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
        {value}
      </p>
      {sub ? (
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{sub}</p>
      ) : null}
    </div>
  )
}

export default function DashboardOverviewPage() {
  const { employees, departments, getDepartmentName } = useEms()

  const activeEmployees = employees.filter((e) => e.status === 'Active')
  const managersCount = employees.filter((e) => e.isManager).length

  const deptChartData = useMemo(() => {
    const counts = new Map()
    for (const d of departments) counts.set(d.id, 0)
    for (const e of employees) counts.set(e.departmentId, (counts.get(e.departmentId) || 0) + 1)
    return Array.from(counts.entries())
      .filter(([deptId]) => !!deptId)
      .map(([deptId, count]) => ({
        name: getDepartmentName(deptId),
        employees: count,
      }))
      .sort((a, b) => b.employees - a.employees)
  }, [departments, employees, getDepartmentName])

  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.hireDate) - new Date(a.hireDate))
    .slice(0, 6)

  const columns = [
    {
      key: 'fullName',
      header: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatarUrl}
            alt={row.fullName}
            className="h-9 w-9 rounded-2xl object-cover ring-1 ring-slate-200/70 dark:ring-white/10"
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
    {
      key: 'departmentId',
      header: 'Department',
      render: (row) => getDepartmentName(row.departmentId),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'neutral'}>
          {row.status}
        </Badge>
      ),
    },
    { key: 'hireDate', header: 'Hire Date', render: (row) => formatDate(row.hireDate) },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Overview
        </p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Quick stats, recent activity, and a simple department chart.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Users} label="Total Employees" value={employees.length} sub="All records" />
        <Stat
          icon={Building2}
          label="Departments"
          value={departments.length}
          sub="Org structure"
        />
        <Stat
          icon={UserCheck}
          label="Active Employees"
          value={activeEmployees.length}
          sub="Currently active"
        />
        <Stat icon={Sparkles} label="Managers" value={managersCount} sub="Leadership count" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Recent Employees
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Latest hires (dummy data)
              </p>
            </div>
            <Badge variant="neutral">{recentEmployees.length} shown</Badge>
          </div>
          <div className="mt-4">
            <Table
              columns={columns}
              rows={recentEmployees}
              empty={<EmptyState title="No employees yet" />}
            />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-200 dark:bg-brand-500/15 dark:text-brand-200 dark:ring-brand-500/30">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Employees by Dept
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Simple bar chart (Recharts)
              </p>
            </div>
          </div>

          <div className="mt-4 h-72">
            {deptChartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptChartData} margin={{ left: -10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.35)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 14,
                      border: '1px solid rgba(148,163,184,0.25)',
                      background: 'rgba(15,23,42,0.92)',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="employees" fill="#4f46e5" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                title="No department data"
                description="Add employees and departments to populate the chart."
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

