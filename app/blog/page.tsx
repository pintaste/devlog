import type { Metadata } from 'next'
import { getAllPosts, getCategories, getTags } from '@/lib/db'
import { PostCard } from '@/components/PostCard'
import { Pagination } from '@/components/Pagination'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Blog',
  description: 'All posts',
}

const PER_PAGE = siteConfig.postsPerPage

interface PageProps {
  searchParams: Promise<{ page?: string; category?: string; tag?: string }>
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const pageStr = params?.page
  const category = params?.category
  const tag = params?.tag
  const page = Math.max(1, parseInt(pageStr || '1', 10))

  const allPosts = getAllPosts()
  const categories = getCategories()
  const tags = getTags()

  const filtered = allPosts.filter(p => {
    if (category && !p.categories.includes(category)) return false
    if (tag && !p.tags.includes(tag)) return false
    return true
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const posts = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const queryParams: Record<string, string> = {}
  if (category) queryParams.category = category
  if (tag) queryParams.tag = tag

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <div className="sticky top-20 flex flex-col gap-6">
            {/* Categories */}
            <div>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">Categories</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/blog"
                    className={`block text-sm px-2 py-1 rounded transition-colors ${
                      !category && !tag
                        ? 'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-950/40 font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    All posts
                    <span className="ml-1 text-xs text-slate-400 dark:text-slate-500">({allPosts.length})</span>
                  </Link>
                </li>
                {categories.map(cat => (
                  <li key={cat.name}>
                    <Link
                      href={`/blog?category=${encodeURIComponent(cat.name)}`}
                      className={`block text-sm px-2 py-1 rounded transition-colors ${
                        category === cat.name
                          ? 'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-950/40 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {cat.name}
                      <span className="ml-1 text-xs text-slate-400 dark:text-slate-500">({cat.count})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(t => (
                  <Link
                    key={t.name}
                    href={`/blog?tag=${encodeURIComponent(t.name)}`}
                    className={`text-xs font-mono px-2 py-0.5 rounded-full transition-colors ${
                      tag === t.name
                        ? 'bg-accent-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-accent-50 dark:hover:bg-accent-950/40 hover:text-accent-600 dark:hover:text-accent-400'
                    }`}
                  >
                    #{t.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {category ? `Category: ${category}` : tag ? `Tag: #${tag}` : 'All Posts'}
            </h1>
            <span className="text-sm font-mono text-slate-400 dark:text-slate-500">
              {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
            </span>
          </div>

          {posts.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">No posts found.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map(post => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} basePath="/blog" query={queryParams} />
        </div>
      </div>
    </div>
  )
}
