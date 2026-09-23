import { sitemapUrls, slugsForSitemap } from '$lib/nextProject'
import { loadVisibleProjects } from '$lib/server/content'
import { env } from '$env/dynamic/public'
import type { RequestHandler } from './$types'

export const prerender = true

export const GET: RequestHandler = async () => {
	const base = (env.PUBLIC_SITE_URL || 'http://localhost:4173').replace(/\/$/, '')
	const projects = await loadVisibleProjects()
	const urls = sitemapUrls(base, slugsForSitemap(projects))
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } })
}
