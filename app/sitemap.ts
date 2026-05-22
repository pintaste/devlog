import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/db'
import { siteConfig } from '@/lib/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  const postEntries: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${siteConfig.url}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteConfig.url}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${siteConfig.url}/tags`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${siteConfig.url}/archive`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${siteConfig.url}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  return [...staticPages, ...postEntries]
}
