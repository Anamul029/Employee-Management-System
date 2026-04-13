import { useEffect } from 'react'
import clsx from 'clsx'
import { X } from 'lucide-react'
import Button from './Button.jsx'

export default function Modal({
  open,
  title,
  description,
  onClose,
  children,
  className,
}) {
  useEffect(() => {
    if (!open) return
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={clsx(
          'relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10',
          'animate-[modalIn_180ms_ease-out]',
          className,
        )}
      >
        <div className="flex items-start gap-3 border-b border-slate-200/70 p-5 dark:border-white/10">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
            {description ? (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {description}
              </p>
            ) : null}
          </div>
          <Button
            variant="ghost"
            className="h-9 w-9 rounded-xl p-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

