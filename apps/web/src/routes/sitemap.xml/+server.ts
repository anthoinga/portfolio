import { sitemapUrls, slugsForSitemap } from '$lib/nextProject'
import { loadVisibleProjects } from '$lib/server/content'
import { siteUrl } from '$lib/server/site'
import type { RequestHandler } from './$types'

export const prerender = true

export const GET: RequestHandler = async () => {
	const projects = await loadVisibleProjects()
	const urls = sitemapUrls(siteUrl, slugsForSitemap(projects))
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } })
}
