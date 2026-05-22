import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import type { PostMeta, Category, Tag, SearchResult } from '@/types'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DATA_DIR, 'blog.db')

let _db: Database.Database | null = null

function getDb(): Database.Database {
  if (!_db) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    _db = new Database(DB_PATH)
    _db.pragma('journal_mode = WAL')
    _db.pragma('foreign_keys = ON')
    initSchema(_db)
  }
  return _db
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      date TEXT NOT NULL,
      draft INTEGER DEFAULT 0,
      reading_time INTEGER DEFAULT 0,
      content TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS post_categories (
      post_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      PRIMARY KEY (post_id, category_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS post_tags (
      post_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (post_id, tag_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  `)
}

function rowToMeta(row: Record<string, unknown>, slug: string): PostMeta {
  const db = getDb()
  const categories = db.prepare(`
    SELECT c.name FROM categories c
    JOIN post_categories pc ON pc.category_id = c.id
    JOIN posts p ON p.id = pc.post_id
    WHERE p.slug = ?
  `).all(slug) as { name: string }[]

  const tags = db.prepare(`
    SELECT t.name FROM tags t
    JOIN post_tags pt ON pt.tag_id = t.id
    JOIN posts p ON p.id = pt.post_id
    WHERE p.slug = ?
  `).all(slug) as { name: string }[]

  return {
    slug: row.slug as string,
    title: row.title as string,
    description: row.description as string,
    date: row.date as string,
    draft: row.draft === 1,
    readingTime: row.reading_time as number,
    categories: categories.map(c => c.name),
    tags: tags.map(t => t.name),
  }
}

export function getAllPosts(includeDrafts = false): PostMeta[] {
  const db = getDb()
  const rows = db.prepare(`
    SELECT slug, title, description, date, draft, reading_time
    FROM posts
    ${includeDrafts ? '' : 'WHERE draft = 0'}
    ORDER BY date DESC
  `).all() as Record<string, unknown>[]

  return rows.map(row => rowToMeta(row, row.slug as string))
}

export function getPostBySlug(slug: string): (PostMeta & { content: string }) | null {
  const db = getDb()
  const row = db.prepare(`
    SELECT slug, title, description, date, draft, reading_time, content
    FROM posts WHERE slug = ?
  `).get(slug) as Record<string, unknown> | undefined

  if (!row) return null
  return { ...rowToMeta(row, slug), content: row.content as string }
}

export function getCategories(): Category[] {
  const db = getDb()
  return db.prepare(`
    SELECT c.name, COUNT(pc.post_id) as count
    FROM categories c
    JOIN post_categories pc ON pc.category_id = c.id
    JOIN posts p ON p.id = pc.post_id
    WHERE p.draft = 0
    GROUP BY c.name
    ORDER BY count DESC, c.name ASC
  `).all() as Category[]
}

export function getTags(): Tag[] {
  const db = getDb()
  return db.prepare(`
    SELECT t.name, COUNT(pt.post_id) as count
    FROM tags t
    JOIN post_tags pt ON pt.tag_id = t.id
    JOIN posts p ON p.id = pt.post_id
    WHERE p.draft = 0
    GROUP BY t.name
    ORDER BY count DESC, t.name ASC
  `).all() as Tag[]
}

export function getPostsByCategory(category: string): PostMeta[] {
  const db = getDb()
  const rows = db.prepare(`
    SELECT p.slug, p.title, p.description, p.date, p.draft, p.reading_time
    FROM posts p
    JOIN post_categories pc ON pc.post_id = p.id
    JOIN categories c ON c.id = pc.category_id
    WHERE c.name = ? AND p.draft = 0
    ORDER BY p.date DESC
  `).all(category) as Record<string, unknown>[]

  return rows.map(row => rowToMeta(row, row.slug as string))
}

export function getPostsByTag(tag: string): PostMeta[] {
  const db = getDb()
  const rows = db.prepare(`
    SELECT p.slug, p.title, p.description, p.date, p.draft, p.reading_time
    FROM posts p
    JOIN post_tags pt ON pt.post_id = p.id
    JOIN tags t ON t.id = pt.tag_id
    WHERE t.name = ? AND p.draft = 0
    ORDER BY p.date DESC
  `).all(tag) as Record<string, unknown>[]

  return rows.map(row => rowToMeta(row, row.slug as string))
}

export function searchPosts(query: string): SearchResult[] {
  const db = getDb()
  const term = `%${query}%`
  return db.prepare(`
    SELECT slug, title, description, date
    FROM posts
    WHERE draft = 0 AND (title LIKE ? COLLATE NOCASE OR description LIKE ? COLLATE NOCASE OR content LIKE ? COLLATE NOCASE)
    ORDER BY date DESC
    LIMIT 20
  `).all(term, term, term) as SearchResult[]
}

export function getPostSlugs(): string[] {
  const db = getDb()
  return (db.prepare('SELECT slug FROM posts WHERE draft = 0').all() as { slug: string }[]).map(r => r.slug)
}
