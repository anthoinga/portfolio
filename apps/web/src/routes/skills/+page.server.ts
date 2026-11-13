import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => ({
	seo: {
		title: 'Skills',
		description: 'What I design and build with, and the case studies that show each one in use.'
	}
})
