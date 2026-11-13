import { error } from '@sveltejs/kit'
import { projectDoc, renderDoc } from '$lib/agent/docs'
import { loadSiteModel } from '$lib/agent/model'
import { pathLang } from '$lib/i18n/core'
import { loadVisibleProjects } from '$lib/server/content'
import type { EntryGenerator, RequestHandler } from './$types'

export const prerender = true
export const entries: EntryGenerator = async () => {
	const visible = await loadVisibleProjects()
	return visible.flatMap((p) => [
		{ slug: p.slug, lang: '' },
		{ slug: p.slug, lang: 'es' }
	])
}

export const GET: RequestHandler = async ({ params, url }) => {
	const model = await loadSiteModel(pathLang(url.pathname))
	const doc = projectDoc(model, params.slug)
	if (!doc) error(404, 'Not found')
	return new Response(renderDoc(model, doc), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
	})
}
