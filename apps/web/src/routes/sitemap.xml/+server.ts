import { switchPath } from '$lib/i18n/core'
import { sitemapPaths, slugsForSitemap } from '$lib/nextProject'
import { loadVisibleProjects } from '$lib/server/content'
import { siteUrl } from '$lib/server/site'
import type { RequestHandler } from './$types'

export const prerender = true

export const GET: RequestHandler = async () => {
	const projects = await loadVisibleProjects()
	const paths = sitemapPaths(slugsForSitemap(projects))
	const abs = (p: string) => `${siteUrl}${p === '/' ? '/' : p}`

	// One <url> per language, each pointing at its alternates.
	const entries = paths.flatMap((path) => {
		const en = abs(switchPath(path, 'en'))
		const es = abs(switchPath(path, 'es'))
		const links = `
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="es-PE" href="${es}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>`
		return [en, es].map((loc) => `  <url>\n    <loc>${loc}</loc>${links}\n  </url>`)
	})

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>`
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } })
}
