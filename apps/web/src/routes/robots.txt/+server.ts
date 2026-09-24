import { siteUrl } from '$lib/server/site'
import type { RequestHandler } from './$types'

export const prerender = true

export const GET: RequestHandler = async () => {
	const body = `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`
	return new Response(body, { headers: { 'Content-Type': 'text/plain' } })
}
