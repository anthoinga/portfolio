import { env } from '$env/dynamic/public'
import { pathLang } from '$lib/i18n/core'
import { seoFor } from '$lib/i18n/seo'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ url }) => ({
	seo: seoFor('workWithMe', pathLang(url.pathname)),
	// A form service endpoint (e.g. Formspree). Unset: the form copies the contact email instead.
	formEndpoint: env.PUBLIC_FORM_ENDPOINT || null
})
