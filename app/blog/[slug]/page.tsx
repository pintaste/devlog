import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getPostSlugs } from '@/lib/data'
import { markdownToHtml } from '@/lib/markdown'
import { GiscusComments } from '@/components/Giscus'
import { siteConfig } from '@/lib/config'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getPostSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [siteConfig.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post || post.draft) notFound()

  const html = await markdownToHtml(post.content || '')

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main content */}
        <article className="flex-1 min-w-0 max-w-3xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-mono text-slate-500 dark:text-slate-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors mb-8"
          >
            ← back to blog
          </Link>

          {/* Header */}
          <header className="mb-8">
            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map(cat => (
                  <Link
                    key={cat}
                    href={`/blog?category=${encodeURIComponent(cat)}`}
                    className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-accent-50 dark:bg-accent-950/40 text-accent-700 dark:text-accent-300 hover:bg-accent-100 dark:hover:bg-accent-900/60 transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-4">
              {post.title}
            </h1>

            {post.description && (
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                {post.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 dark:text-slate-500 font-mono pb-6 border-b border-slate-200 dark:border-slate-800">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>{post.readingTime} min read</span>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/tags#${encodeURIComponent(tag)}`}
                      className="hover:text-accent-500 dark:hover:text-accent-400 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <div
            className="post-content prose dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-accent-600 dark:prose-a:text-accent-400 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Giscus comments */}
          <GiscusComments />
        </article>

        {/* TOC sidebar placeholder — could extract headings from HTML */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-20">
            <p className="text-xs font-mono font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
              On this page
            </p>
            <div className="text-xs font-mono text-slate-400 dark:text-slate-600">
              <Link href="/blog" className="hover:text-accent-500 transition-colors">← All posts</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
