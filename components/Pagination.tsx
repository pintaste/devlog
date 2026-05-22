import Link from 'next/link'

interface PaginationProps {
  page: number
  totalPages: number
  basePath: string
  query?: Record<string, string>
}

export function Pagination({ page, totalPages, basePath, query = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  function buildUrl(p: number) {
    const params = new URLSearchParams({ ...query, page: String(p) })
    return `${basePath}?${params.toString()}`
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => {
    return p === 1 || p === totalPages || Math.abs(p - page) <= 2
  })

  return (
    <nav className="flex items-center justify-center gap-1 mt-12" aria-label="Pagination">
      <Link
        href={buildUrl(page - 1)}
        className={`px-3 py-1.5 rounded-md text-sm font-mono transition-colors ${
          page <= 1
            ? 'pointer-events-none text-slate-300 dark:text-slate-700'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
        aria-disabled={page <= 1}
      >
        ← prev
      </Link>

      {pages.map((p, i) => {
        const prev = pages[i - 1]
        return (
          <span key={p} className="flex items-center gap-1">
            {prev && p - prev > 1 && (
              <span className="px-1 text-slate-400 dark:text-slate-600 font-mono text-sm">…</span>
            )}
            <Link
              href={buildUrl(p)}
              className={`min-w-[2rem] h-8 flex items-center justify-center rounded-md text-sm font-mono transition-colors ${
                p === page
                  ? 'bg-accent-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {p}
            </Link>
          </span>
        )
      })}

      <Link
        href={buildUrl(page + 1)}
        className={`px-3 py-1.5 rounded-md text-sm font-mono transition-colors ${
          page >= totalPages
            ? 'pointer-events-none text-slate-300 dark:text-slate-700'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
        aria-disabled={page >= totalPages}
      >
        next →
      </Link>
    </nav>
  )
}
