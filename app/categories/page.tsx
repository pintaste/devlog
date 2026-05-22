import type { Metadata } from 'next'
import Link from 'next/link'
import { getCategories, getPostsByCategory } from '@/lib/data'

export const metadata: Metadata = { title: 'Categories' }

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function CategoriesPage() {
  const categories = getCategories()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Categories</h1>
        <p className="font-mono text-sm text-slate-400 dark:text-slate-500">
          {categories.length} categories · {categories.reduce((a, c) => a + c.count, 0)} posts
        </p>
      </div>

      <div className="space-y-10">
        {categories.map(cat => {
          const posts = getPostsByCategory(cat.name)
          return (
            <section key={cat.name} id={encodeURIComponent(cat.name)}>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{cat.name}</h2>
                <span className="font-mono text-sm text-slate-400 dark:text-slate-500">{cat.count} posts</span>
              </div>
              <ul className="space-y-3">
                {posts.map(post => (
                  <li key={post.slug} className="flex items-baseline justify-between gap-4 group">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-slate-700 dark:text-slate-300 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors text-sm leading-snug"
                    >
                      {post.title}
                    </Link>
                    <time className="shrink-0 text-xs font-mono text-slate-400 dark:text-slate-500">
                      {formatDate(post.date)}
                    </time>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}

        {categories.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">No categories yet.</p>
        )}
      </div>
    </div>
  )
}
