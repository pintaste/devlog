import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getAllPosts, getCategories, getTags } from '@/lib/data'
import { BlogList } from '@/components/BlogList'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'All posts',
}

export default function BlogPage() {
  const posts = getAllPosts()
  const categories = getCategories()
  const tags = getTags()

  return (
    <Suspense>
      <BlogList posts={posts} categories={categories} tags={tags} />
    </Suspense>
  )
}
