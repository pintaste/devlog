# DevLog — Programmer Blog

A minimalist, terminal-styled personal blog for programmers. Built with Next.js 15, MDX, and SQLite.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: Markdown files processed at build time into SQLite
- **Syntax highlighting**: Shiki (dual light/dark themes)
- **Comments**: Giscus (GitHub Discussions)
- **Search**: Built-in full-text search via SQLite FTS5
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local  # or create .env.local manually

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding Posts

Create a Markdown file in the `content/posts/` directory:

```
content/posts/my-new-post.md
```

**Front matter format:**

```markdown
---
title: My Post Title
date: 2024-01-15
description: A short summary shown in post cards and meta tags.
tags: [typescript, nextjs]
categories: [web-development]
draft: false
---

Post content goes here...
```

| Field         | Required | Description                                |
|---------------|----------|--------------------------------------------|
| `title`       | Yes      | Post title                                 |
| `date`        | Yes      | Publication date (YYYY-MM-DD)              |
| `description` | No       | Summary for cards and SEO                  |
| `tags`        | No       | Array of tags (lowercase, hyphen-separated)|
| `categories`  | No       | Array of categories                        |
| `draft`       | No       | Set `true` to hide from listings           |

Posts are indexed into SQLite on `npm run dev` start and rebuild.

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Site URL (used for OG tags and sitemap)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Giscus comments (get values from https://giscus.app)
NEXT_PUBLIC_GISCUS_REPO=yourusername/blog-discussions
NEXT_PUBLIC_GISCUS_REPO_ID=R_xxxxx
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxx
```

### Setting up Giscus

1. Enable GitHub Discussions on your repo
2. Visit [giscus.app](https://giscus.app) and configure for your repo
3. Copy the `data-repo`, `data-repo-id`, `data-category`, `data-category-id` values into `.env.local`

## Deployment (Vercel)

1. Push this repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SITE_URL` → your production URL (e.g. `https://yourdomain.com`)
   - `NEXT_PUBLIC_GISCUS_REPO` → your GitHub repo
   - `NEXT_PUBLIC_GISCUS_REPO_ID` → from giscus.app
   - `NEXT_PUBLIC_GISCUS_CATEGORY` → from giscus.app
   - `NEXT_PUBLIC_GISCUS_CATEGORY_ID` → from giscus.app
4. Deploy — Vercel handles the rest automatically

## Customization

Edit `lib/config.ts` to update:

- Site name, tagline, description
- Author name, email, GitHub, Twitter
- Navigation links
- Posts per page
- Accent color
