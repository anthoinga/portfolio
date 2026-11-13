import { loadAllProjects, loadProjectBySlug } from '$lib/server/content'
import { slugsForPrerender } from '$lib/nextProject'
import type { EntryGenerator, PageServerLoad } from './$types'

export const entries: EntryGenerator = async () => {
	const all = await loadAllProjects()
	// Optional `lang` param: '' is English, 'es' is Spanish.
	return slugsForPrerender(all).flatMap((slug) => [
		{ slug, lang: '' },
		{ slug, lang: 'es' }
	])
}

export const load: PageServerLoad = async ({ params }) => {
	const project = await loadProjectBySlug(params.slug)
	return { project }
}
