import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'About',
  description: `About ${siteConfig.author.name}`,
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white text-2xl font-bold font-mono mb-6 shadow-lg">
          {siteConfig.author.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {siteConfig.author.name}
        </h1>
        <p className="font-mono text-accent-500 text-sm">Software Engineer · Writer · Builder</p>
      </div>

      <div className="prose dark:prose-invert max-w-none mb-10">
        <p>{siteConfig.author.bio}</p>

        <p>
          This blog is where I write about things I learn, tools I find interesting, and problems I solve.
          The content spans from low-level systems programming to frontend patterns, with a focus on
          making complex ideas clear and practical.
        </p>

        <h2>Tech I use</h2>
        <ul>
          <li><strong>Languages:</strong> TypeScript, Python, Go, Rust (learning)</li>
          <li><strong>Frontend:</strong> React, Next.js, Tailwind CSS</li>
          <li><strong>Backend:</strong> Node.js, SQLite, PostgreSQL</li>
          <li><strong>Tools:</strong> Neovim, tmux, Git, GitHub Actions</li>
        </ul>

        <h2>About this blog</h2>
        <p>
          Built with Next.js 15 (App Router), Tailwind CSS, and SQLite. Posts are written in Markdown,
          indexed into SQLite for fast querying, and rendered with Shiki for syntax highlighting.
          Dark mode via next-themes, comments via Giscus.
        </p>

        <blockquote>
          The best code is code that doesn&apos;t need to exist. The second best is code that&apos;s
          so clear it documents itself.
        </blockquote>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`https://github.com/${siteConfig.author.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 hover:border-accent-400 dark:hover:border-accent-600 rounded-lg text-sm text-slate-700 dark:text-slate-300 transition-colors font-mono"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          @{siteConfig.author.github}
        </Link>
        <Link
          href={`mailto:${siteConfig.author.email}`}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 hover:border-accent-400 dark:hover:border-accent-600 rounded-lg text-sm text-slate-700 dark:text-slate-300 transition-colors font-mono"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          {siteConfig.author.email}
        </Link>
        <Link
          href="/feed.xml"
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 hover:border-accent-400 dark:hover:border-accent-600 rounded-lg text-sm text-slate-700 dark:text-slate-300 transition-colors font-mono"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
          RSS Feed
        </Link>
      </div>
    </div>
  )
}
