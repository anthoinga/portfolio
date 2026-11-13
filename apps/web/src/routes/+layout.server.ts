import { env } from '$env/dynamic/public'
import { pathLang } from '$lib/i18n/core'
import { loadSiteSettings } from '$lib/server/content'
import { siteUrl } from '$lib/server/site'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ url }) => {
	const lang = pathLang(url.pathname)
	const settings = await loadSiteSettings(lang)
	// 'vercel' turns on Vercel Web Analytics (cookieless); anything else leaves it off.
	const analytics = env.PUBLIC_ANALYTICS === 'vercel' ? 'vercel' : null
	return { settings, siteUrl, lang, analytics }
}
