import { loadAllProjects, loadProjectBySlug } from '$lib/server/content'
import { slugsForPrerender } from '$lib/nextProject'
import type { EntryGenerator, PageServerLoad } from './$types'

export const entries: EntryGenerator = async () => {
	const all = await loadAllProjects()
	return slugsForPrerender(all).map((slug) => ({ slug }))
}

export const load: PageServerLoad = async ({ params }) => {
	const project = await loadProjectBySlug(params.slug)
	return { project, next: project.nextProject }
}
