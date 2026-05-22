---
title: "Getting Started with Next.js 15: App Router & Server Components"
date: "2025-01-15"
description: "A practical guide to Next.js 15's App Router, React Server Components, and the new async patterns that change how we build web apps."
categories: ["Web Development"]
tags: ["nextjs", "react", "typescript", "web-dev"]
draft: false
---

# Getting Started with Next.js 15

Next.js 15 ships with some fundamental changes to how parameters work in pages and layouts. If you're upgrading from v14, a few things will break — but they break for good reasons.

## The App Router Model

The App Router treats every file in `app/` as a React Server Component by default. This is important: **server components run on the server, have no JavaScript sent to the browser, and can directly access databases, files, and environment secrets**.

```tsx
// app/blog/[slug]/page.tsx
// This is a Server Component — no 'use client' directive
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params  // params is now a Promise in Next.js 15
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  )
}
```

Notice the `await params` — this is the breaking change in Next.js 15. Previously params was a plain object; now it's a Promise.

## Server vs Client Components

The mental model is simple:

| Feature | Server Component | Client Component |
|---------|-----------------|-----------------|
| Data fetching | ✅ Direct DB/API | ❌ Must use fetch |
| useState / useEffect | ❌ | ✅ |
| Browser APIs | ❌ | ✅ |
| Bundle size | Zero JS sent | Included in bundle |

When you need interactivity, mark the component with `'use client'`:

```tsx
'use client'

import { useState } from 'react'

export function SearchBox({ onSearch }: { onSearch: (q: string) => void }) {
  const [value, setValue] = useState('')

  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && onSearch(value)}
      placeholder="Search posts..."
    />
  )
}
```

## Static Generation with generateStaticParams

For blog posts, you want static pages generated at build time:

```tsx
export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map(slug => ({ slug }))
}

export const revalidate = 3600  // ISR: revalidate every hour
```

## Layout Hierarchy

Layouts in `app/` are nested. The root layout wraps everything:

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

The `suppressHydrationWarning` on `<html>` is important when using dark mode — theme providers modify the `class` attribute on the HTML element, causing a hydration mismatch without it.

## Data Fetching Patterns

With server components, you can fetch data directly in the component without `useEffect` or SWR:

```typescript
// Direct database query in a server component
async function RecentPosts() {
  const posts = await getAllPosts()  // runs on server
  
  return (
    <ul>
      {posts.slice(0, 5).map(post => (
        <li key={post.slug}>
          <a href={`/blog/${post.slug}`}>{post.title}</a>
        </li>
      ))}
    </ul>
  )
}
```

No API routes needed for this pattern. The database call happens server-side, and the rendered HTML is sent to the browser.

## What's Next

In the next post, we'll look at using SQLite with better-sqlite3 to build a metadata store for blog posts — keeping the benefits of file-based markdown content while gaining fast querying and full-text search.
