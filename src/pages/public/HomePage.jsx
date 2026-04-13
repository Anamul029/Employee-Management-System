import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Lock,
  Sparkles,
  Shield,
  Users,
} from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <Card className="group h-full p-6 transition-all hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white shadow-soft transition-transform group-hover:scale-[1.02]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {description}
          </p>
        </div>
      </div>
    </Card>
  )
}

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[420px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-500/30 via-fuchsia-500/20 to-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 h-[420px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500/15 via-brand-500/15 to-rose-500/15 blur-3xl" />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="animate-[fadeInUp_420ms_ease-out]">
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 ring-1 ring-brand-200 dark:bg-brand-500/15 dark:text-brand-200 dark:ring-brand-500/30">
              <Shield className="h-3.5 w-3.5" />
              Smart and simple workforce management
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
              Modern Employee Management System
              <span className="block bg-gradient-to-r from-brand-600 to-fuchsia-600 bg-clip-text text-transparent">
                for real teams
              </span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Manage employees, departments, and profiles from one clean dashboard.
              Built for HR and operations teams who need speed, clarity, and control.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button as={Link} to="/register" className="px-5">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button as={Link} to="/login" variant="secondary" className="px-5">
                Login
              </Button>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <div className="glass rounded-2xl px-4 py-3">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Built for HR & Ops
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Employee directory, departments, profiles
                </p>
              </div>
              <div className="glass rounded-2xl px-4 py-3">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Role-based UX
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Admin / Manager / Employee permissions
                </p>
              </div>
              <div className="glass rounded-2xl px-4 py-3">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Data-ready
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Persistent data with API and MongoDB
                </p>
              </div>
              <div className="glass rounded-2xl px-4 py-3">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Polished UI
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Responsive layout with modern UX
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="glass animate-[fadeIn_520ms_ease-out] rounded-3xl p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-soft">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Role-based Access
                  </p>
                  <p className="mt-1 text-lg font-black text-slate-900 dark:text-slate-100">
                    Admin / Manager / Employee
                  </p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Role-based routes and actions for controlled access.
                  </p>
                </Card>
                <Card className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-soft">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Directory UX
                  </p>
                  <p className="mt-1 text-lg font-black text-slate-900 dark:text-slate-100">
                    Search, filter, paginate
                  </p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Fast table workflows with clean empty states.
                  </p>
                </Card>
                <Card className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-soft sm:col-span-2">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Reporting-ready
                  </p>
                  <p className="mt-1 text-lg font-black text-slate-900 dark:text-slate-100">
                    Dashboard stats + simple charts
                  </p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Quick insights from employee and department activity.
                  </p>
                </Card>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-500/20 blur-2xl" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon={Users}
            title="Employee Management"
            description="Search, filter, paginate, and manage employee profiles with a clean table UX."
            description="Find, add, edit, and manage employee records with fast table workflows."
          />
          <FeatureCard
            icon={Building2}
            title="Departments"
            description="Organize teams by department and keep your structure clean and up to date."
          />
          <FeatureCard
            icon={Shield}
            title="Protected Experience"
            description="Only authorized roles can access sensitive actions and dashboard modules."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-200 dark:bg-brand-500/15 dark:text-brand-200 dark:ring-brand-500/30">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Typical EMS workflow
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Designed around the tasks teams perform every day.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  {[
                    'Create departments and keep org structure clean',
                    'Add employees with validated forms and photo upload',
                    'Search and filter quickly when you need answers fast',
                    'Update employee details and keep records accurate',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-600 dark:text-brand-300" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-200 dark:bg-brand-500/15 dark:text-brand-200 dark:ring-brand-500/30">
                <Lock className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Permissions that make sense
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Clear permission levels for safer and cleaner team operations.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="glass rounded-2xl p-4">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Admin
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Full access
                    </p>
                  </div>
                  <div className="glass rounded-2xl p-4">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Manager
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Add employees
                    </p>
                  </div>
                  <div className="glass rounded-2xl p-4">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Employee
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Read-only
                    </p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
                  <p className="text-sm text-slate-700 dark:text-slate-200">
                    <span className="font-bold">Access control:</span> Admin has full control, Manager can add employees, Employee has limited access.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 rounded-3xl p-6 glass">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/60 text-brand-700 ring-1 ring-white/70 dark:bg-white/10 dark:text-brand-200 dark:ring-white/10">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Explore the dashboard
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Sign in and start managing your workforce efficiently.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button as={Link} to="/login" variant="secondary">
                Login
              </Button>
              <Button as={Link} to="/register">
                Create account <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/70 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Employee Management System
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Fullstack app with Firebase Authentication and MongoDB APIs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
              <Link to="/login" className="font-semibold text-brand-700 dark:text-brand-200">
                Login
              </Link>
              <span>•</span>
              <Link to="/register" className="font-semibold text-brand-700 dark:text-brand-200">
                Register
              </Link>
              <span>•</span>
              <span>Need help? Contact HR Admin</span>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-200/70 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
            <p>Built with React, Vite, Tailwind CSS, Firebase Auth, Express, and MongoDB.</p>
            <p className="mt-1">Use role-based access to manage employees, departments, and profiles securely.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

