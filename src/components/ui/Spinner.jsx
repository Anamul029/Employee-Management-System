import clsx from 'clsx'

export default function Spinner({ className, size = 'md' }) {
  const s = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-7 w-7' : 'h-5 w-5'
  return (
    <div
      className={clsx(
        'inline-block animate-spin rounded-full border-2 border-slate-200 border-t-brand-600 dark:border-white/15 dark:border-t-brand-400',
        s,
        className,
      )}
      aria-label="Loading"
      role="status"
    />
  )
}

