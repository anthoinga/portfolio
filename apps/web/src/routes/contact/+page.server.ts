import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => ({
	seo: {
		title: 'Contact',
		description: 'Get in touch about roles, prototypes and product design work.'
	}
})
