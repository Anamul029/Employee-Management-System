import { Link, Outlet, useLocation } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function PublicLayout() {
  const { auth } = useAuth()
  const location = useLocation()
  const onAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-brand-600 text-white shadow-soft">
              <span className="text-sm font-black">E</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                EMS
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Employee Management
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            {auth?.isAuthenticated ? (
              <Button as={Link} to="/dashboard" variant="secondary">
                Go to Dashboard
              </Button>
            ) : onAuthPage ? (
              <Button as={Link} to="/" variant="secondary">
                Back to Home
              </Button>
            ) : (
              <>
                <Button as={Link} to="/login" variant="secondary">
                  Login
                </Button>
                <Button as={Link} to="/register">
                  Get Started
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

