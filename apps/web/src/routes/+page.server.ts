import { loadVisibleProjects } from '$lib/server/content'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const projects = await loadVisibleProjects()
	return { projects }
}
