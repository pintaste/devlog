import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-sm text-slate-500 dark:text-slate-400">
            <span className="text-accent-500">©</span> {year} {siteConfig.author.name}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/feed.xml"
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors font-mono"
            >
              RSS
            </Link>
            <Link
              href={`https://github.com/${siteConfig.author.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="/about"
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
            >
              About
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-slate-400 dark:text-slate-600 font-mono">
          Built with Next.js · SQLite · Tailwind CSS
        </div>
      </div>
    </footer>
  )
}
