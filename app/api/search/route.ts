import { NextRequest, NextResponse } from 'next/server'
import { searchPosts } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.trim()

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  const results = searchPosts(query)
  return NextResponse.json({ results })
}
