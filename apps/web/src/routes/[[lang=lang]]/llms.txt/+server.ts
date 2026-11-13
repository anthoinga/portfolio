import { llmsTxt } from '$lib/agent/docs'
import { loadSiteModel } from '$lib/agent/model'
import { pathLang } from '$lib/i18n/core'
import type { EntryGenerator, RequestHandler } from './$types'

export const prerender = true
export const entries: EntryGenerator = () => [{ lang: '' }, { lang: 'es' }]

export const GET: RequestHandler = async ({ url }) => {
	const model = await loadSiteModel(pathLang(url.pathname))
	return new Response(llmsTxt(model), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
