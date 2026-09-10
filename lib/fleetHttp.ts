import { execFile } from 'child_process'

export const FLEET_API_BASE = process.env.FLEET_API_BASE_URL ?? 'http://34.166.167.2'
const REQUEST_TIMEOUT_MS = 10000

// Node.js fetch/http can get EACCES on this Windows host for port 80.
// curl.exe is not subject to the same firewall rule, so keep it as a fallback.
type FleetHttpResult<T = unknown> = { status: number; data: T }

function parseCurlJson<T>(stdout: string): FleetHttpResult<T> {
  const lines = stdout.trim().split('\n')
  const status = parseInt(lines[lines.length - 1], 10)
  const body = lines.slice(0, -1).join('\n')
  try {
    return { status: isNaN(status) ? 500 : status, data: JSON.parse(body) as T }
  } catch {
    return { status: isNaN(status) ? 500 : status, data: {} as T }
  }
}

async function fetchRequest<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<FleetHttpResult<T>> {
  const res = await fetch(`${FLEET_API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'undefined' ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  return { status: res.status, data: await res.json() as T }
}

function curlRequest<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<FleetHttpResult<T>> {
  return new Promise((resolve, reject) => {
    const url = `${FLEET_API_BASE}${path}`
    const args = [
      '-s', '--max-time', '10',
      '-w', '\n%{http_code}',
      '-X', method,
      '-H', 'Content-Type: application/json',
    ]

    if (typeof body !== 'undefined') args.push('-d', JSON.stringify(body))
    args.push(url)

    execFile('curl', args, { timeout: 12000, encoding: 'utf8' }, (error, stdout) => {
      if (error) { reject(error); return }
      resolve(parseCurlJson<T>(stdout))
    })
  })
}

async function fleetRequest<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<FleetHttpResult<T>> {
  try {
    return await fetchRequest<T>(method, path, body)
  } catch (error) {
    console.warn(`[fleetHttp] fetch failed for ${method} ${path}; retrying with curl`, error)
    return curlRequest<T>(method, path, body)
  }
}

export function fleetGet<T>(path: string): Promise<FleetHttpResult<T>> {
  return fleetRequest<T>('GET', path)
}

export function fleetPost(path: string, body: unknown): Promise<FleetHttpResult> {
  return fleetRequest('POST', path, body)
}
