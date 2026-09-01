import { env } from '$env/dynamic/public'
import type { RequestHandler } from './$types'

export const prerender = true

export const GET: RequestHandler = async () => {
	const base = (env.PUBLIC_SITE_URL || 'http://localhost:4173').replace(/\/$/, '')
	const body = `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`
	return new Response(body, { headers: { 'Content-Type': 'text/plain' } })
}
