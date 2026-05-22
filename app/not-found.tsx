import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-2 font-mono text-xs text-slate-500 dark:text-slate-400">bash — 80x24</span>
          </div>

          {/* Terminal body */}
          <div className="p-6 font-mono text-sm">
            <p className="text-slate-400 dark:text-slate-500">
              <span className="text-accent-500">~</span>{' '}
              <span className="text-slate-600 dark:text-slate-400">curl</span>{' '}
              <span className="text-slate-500">this/page</span>
            </p>

            <p className="mt-3 text-red-500 dark:text-red-400 font-semibold">
              404 Not Found
            </p>

            <p className="mt-1 text-slate-500 dark:text-slate-400">
              curl: (22) The requested URL returned error: 404
            </p>

            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              <p>{'>'} HTTP/2 404</p>
              <p>{'>'} content-type: text/html</p>
              <p className="text-red-400 mt-1">
                {'<'} error: page does not exist
              </p>
            </div>

            <p className="mt-5 text-slate-400 dark:text-slate-500">
              <span className="text-accent-500">~</span>{' '}
              <span className="text-slate-600 dark:text-slate-400">cd</span>{' '}
              <Link
                href="/"
                className="text-accent-600 dark:text-accent-400 hover:underline underline-offset-2"
              >
                ~/home
              </Link>
              <span className="cursor-blink text-slate-400 dark:text-slate-500 ml-1">▌</span>
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-600 font-mono">
          exit code 1 · page not found
        </p>
      </div>
    </div>
  )
}
