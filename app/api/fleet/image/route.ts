const FLEET_API_BASE = process.env.FLEET_API_BASE_URL ?? 'http://34.166.167.2'

function isAllowedFleetImage(url: URL): boolean {
  const apiBaseUrl = new URL(FLEET_API_BASE)
  return url.hostname === apiBaseUrl.hostname
}

export async function GET(request: Request) {
  const requestedUrl = new URL(request.url).searchParams.get('url')
  if (!requestedUrl) return new Response('Missing image URL', { status: 400 })

  let imageUrl: URL
  try {
    imageUrl = new URL(requestedUrl, FLEET_API_BASE)
  } catch {
    return new Response('Invalid image URL', { status: 400 })
  }

  if (!isAllowedFleetImage(imageUrl)) return new Response('Image URL is not allowed', { status: 400 })

  // Fetch server-side and stream back so the browser never requests the HTTP origin directly.
  // A 302 redirect would cause mixed-content failures on HTTPS deployments.
  try {
    const upstream = await fetch(imageUrl.toString(), {
      next: { revalidate: 3600 },
    })
    if (!upstream.ok) return new Response('Upstream image error', { status: upstream.status })

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') ?? 'image/jpeg',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return new Response('Failed to fetch image', { status: 502 })
  }
}
