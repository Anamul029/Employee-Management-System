import clsx from 'clsx'

export default function Card({ className, children }) {
  return (
    <div
      className={clsx(
        'rounded-2xl bg-white shadow-soft ring-1 ring-slate-200/60 dark:bg-slate-900 dark:ring-white/10',
        className,
      )}
    >
      {children}
    </div>
  )
}

