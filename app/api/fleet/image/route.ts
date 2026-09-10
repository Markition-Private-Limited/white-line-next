const FLEET_API_BASE = process.env.FLEET_API_BASE_URL ?? 'http://34.166.167.2'
const REQUEST_TIMEOUT_MS = 8000

function isAllowedFleetImage(url: URL): boolean {
  const apiBaseUrl = new URL(FLEET_API_BASE)
  return url.origin === apiBaseUrl.origin && url.pathname.startsWith('/api/v1/public-files/')
}

export async function GET(request: Request) {
  const requestedUrl = new URL(request.url).searchParams.get('url')
  if (!requestedUrl) return new Response('Missing image URL', { status: 400 })

  let imageUrl: URL
  try {
    imageUrl = new URL(requestedUrl)
  } catch {
    return new Response('Invalid image URL', { status: 400 })
  }

  if (!isAllowedFleetImage(imageUrl)) return new Response('Image URL is not allowed', { status: 400 })

  const upstream = await fetch(imageUrl, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!upstream.ok || !upstream.body) return new Response('Image could not be loaded', { status: upstream.status || 502 })

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      'Content-Type': upstream.headers.get('content-type') ?? 'image/png',
    },
  })
}
