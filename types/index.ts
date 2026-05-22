export interface Post {
  id?: number
  slug: string
  title: string
  description: string
  date: string
  categories: string[]
  tags: string[]
  draft: boolean
  content?: string
  readingTime?: number
}

export interface PostMeta {
  slug: string
  title: string
  description: string
  date: string
  categories: string[]
  tags: string[]
  draft: boolean
  readingTime: number
}

export interface Category {
  name: string
  count: number
}

export interface Tag {
  name: string
  count: number
}

export interface ArchiveGroup {
  year: number
  months: {
    month: number
    posts: PostMeta[]
  }[]
}

export interface SearchResult {
  slug: string
  title: string
  description: string
  date: string
}

export interface PaginationInfo {
  page: number
  total: number
  perPage: number
  totalPages: number
}
