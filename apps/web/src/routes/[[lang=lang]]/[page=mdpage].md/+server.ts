import { error } from '@sveltejs/kit'
import { pageDoc, renderDoc, type MdPage } from '$lib/agent/docs'
import { loadSiteModel } from '$lib/agent/model'
import { pathLang } from '$lib/i18n/core'
import { MD_PAGES } from '../../../params/mdpage'
import type { EntryGenerator, RequestHandler } from './$types'

export const prerender = true
export const entries: EntryGenerator = () =>
	MD_PAGES.flatMap((page) => [
		{ page, lang: '' },
		{ page, lang: 'es' }
	])

export const GET: RequestHandler = async ({ params, url }) => {
	if (!(MD_PAGES as readonly string[]).includes(params.page)) error(404, 'Not found')
	const model = await loadSiteModel(pathLang(url.pathname))
	const doc = pageDoc(model, params.page as MdPage)
	return new Response(renderDoc(model, doc), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
	})
}
