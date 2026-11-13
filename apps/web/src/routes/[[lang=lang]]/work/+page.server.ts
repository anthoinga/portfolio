import { pathLang } from '$lib/i18n/core'
import { seoFor } from '$lib/i18n/seo'
import { loadVisibleProjects } from '$lib/server/content'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => ({
	projects: await loadVisibleProjects(),
	seo: seoFor('work', pathLang(url.pathname))
})
