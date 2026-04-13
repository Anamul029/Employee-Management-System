import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Button from '../../components/ui/Button.jsx'

export default function NotFoundPage() {
  return (
    <div className="grid min-h-full place-items-center bg-slate-50 px-4 py-16 dark:bg-slate-950">
      <div className="w-full max-w-lg rounded-3xl p-8 glass text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          404
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          The page you’re looking for doesn’t exist (or was moved).
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button as={Link} to="/" variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Button>
          <Button as={Link} to="/dashboard">
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

