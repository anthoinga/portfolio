import { json } from '@sveltejs/kit'
import { openApi } from '$lib/agent/openapi'
import { loadSiteSettings } from '$lib/server/content'
import { siteUrl } from '$lib/server/site'
import type { RequestHandler } from './$types'

export const prerender = true

export const GET: RequestHandler = async () => {
	const settings = await loadSiteSettings('en')
	return json(openApi(siteUrl, settings.name))
}
