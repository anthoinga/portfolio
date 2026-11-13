import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => ({
	seo: {
		title: 'Work with me',
		description: 'Ways to work together: embedded design engineering, prototype sprints, design systems and UX audits.'
	}
})
