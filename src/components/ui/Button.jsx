import clsx from 'clsx'

const styles = {
  base: 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:opacity-50 disabled:cursor-not-allowed',
  primary:
    'bg-brand-600 text-white shadow-soft hover:bg-brand-700 active:scale-[0.99]',
  secondary:
    'bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-slate-800',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.99]',
}

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  className,
  ...props
}) {
  return (
    <Comp className={clsx(styles.base, styles[variant], className)} {...props} />
  )
}

