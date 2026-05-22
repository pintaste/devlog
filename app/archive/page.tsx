import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/db'
import type { ArchiveGroup } from '@/types'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Archive' }

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function ArchivePage() {
  const posts = getAllPosts()

  const groups: ArchiveGroup[] = []
  for (const post of posts) {
    const d = new Date(post.date)
    const year = d.getFullYear()
    const month = d.getMonth() + 1

    let yearGroup = groups.find(g => g.year === year)
    if (!yearGroup) {
      yearGroup = { year, months: [] }
      groups.push(yearGroup)
    }

    let monthGroup = yearGroup.months.find(m => m.month === month)
    if (!monthGroup) {
      monthGroup = { month, posts: [] }
      yearGroup.months.push(monthGroup)
    }

    monthGroup.posts.push(post)
  }

  groups.sort((a, b) => b.year - a.year)
  groups.forEach(g => g.months.sort((a, b) => b.month - a.month))

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Archive</h1>
        <p className="font-mono text-sm text-slate-400 dark:text-slate-500">
          {posts.length} posts across {groups.length} {groups.length === 1 ? 'year' : 'years'}
        </p>
      </div>

      <div className="space-y-10">
        {groups.map(yearGroup => (
          <section key={yearGroup.year}>
            <h2 className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mb-5 flex items-center gap-3">
              <span className="text-accent-500">//</span> {yearGroup.year}
              <span className="text-sm font-normal text-slate-400 dark:text-slate-500">
                ({yearGroup.months.reduce((a, m) => a + m.posts.length, 0)} posts)
              </span>
            </h2>

            <div className="space-y-6 pl-4 border-l-2 border-slate-200 dark:border-slate-800">
              {yearGroup.months.map(monthGroup => (
                <div key={monthGroup.month}>
                  <h3 className="text-sm font-mono font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    {MONTHS[monthGroup.month - 1]}
                  </h3>
                  <ul className="space-y-2">
                    {monthGroup.posts.map(post => (
                      <li key={post.slug} className="flex items-baseline gap-3 group">
                        <time className="shrink-0 w-10 text-xs font-mono text-slate-400 dark:text-slate-500">
                          {formatDate(post.date)}
                        </time>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors leading-snug"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}

        {groups.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">No posts yet.</p>
        )}
      </div>
    </div>
  )
}
