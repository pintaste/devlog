'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { siteConfig } from '@/lib/config'

const GISCUS_REPO = process.env.NEXT_PUBLIC_GISCUS_REPO || siteConfig.giscus.repo
const GISCUS_REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || siteConfig.giscus.repoId
const GISCUS_CATEGORY = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || siteConfig.giscus.category
const GISCUS_CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || siteConfig.giscus.categoryId

export function GiscusComments() {
  const { resolvedTheme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (!containerRef.current || isInitialized.current) return

    const { mapping, strict, reactionsEnabled, emitMetadata, inputPosition, lang } = siteConfig.giscus

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', GISCUS_REPO)
    script.setAttribute('data-repo-id', GISCUS_REPO_ID)
    script.setAttribute('data-category', GISCUS_CATEGORY)
    script.setAttribute('data-category-id', GISCUS_CATEGORY_ID)
    script.setAttribute('data-mapping', mapping)
    script.setAttribute('data-strict', strict)
    script.setAttribute('data-reactions-enabled', reactionsEnabled)
    script.setAttribute('data-emit-metadata', emitMetadata)
    script.setAttribute('data-input-position', inputPosition)
    script.setAttribute('data-theme', resolvedTheme === 'dark' ? 'dark' : 'light')
    script.setAttribute('data-lang', lang)
    script.setAttribute('data-loading', 'lazy')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    containerRef.current.appendChild(script)
    isInitialized.current = true
  }, [resolvedTheme])

  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
    if (!iframe) return
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: resolvedTheme === 'dark' ? 'dark' : 'light' } } },
      'https://giscus.app'
    )
  }, [resolvedTheme])

  return (
    <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
      <h2 className="text-lg font-mono font-semibold text-slate-700 dark:text-slate-300 mb-6">
        $ comments --open
      </h2>
      <div ref={containerRef} />
    </div>
  )
}
