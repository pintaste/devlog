import { readFileSync } from 'fs'
import path from 'path'
import type { PostMeta, Category, Tag, SearchResult } from '@/types'

interface PostData extends PostMeta {
  content: string
}

function loadPosts(): PostData[] {
  const jsonPath = path.join(process.cwd(), 'data', 'posts.json')
  const raw = readFileSync(jsonPath, 'utf-8')
  return (JSON.parse(raw) as { posts: PostData[] }).posts
}

const _posts = loadPosts()

export function getAllPosts(includeDrafts = false): PostMeta[] {
  return _posts
    .filter(p => includeDrafts || !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(({ content: _c, ...meta }) => meta)
}

export function getPostBySlug(slug: string): (PostMeta & { content: string }) | null {
  return _posts.find(p => p.slug === slug) ?? null
}

export function getCategories(): Category[] {
  const map = new Map<string, number>()
  _posts.filter(p => !p.draft).forEach(p => {
    p.categories.forEach(c => map.set(c, (map.get(c) ?? 0) + 1))
  })
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export function getTags(): Tag[] {
  const map = new Map<string, number>()
  _posts.filter(p => !p.draft).forEach(p => {
    p.tags.forEach(t => map.set(t, (map.get(t) ?? 0) + 1))
  })
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export function getPostsByCategory(category: string): PostMeta[] {
  return _posts
    .filter(p => !p.draft && p.categories.includes(category))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(({ content: _c, ...meta }) => meta)
}

export function getPostsByTag(tag: string): PostMeta[] {
  return _posts
    .filter(p => !p.draft && p.tags.includes(tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(({ content: _c, ...meta }) => meta)
}

export function searchPosts(query: string): SearchResult[] {
  const q = query.toLowerCase()
  return _posts
    .filter(p => !p.draft)
    .filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20)
    .map(p => ({ slug: p.slug, title: p.title, description: p.description, date: p.date }))
}

export function getPostSlugs(): string[] {
  return _posts.filter(p => !p.draft).map(p => p.slug)
}
