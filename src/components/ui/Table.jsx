import clsx from 'clsx'

export default function Table({ columns, rows, keyField = 'id', empty }) {
  if (!rows?.length) return empty || null

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200/70 dark:ring-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/70 bg-white text-sm dark:divide-white/10 dark:bg-slate-900">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={clsx(
                    'px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300',
                    c.className,
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 dark:divide-white/10">
            {rows.map((row) => (
              <tr key={row[keyField]} className="hover:bg-slate-50/70 dark:hover:bg-white/5">
                {columns.map((c) => (
                  <td key={c.key} className={clsx('px-4 py-3 text-slate-700 dark:text-slate-200', c.tdClassName)}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

