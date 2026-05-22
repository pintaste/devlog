'use client'

import Link from 'next/link'
import type { PostMeta } from '@/types'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

interface PostCardProps {
  post: PostMeta
  featured?: boolean
}

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <article
      className={`group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-accent-300 dark:hover:border-accent-700 hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-200 ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      {/* Category badges */}
      {post.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.categories.map(cat => (
            <Link
              key={cat}
              href={`/categories#${encodeURIComponent(cat)}`}
              className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-accent-50 dark:bg-accent-950/40 text-accent-700 dark:text-accent-300 hover:bg-accent-100 dark:hover:bg-accent-900/60 transition-colors"
              onClick={e => e.stopPropagation()}
            >
              {cat}
            </Link>
          ))}
        </div>
      )}

      {/* Title */}
      <h2 className={`font-bold text-slate-900 dark:text-slate-100 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors leading-tight mb-2 ${featured ? 'text-xl' : 'text-base'}`}>
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h2>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
        {post.description}
      </p>

      {/* Meta */}
      <div className="flex items-center justify-between gap-2">
        <time className="text-xs font-mono text-slate-400 dark:text-slate-500" dateTime={post.date}>
          {formatDate(post.date)}
        </time>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            {post.readingTime} min read
          </span>
          {post.tags.length > 0 && (
            <div className="flex gap-1">
              {post.tags.slice(0, 3).map(tag => (
                <Link
                  key={tag}
                  href={`/tags#${encodeURIComponent(tag)}`}
                  className="text-xs text-slate-400 dark:text-slate-500 hover:text-accent-500 dark:hover:text-accent-400 transition-colors font-mono"
                  onClick={e => e.stopPropagation()}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
