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

  return Response.redirect(imageUrl.toString(), 302)
}
