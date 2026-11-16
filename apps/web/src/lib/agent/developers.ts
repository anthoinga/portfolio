import { API_RESOURCES } from '../../params/apiresource'
import type { Lang } from '$lib/i18n/core'

export type ApiResource = (typeof API_RESOURCES)[number]

const summaries: Record<ApiResource, Record<Lang, string>> = {
	profile: {
		en: 'Name, role, bio, availability, links, experience and awards.',
		es: 'Nombre, rol, bio, disponibilidad, enlaces, experiencia y premios.'
	},
	experience: {
		en: 'Credentials: past teams and roles, most recent first.',
		es: 'Credenciales: equipos y roles anteriores, lo más reciente primero.'
	},
	skills: {
		en: 'Skills grouped by discipline, with the case studies that show each in use.',
		es: 'Habilidades agrupadas por disciplina, con los casos de estudio donde se ven en uso.'
	},
	projects: {
		en: 'Case studies with summary, facts and the full text as Markdown.',
		es: 'Casos de estudio con resumen, datos y el texto completo en Markdown.'
	},
	playground: {
		en: 'Interface experiments with notes on what each one tests.',
		es: 'Experimentos de interfaz con notas sobre qué prueba cada uno.'
	},
	services: {
		en: 'The services on offer, with billing shape, typical length, what each delivers and the case study that shows it.',
		es: 'Los servicios que ofrezco, con forma de cobro, duración típica, qué entrega cada uno y el caso de estudio que lo muestra.'
	}
}

export const resourceSummary = (r: ApiResource, lang: Lang) => summaries[r][lang]

/** Content of the /developers page. Shared by the page and its Markdown twin. */
export function developersContent(lang: Lang, base: string) {
	const en = lang === 'en'
	const p = lang === 'es' ? '/es' : ''
	return {
		title: en ? 'For developers and agents' : 'Para desarrolladores y agentes',
		lead: en
			? 'This site can be read by people, scripts and AI agents. Everything here is public, needs no API key and no signup.'
			: 'Este sitio lo pueden leer personas, scripts y agentes de IA. Todo es público, sin API key y sin registro.',
		quickstartTitle: en ? 'Quickstart' : 'Inicio rápido',
		quickstart: [
			{
				label: en ? 'Everything an agent needs, as plain text' : 'Todo lo que un agente necesita, en texto plano',
				cmd: `curl ${base}${p}/llms.txt`
			},
			{
				label: en ? 'Any page as Markdown' : 'Cualquier página en Markdown',
				cmd: `curl -H 'Accept: text/markdown' ${base}${p}/skills`
			},
			{
				label: en ? 'Structured profile as JSON' : 'Perfil estructurado en JSON',
				cmd: `curl ${base}/api/v1/profile${lang === 'es' ? '?lang=es' : ''}`
			}
		],
		endpointsTitle: en ? 'REST API (read-only)' : 'API REST (solo lectura)',
		endpoints: API_RESOURCES.map((r) => ({
			path: `/api/v1/${r}`,
			summary: summaries[r][lang]
		})),
		apiNote: en
			? 'Responses look like { "apiVersion": "v1", "data": …, "meta": … }. Add ?lang=es for Peruvian Spanish. The full description is in the OpenAPI document.'
			: 'Las respuestas tienen la forma { "apiVersion": "v1", "data": …, "meta": … }. Agrega ?lang=es para español peruano. La descripción completa está en el documento OpenAPI.',
		discoveryTitle: en ? 'Discovery files' : 'Archivos de descubrimiento',
		discovery: [
			{ path: `${p}/llms.txt`, label: en ? 'Context for language models' : 'Contexto para modelos de lenguaje' },
			{ path: '/openapi.json', label: en ? 'OpenAPI 3.1 description' : 'Descripción OpenAPI 3.1' },
			{ path: '/.well-known/api-catalog', label: en ? 'API catalog (RFC 9727)' : 'Catálogo de APIs (RFC 9727)' },
			{ path: '/sitemap.xml', label: en ? 'Every page, both languages' : 'Todas las páginas, en ambos idiomas' },
			{ path: `${p}/index.md`, label: en ? 'Home page as Markdown' : 'Página de inicio en Markdown' }
		],
		noteTitle: en ? 'Good to know' : 'Conviene saber',
		note: en
			? 'The site is static and rebuilt on every deploy, so the data is current as of the last deploy, and fast. There is no authentication, and nothing to write to.'
			: 'El sitio es estático y se reconstruye en cada deploy, así que los datos están al día con el último deploy y responden rápido. No hay autenticación ni nada donde escribir.'
	}
}
