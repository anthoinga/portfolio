import { loadSiteSettings } from '$lib/server/content'
import { siteUrl } from '$lib/server/site'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async () => {
	const settings = await loadSiteSettings()
	return { settings, siteUrl }
}
