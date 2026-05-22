import Link from 'next/link'
import { getAllPosts } from '@/lib/db'
import { PostCard } from '@/components/PostCard'
import { Search } from '@/components/Search'
import { siteConfig } from '@/lib/config'

export const revalidate = 3600

export default function HomePage() {
  const posts = getAllPosts()
  const recent = posts.slice(0, 6)

  return (
    <div>
      {/* Hero */}
      <section className="relative border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-sm text-accent-500">~/</span>
              <span className="font-mono text-sm text-slate-400 dark:text-slate-500">whoami</span>
              <span className="font-mono text-sm text-slate-400 dark:text-slate-500 cursor-blink">▌</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
              {siteConfig.tagline}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/blog"
                className="px-5 py-2.5 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                Read the blog
              </Link>
              <Link
                href="/about"
                className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-accent-400 dark:hover:border-accent-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors text-sm"
              >
                About me
              </Link>
              <Search />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <dl className="flex flex-wrap gap-8">
            <div>
              <dt className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">Posts</dt>
              <dd className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">{posts.length}</dd>
            </div>
            <div>
              <dt className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">Words written</dt>
              <dd className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">
                ~{Math.round(posts.reduce((a, p) => a + p.readingTime * 200, 0) / 1000)}k
              </dd>
            </div>
            <div>
              <dt className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">Topics</dt>
              <dd className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">
                {[...new Set(posts.flatMap(p => p.categories))].length}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Recent posts */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-mono font-semibold text-slate-700 dark:text-slate-300">
            <span className="text-accent-500">$</span> ls -lt posts/ | head -6
          </h2>
          <Link
            href="/blog"
            className="text-sm font-mono text-accent-600 dark:text-accent-400 hover:underline"
          >
            view all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">No posts yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((post, i) => (
              <PostCard key={post.slug} post={post} featured={i === 0} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
