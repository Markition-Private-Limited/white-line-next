import type { MetadataRoute } from 'next'

const BASE_URL = 'https://whitelineglobal.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/account',
          '/journeys',
          '/booking-confirmed',
          '/booking-failed',
          '/partner/',
          '/api/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
