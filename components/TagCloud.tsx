import Link from 'next/link'
import type { Tag } from '@/types'

interface TagCloudProps {
  tags: Tag[]
  activeTag?: string
}

export function TagCloud({ tags, activeTag }: TagCloudProps) {
  const maxCount = Math.max(...tags.map(t => t.count), 1)

  function getFontSize(count: number) {
    const ratio = count / maxCount
    if (ratio > 0.8) return 'text-xl font-bold'
    if (ratio > 0.6) return 'text-lg font-semibold'
    if (ratio > 0.4) return 'text-base font-medium'
    if (ratio > 0.2) return 'text-sm'
    return 'text-xs'
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {tags.map(tag => (
        <Link
          key={tag.name}
          href={`/tags#${encodeURIComponent(tag.name)}`}
          id={encodeURIComponent(tag.name)}
          className={`font-mono px-2 py-1 rounded-md transition-colors ${getFontSize(tag.count)} ${
            activeTag === tag.name
              ? 'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-950/40'
              : 'text-slate-600 dark:text-slate-400 hover:text-accent-600 dark:hover:text-accent-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          #{tag.name}
          <span className="ml-1 text-xs opacity-60">{tag.count}</span>
        </Link>
      ))}
    </div>
  )
}
