import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeShiki from '@shikijs/rehype'

let processorCache: Awaited<ReturnType<typeof buildProcessor>> | null = null

async function buildProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeShiki, {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultLanguage: 'text',
      fallbackLanguage: 'text',
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
}

export async function markdownToHtml(content: string): Promise<string> {
  if (!processorCache) {
    processorCache = await buildProcessor()
  }
  const result = await processorCache.process(content)
  return result.toString()
}

export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}
