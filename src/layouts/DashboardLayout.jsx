import { useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  User,
  Users,
  Moon,
  Sun,
} from 'lucide-react'
import clsx from 'clsx'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { ROLES } from '../utils/constants.js'

function RoleBadge({ role }) {
  const variant =
    role === ROLES.ADMIN ? 'brand' : role === ROLES.MANAGER ? 'success' : 'neutral'
  return <Badge variant={variant}>{role}</Badge>
}

export default function DashboardLayout() {
  const { auth, logout, theme, toggleTheme } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const role = auth?.user?.role

  const navItems = useMemo(
    () => [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/dashboard/employees', label: 'Employees', icon: Users },
      ...(role === ROLES.EMPLOYEE
        ? []
        : [{ to: '/dashboard/employees/add', label: 'Add Employee', icon: PlusCircle }]),
      { to: '/dashboard/departments', label: 'Departments', icon: Building2 },
      { to: '/dashboard/profile', label: 'Profile', icon: User },
    ],
    [role],
  )

  async function onLogout() {
    try {
      await logout()
      toast.success('Logged out')
      navigate('/')
    } catch (error) {
      toast.error(error?.message || 'Logout failed')
    }
  }

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-full max-w-[1400px]">
        <aside
          className={clsx(
            'fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/50',
            'transition-transform duration-200',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            'lg:static lg:translate-x-0',
          )}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-2xl bg-brand-600 text-white shadow-soft">
                <span className="text-sm font-black">E</span>
              </div>
              <div className="leading-tight">
                <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  EMS
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dashboard
                </p>
              </div>
            </Link>

            <button
              className="grid h-9 w-9 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>

          <nav className="px-3 py-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition-colors',
                        isActive
                          ? 'bg-brand-600 text-white shadow-soft'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10',
                      )
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                )
              })}
            </div>

            <div className="mt-6 rounded-2xl p-4 glass">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Signed in as
              </p>
              <p className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                {auth?.user?.fullName}
              </p>
              <div className="mt-2">
                <RoleBadge role={auth?.user?.role} />
              </div>
            </div>

            <div className="mt-3">
              <button
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </nav>
        </aside>

        {sidebarOpen ? (
          <button
            className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close overlay"
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40">
            <div className="flex h-16 items-center justify-between gap-3 px-4 lg:px-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  className="h-10 w-10 rounded-2xl p-0 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Welcome back, {auth?.user?.fullName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Role-based dashboard experience
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <RoleBadge role={auth?.user?.role} />
                <Button
                  variant="secondary"
                  className="h-10 w-10 rounded-2xl p-0"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="secondary" onClick={onLogout} className="hidden sm:inline-flex">
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 lg:px-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

