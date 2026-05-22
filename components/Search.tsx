'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { SearchResult } from '@/types'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function Search() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results || [])
      } catch { setResults([]) }
      finally { setLoading(false) }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors font-mono"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        Search
        <kbd className="ml-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm">
          <div ref={containerRef} className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search posts..."
                className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none text-sm font-mono"
              />
              {loading && (
                <div className="w-4 h-4 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
              )}
              <button onClick={() => setOpen(false)} className="text-xs text-slate-400 font-mono hover:text-slate-600 dark:hover:text-slate-300">esc</button>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {query && !loading && results.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500 font-mono">
                  No results for &ldquo;{query}&rdquo;
                </p>
              )}
              {results.map(result => (
                <Link
                  key={result.slug}
                  href={`/blog/${result.slug}`}
                  onClick={() => { setOpen(false); setQuery('') }}
                  className="flex flex-col gap-1 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors"
                >
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{result.title}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{result.description}</span>
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500">{formatDate(result.date)}</span>
                </Link>
              ))}
              {!query && (
                <p className="px-4 py-6 text-center text-sm text-slate-400 dark:text-slate-500 font-mono">
                  Type to search posts...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
