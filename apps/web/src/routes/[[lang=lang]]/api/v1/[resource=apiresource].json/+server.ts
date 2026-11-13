import { json } from '@sveltejs/kit'
import { envelope, resourceData } from '$lib/agent/api'
import type { ApiResource } from '$lib/agent/developers'
import { loadSiteModel } from '$lib/agent/model'
import { pathLang } from '$lib/i18n/core'
import { API_RESOURCES } from '../../../../../params/apiresource'
import type { EntryGenerator, RequestHandler } from './$types'

export const prerender = true
export const entries: EntryGenerator = () =>
	API_RESOURCES.flatMap((resource) => [
		{ resource, lang: '' },
		{ resource, lang: 'es' }
	])

export const GET: RequestHandler = async ({ params, url }) => {
	const model = await loadSiteModel(pathLang(url.pathname))
	const resource = params.resource as ApiResource
	return json(envelope(model, resource, resourceData(model, resource)))
}
