import Database from 'better-sqlite3'
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const POSTS_DIR = join(ROOT, 'content', 'posts')
const DATA_DIR = join(ROOT, 'data')
const DB_PATH = join(DATA_DIR, 'blog.db')

mkdirSync(DATA_DIR, { recursive: true })

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

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

const upsertPost = db.prepare(`
  INSERT INTO posts (slug, title, description, date, draft, reading_time, content)
  VALUES (@slug, @title, @description, @date, @draft, @readingTime, @content)
  ON CONFLICT(slug) DO UPDATE SET
    title = excluded.title,
    description = excluded.description,
    date = excluded.date,
    draft = excluded.draft,
    reading_time = excluded.reading_time,
    content = excluded.content
`)

const insertCategory = db.prepare(`INSERT OR IGNORE INTO categories (name) VALUES (?)`)
const insertTag = db.prepare(`INSERT OR IGNORE INTO tags (name) VALUES (?)`)
const deletePostCategories = db.prepare(`DELETE FROM post_categories WHERE post_id = (SELECT id FROM posts WHERE slug = ?)`)
const deletePostTags = db.prepare(`DELETE FROM post_tags WHERE post_id = (SELECT id FROM posts WHERE slug = ?)`)
const insertPostCategory = db.prepare(`
  INSERT OR IGNORE INTO post_categories (post_id, category_id)
  VALUES ((SELECT id FROM posts WHERE slug = ?), (SELECT id FROM categories WHERE name = ?))
`)
const insertPostTag = db.prepare(`
  INSERT OR IGNORE INTO post_tags (post_id, tag_id)
  VALUES ((SELECT id FROM posts WHERE slug = ?), (SELECT id FROM tags WHERE name = ?))
`)

function estimateReadingTime(content) {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

let files
try {
  files = readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'))
} catch {
  console.log('No posts directory found, creating empty database.')
  files = []
}

const syncAll = db.transaction(() => {
  for (const file of files) {
    const slug = file.replace(/\.md$/, '')
    const raw = readFileSync(join(POSTS_DIR, file), 'utf-8')
    const { data, content } = matter(raw)

    const dateStr = data.date
      ? new Date(data.date).toISOString()
      : new Date().toISOString()

    upsertPost.run({
      slug,
      title: data.title || slug,
      description: data.description || '',
      date: dateStr,
      draft: data.draft ? 1 : 0,
      readingTime: estimateReadingTime(content),
      content,
    })

    deletePostCategories.run(slug)
    for (const cat of Array.isArray(data.categories) ? data.categories : []) {
      insertCategory.run(cat)
      insertPostCategory.run(slug, cat)
    }

    deletePostTags.run(slug)
    for (const tag of Array.isArray(data.tags) ? data.tags : []) {
      insertTag.run(tag)
      insertPostTag.run(slug, tag)
    }
  }
})

syncAll()
console.log(`✓ Synced ${files.length} posts to SQLite (${DB_PATH})`)

const allRows = db.prepare(`SELECT slug, title, description, date, draft, reading_time, content FROM posts ORDER BY date DESC`).all()
const postsJson = allRows.map(post => {
  const categories = db.prepare(`
    SELECT c.name FROM categories c
    JOIN post_categories pc ON pc.category_id = c.id
    JOIN posts p ON p.id = pc.post_id
    WHERE p.slug = ?
  `).all(post.slug).map(r => r.name)

  const tags = db.prepare(`
    SELECT t.name FROM tags t
    JOIN post_tags pt ON pt.tag_id = t.id
    JOIN posts p ON p.id = pt.post_id
    WHERE p.slug = ?
  `).all(post.slug).map(r => r.name)

  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    draft: post.draft === 1,
    readingTime: post.reading_time,
    categories,
    tags,
    content: post.content,
  }
})

const JSON_PATH = join(DATA_DIR, 'posts.json')
writeFileSync(JSON_PATH, JSON.stringify({ posts: postsJson }, null, 2))
console.log(`✓ Exported ${postsJson.length} posts to ${JSON_PATH}`)

db.close()
