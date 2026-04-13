import clsx from 'clsx'

export default function Input({
  label,
  hint,
  error,
  className,
  inputClassName,
  id,
  ...props
}) {
  const inputId = id || props.name

  return (
    <div className={clsx('space-y-1', className)}>
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={clsx(
          'w-full rounded-xl bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500/40 dark:bg-slate-900 dark:text-slate-100 dark:ring-white/10',
          error && 'ring-rose-300 focus:ring-rose-500/40',
          inputClassName,
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs font-medium text-rose-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
    </div>
  )
}

