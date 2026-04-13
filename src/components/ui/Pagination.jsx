import Button from './Button.jsx'

export default function Pagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null

  const prevDisabled = page <= 1
  const nextDisabled = page >= pageCount

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Page <span className="font-semibold">{page}</span> of{' '}
        <span className="font-semibold">{pageCount}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          disabled={prevDisabled}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          disabled={nextDisabled}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

