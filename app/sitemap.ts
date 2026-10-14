import type { MetadataRoute } from 'next'

const BASE_URL = 'https://whitelineglobal.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/`,                          lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/about`,                     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/services`,                  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/services/airport-transfer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/services/hourly-booking`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/services/city-to-city`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/services/city-trip`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/services/day-service`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/fleet`,                     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/why-choose-us`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/faq`,                       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`,                   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/socials`,                   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/terms`,                     lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE_URL}/privacy`,                   lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]
}
