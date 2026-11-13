import { loadVisibleProjects } from '$lib/server/content'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => ({
	projects: await loadVisibleProjects(),
	seo: {
		title: 'Work',
		description: 'Case studies in product design, research and prototyping.'
	}
})
