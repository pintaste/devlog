import type { Metadata } from 'next'
import Link from 'next/link'
import { getTags, getPostsByTag } from '@/lib/db'
import { TagCloud } from '@/components/TagCloud'

export const revalidate = 3600
export const metadata: Metadata = { title: 'Tags' }

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function TagsPage() {
  const tags = getTags()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Tags</h1>
        <p className="font-mono text-sm text-slate-400 dark:text-slate-500">
          {tags.length} tags
        </p>
      </div>

      {/* Tag cloud */}
      <div className="mb-12 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <TagCloud tags={tags} />
      </div>

      {/* Posts by tag */}
      <div className="space-y-10">
        {tags.map(tag => {
          const posts = getPostsByTag(tag.name)
          return (
            <section key={tag.name} id={encodeURIComponent(tag.name)}>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
                  #{tag.name}
                </h2>
                <span className="text-sm text-slate-400 dark:text-slate-500">{tag.count} posts</span>
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

        {tags.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">No tags yet.</p>
        )}
      </div>
    </div>
  )
}
