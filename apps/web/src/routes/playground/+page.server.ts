import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => ({
	seo: {
		title: 'Playground',
		description: 'Small interface experiments: dithering, a dock nav, a forecast widget and a menu.'
	}
})
