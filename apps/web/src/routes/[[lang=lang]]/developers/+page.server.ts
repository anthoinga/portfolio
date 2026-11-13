import { pathLang } from '$lib/i18n/core'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ url }) => {
	const es = pathLang(url.pathname) === 'es'
	return {
		seo: {
			title: es ? 'Para desarrolladores y agentes' : 'For developers and agents',
			description: es
				? 'Este sitio se puede leer desde un agente: llms.txt, páginas en Markdown, una API JSON y OpenAPI.'
				: 'This site is readable by agents: llms.txt, Markdown pages, a JSON API and OpenAPI.'
		}
	}
}
