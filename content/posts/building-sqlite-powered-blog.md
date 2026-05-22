---
title: "Building a SQLite-Powered Blog: Metadata Without a Database Server"
date: "2025-02-08"
description: "How to use better-sqlite3 to index markdown blog posts into SQLite, enabling fast queries, full-text search, and zero infrastructure overhead."
categories: ["Backend", "Database"]
tags: ["sqlite", "database", "nodejs", "backend"]
draft: false
---

# Building a SQLite-Powered Blog

For a personal blog, a full database server (PostgreSQL, MySQL) is overkill. But a plain filesystem with markdown files is too limiting — you can't easily query by tag, paginate, or do full-text search. SQLite sits perfectly in between.

## Why SQLite + Markdown?

The approach: **store content in markdown files, store metadata in SQLite**.

Markdown files are the source of truth. On dev start or build, a sync script reads every `.md` file and upserts its frontmatter into SQLite. The application then queries SQLite for listing/filtering/searching and reads the raw markdown only when rendering a specific post.

This gives you:
- Git-trackable content (plain files)
- Fast queries (SQL)
- No server to manage (SQLite is just a file)
- Full-text search capability

## The Schema

```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  date TEXT NOT NULL,
  draft INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 0,
  content TEXT DEFAULT ''
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

-- Junction tables for many-to-many relationships
CREATE TABLE post_categories (
  post_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  PRIMARY KEY (post_id, category_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE post_tags (
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

## The Sync Script

The sync script runs before `next dev` and `next build`:

```javascript
// scripts/sync-posts.mjs
import Database from 'better-sqlite3'
import { readFileSync, readdirSync } from 'fs'
import matter from 'gray-matter'

const db = new Database('./data/blog.db')
db.pragma('journal_mode = WAL')  // WAL mode is faster for our use case

const upsertPost = db.prepare(`
  INSERT INTO posts (slug, title, description, date, draft, content)
  VALUES (@slug, @title, @description, @date, @draft, @content)
  ON CONFLICT(slug) DO UPDATE SET
    title = excluded.title,
    description = excluded.description,
    date = excluded.date,
    draft = excluded.draft,
    content = excluded.content
`)

const syncAll = db.transaction(() => {
  const files = readdirSync('./content/posts').filter(f => f.endsWith('.md'))
  
  for (const file of files) {
    const slug = file.replace('.md', '')
    const raw = readFileSync(`./content/posts/${file}`, 'utf-8')
    const { data, content } = matter(raw)
    
    upsertPost.run({
      slug,
      title: data.title || slug,
      description: data.description || '',
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      draft: data.draft ? 1 : 0,
      content,
    })
    
    // Sync categories and tags (omitted for brevity)
  }
})

syncAll()
```

The entire sync runs inside a single transaction — this is dramatically faster than individual inserts when processing many files.

## Querying Posts with Joins

Getting posts with their categories and tags requires joins:

```typescript
function getPostsByTag(tag: string): PostMeta[] {
  const rows = db.prepare(`
    SELECT p.slug, p.title, p.description, p.date
    FROM posts p
    JOIN post_tags pt ON pt.post_id = p.id
    JOIN tags t ON t.id = pt.tag_id
    WHERE t.name = ? AND p.draft = 0
    ORDER BY p.date DESC
  `).all(tag)
  
  return rows.map(row => enrichWithRelations(row))
}
```

## WAL Mode and Performance

Always enable WAL (Write-Ahead Logging) for better performance:

```javascript
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')
```

WAL mode allows concurrent reads while a write is happening. For a blog that's mostly reads, this matters less — but it's a best practice and costs nothing.

## Search with LIKE

For a personal blog, simple `LIKE` queries are sufficient:

```sql
SELECT slug, title, description, date
FROM posts
WHERE draft = 0
  AND (title LIKE '%query%' OR description LIKE '%query%' OR content LIKE '%query%')
ORDER BY date DESC
LIMIT 20
```

For larger blogs, SQLite's built-in FTS5 (Full-Text Search) extension provides much faster full-text queries with ranking.

## Key Insight

The beauty of this setup: **content lives in git, metadata lives in a local file, and nothing requires a network**. The entire blog can run on a Raspberry Pi with zero external dependencies.
