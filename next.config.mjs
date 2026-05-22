/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  outputFileTracingIncludes: {
    '/api/feed': ['./data/posts.json'],
    '/api/search': ['./data/posts.json'],
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/favicon.svg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/feed.xml',
        destination: '/api/feed',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
