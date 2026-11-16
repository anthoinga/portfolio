import { env } from '$env/dynamic/public'
import { privacyCopy } from '$lib/data/privacy'
import { pathLang } from '$lib/i18n/core'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ url }) => {
	const lang = pathLang(url.pathname)
	const copy = privacyCopy(lang, env.PUBLIC_ANALYTICS === 'vercel', Boolean(env.PUBLIC_FORM_ENDPOINT))
	return { copy, seo: { title: copy.title, description: copy.lead } }
}
