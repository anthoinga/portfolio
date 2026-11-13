import { pathLang } from '$lib/i18n/core'
import { seoFor } from '$lib/i18n/seo'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ url }) => ({
	seo: seoFor('workWithMe', pathLang(url.pathname))
})
