import { pathLang } from '$lib/i18n/core'
import { loadVisibleProjects } from '$lib/server/content'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const projects = await loadVisibleProjects(pathLang(url.pathname))
	return { projects }
}
