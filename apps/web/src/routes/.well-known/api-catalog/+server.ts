import { siteUrl } from '$lib/server/site'
import type { RequestHandler } from './$types'

export const prerender = true

/** RFC 9727 API catalog: a linkset pointing at the API's description. */
export const GET: RequestHandler = () => {
	const linkset = {
		linkset: [
			{
				anchor: `${siteUrl}/api/v1`,
				'service-desc': [{ href: `${siteUrl}/openapi.json`, type: 'application/vnd.oai.openapi+json' }],
				'service-doc': [{ href: `${siteUrl}/developers`, type: 'text/html' }]
			}
		]
	}
	return new Response(JSON.stringify(linkset, null, 2), {
		headers: { 'Content-Type': 'application/linkset+json' }
	})
}
