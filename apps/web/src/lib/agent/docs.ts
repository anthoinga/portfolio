import { MD_PAGES } from '../../params/mdpage'
import { translate, type Lang } from '$lib/i18n/core'
import { aboutCopy } from '$lib/data/about'
import { developersContent } from './developers'
import { projectMarkdown } from './markdown'
import type { SiteModel } from './model'

export type MdPage = (typeof MD_PAGES)[number]
export type Doc = { title: string; description: string; path: string; body: string }

const T = (m: SiteModel, key: Parameters<typeof translate>[1]) => translate(m.lang, key)
const link = (label: string, url: string) => `[${label}](${url})`

/** Cuts at a word boundary, adding an ellipsis, so summaries never end mid-word. */
function short(text: string, max = 110) {
	if (text.length <= max) return text
	return `${text.slice(0, text.lastIndexOf(' ', max)).replace(/[,:;.\s]+$/, '')}…`
}

const NAV_KEY = {
	index: 'nav.home',
	playground: 'nav.playground',
	skills: 'nav.skills',
	'work-with-me': 'nav.services',
	about: 'nav.about',
	developers: 'nav.home'
} as const

/** Public site path for a Markdown page, e.g. `work-with-me` → `/work-with-me`. */
export const sitePath = (page: MdPage) => (page === 'index' ? '/' : `/${page}`)
export const mdPath = (page: MdPage) => `/${page}.md`

export function frontMatter(m: SiteModel, d: Doc) {
	const quote = (s: string) => JSON.stringify(s)
	return [
		'---',
		`title: ${quote(d.title)}`,
		`description: ${quote(d.description)}`,
		`canonical: ${quote(m.url(d.path))}`,
		`last-updated: ${quote(m.generatedAt.slice(0, 10))}`,
		`author: ${quote(m.settings.name)}`,
		`site: ${quote(new URL(m.siteUrl).host)}`,
		`language: ${quote(m.lang === 'es' ? 'es-PE' : 'en')}`,
		'---',
		''
	].join('\n')
}

function links(m: SiteModel) {
	const s = m.settings
	return [
		s.email && `- Email: ${s.email}`,
		s.linkedin && `- LinkedIn: ${s.linkedin}`,
		s.github && `- GitHub: ${s.github}`
	].filter(Boolean) as string[]
}

const credits = (rows: { org: string; role?: string }[]) =>
	rows.map((r) => `- ${r.org}${r.role ? ` — ${r.role}` : ''}`).join('\n')

function agentFooter(m: SiteModel) {
	const en = m.lang === 'en'
	return [
		en ? '## For agents' : '## Para agentes',
		`- ${link('llms.txt', m.url('/llms.txt'))}`,
		`- ${link(en ? 'Developer portal' : 'Portal para desarrolladores', m.url('/developers'))}`,
		`- ${link('OpenAPI', `${m.siteUrl}/openapi.json`)}`
	].join('\n')
}

export function pageDoc(m: SiteModel, page: MdPage): Doc {
	const s = m.settings
	const en = m.lang === 'en'
	const path = sitePath(page)
	switch (page) {
		case 'index':
			return {
				title: `${s.name} — ${s.role ?? ''}`.replace(/ — $/, ''),
				description: s.bio ?? '',
				path,
				body: [
					`# ${s.name}`,
					`**${s.role ?? ''}** · ${m.home.status}`,
					m.home.lead,
					`## ${m.home.work.label}`,
					...m.projects.map((p) =>
						[
							`### ${link(p.title, m.url(`/projects/${p.slug}`))}`,
							p.description ?? '',
							[p.scope, p.year, p.tags?.join(', ')].filter(Boolean).join(' · ')
						]
							.filter(Boolean)
							.join('\n\n')
					),
					`## ${en ? 'Elsewhere' : 'En otros lugares'}`,
					links(m).join('\n'),
					agentFooter(m)
				].join('\n\n')
			}
		case 'playground':
			return {
				title: T(m, 'playground.title'),
				description: T(m, 'playground.lead'),
				path,
				body: [
					`# ${T(m, 'playground.title')}`,
					T(m, 'playground.lead'),
					...m.playground.map(({ demo, note }) =>
						[
							`## ${demo.title}`,
							note.note,
							`**${T(m, 'playground.testing')}:** ${note.testing}`,
							note.stack.join(' · ')
						].join('\n\n')
					)
				].join('\n\n')
			}
		case 'skills':
			return {
				title: T(m, 'skills.title'),
				description: T(m, 'skills.lead'),
				path,
				body: [
					`# ${T(m, 'skills.title')}`,
					T(m, 'skills.lead'),
					...m.skills.map((g) =>
						[
							`## ${g.title}`,
							g.summary,
							g.skills.map((k) => `- ${k}`).join('\n'),
							`${T(m, 'skills.seeIn')}: ${g.proof
								.map((p) => link(p.label, m.url(p.slug.startsWith('/') ? p.slug : `/projects/${p.slug}`)))
								.join(', ')}`
						].join('\n\n')
					)
				].join('\n\n')
			}
		case 'work-with-me':
			return {
				title: T(m, 'wwm.title'),
				description: T(m, 'wwm.lead'),
				path,
				body: [
					`# ${T(m, 'wwm.title')}`,
					T(m, 'wwm.lead'),
					T(m, 'wwm.unsure'),
					...m.services.map((v) =>
						[
							`## ${v.title}`,
							v.summary,
							`${T(m, 'wwm.seeIn')}: ${link(v.proof.label, m.url(`/projects/${v.proof.slug}`))}`
						].join('\n\n')
					),
					`## ${T(m, 'form.title')}`,
					T(m, 'form.lead'),
					links(m).join('\n'),
					agentFooter(m)
				].join('\n\n')
			}
		case 'about': {
			const a = aboutCopy(m.lang)
			return {
				title: a.title,
				description: a.lead,
				path,
				body: [
					`# ${a.title}`,
					a.lead,
					...a.story,
					`## ${a.building.label}`,
					...a.building.paragraphs,
					`## ${a.credentialsLabel}`,
					[credits(s.experiences), credits(s.awards)].filter(Boolean).join('\n'),
					`## ${a.elsewhereLabel}`,
					links(m).join('\n'),
					agentFooter(m)
				].join('\n\n')
			}
		}
		case 'developers': {
			const d = developersContent(m.lang, m.siteUrl)
			return {
				title: d.title,
				description: d.lead,
				path,
				body: [
					`# ${d.title}`,
					d.lead,
					`## ${d.quickstartTitle}`,
					d.quickstart.map((q) => `${q.label}:\n\n\`\`\`bash\n${q.cmd}\n\`\`\``).join('\n\n'),
					`## ${d.endpointsTitle}`,
					d.endpoints.map((e) => `- \`GET ${e.path}\` — ${e.summary}`).join('\n'),
					d.apiNote,
					`## ${d.discoveryTitle}`,
					d.discovery.map((x) => `- ${link(x.label, `${m.siteUrl}${x.path}`)}`).join('\n'),
					`## ${d.noteTitle}`,
					d.note
				].join('\n\n')
			}
		}
	}
}

export function projectDoc(m: SiteModel, slug: string): Doc | null {
	const p = m.projects.find((x) => x.slug === slug)
	if (!p) return null
	const abs = (u: string) => (u.startsWith('http') ? u : `${m.siteUrl}${u}`)
	return {
		title: p.seoTitle || p.title,
		description: p.seoDescription || p.description || '',
		path: `/projects/${p.slug}`,
		body: [`# ${p.title}`, projectMarkdown(p, abs), `${link(m.home.work.label, m.url('/#work'))}`].join('\n\n')
	}
}

export const renderDoc = (m: SiteModel, d: Doc) => `${frontMatter(m, d)}\n${d.body}\n`

/** The llms.txt convention: who this is, when to use the site, and how to call it. */
export function llmsTxt(m: SiteModel): string {
	const s = m.settings
	const en = m.lang === 'en'
	const base = m.siteUrl
	const projectLines = m.projects.map(
		(p) => `- [${p.title}](${m.url(`/projects/${p.slug}`)}.md)${p.description ? `: ${p.description}` : ''}`
	)
	const lines = [
		`# ${s.name}`,
		'',
		`> ${s.role ?? ''}. ${m.home.status}.`,
		'',
		s.bio ?? '',
		'',
		`Website: ${m.url('/')}`,
		s.email ? `Email: ${s.email}` : '',
		s.linkedin ? `LinkedIn: ${s.linkedin}` : '',
		s.github ? `GitHub: ${s.github}` : '',
		`Last updated: ${m.generatedAt.slice(0, 10)}`,
		'',
		en ? '## Key links' : '## Enlaces clave',
		'',
		...(['index', 'playground', 'skills', 'work-with-me', 'about', 'developers'] as MdPage[]).map(
			(pg) => {
				const label = pg === 'developers' ? (en ? 'Developers' : 'Desarrolladores') : T(m, NAV_KEY[pg])
				return `- [${label}](${m.url(sitePath(pg))}): ${short(pageDoc(m, pg).description)}`
			}
		),
		`- [OpenAPI](${base}/openapi.json): ${en ? 'machine-readable API description' : 'descripción de la API legible por máquinas'}`,
		`- [Sitemap](${base}/sitemap.xml)`,
		'',
		en ? '## When to use this' : '## Cuándo usar esto',
		'',
		en
			? `Use this site when a request is about ${s.name} specifically: who they are, their work, how to reach them, or whether they are a fit to design and build an app. It is one person's portfolio, not general documentation. For unrelated design or engineering questions, use primary sources.`
			: `Usa este sitio cuando la consulta sea sobre ${s.name} en particular: quién es, su trabajo, cómo contactarle o si encajan para diseñar y construir una app. Es el portafolio de una persona, no documentación general. Para consultas de diseño o ingeniería sin relación, usa fuentes primarias.`,
		'',
		en ? '## How to call this site' : '## Cómo consultar este sitio',
		'',
		`- ${en ? 'Any page as Markdown' : 'Cualquier página en Markdown'}: \`Accept: text/markdown\`, or add \`.md\` (e.g. ${m.url('/skills')}.md)`,
		`- ${en ? 'Structured data' : 'Datos estructurados'}: ${base}/api/v1/profile ${en ? '(add ?lang=es for Spanish)' : '(agrega ?lang=es para español)'}`,
		`- ${en ? 'Both languages' : 'Ambos idiomas'}: ${base}/llms.txt, ${base}/es/llms.txt`,
		'',
		en ? '## Credentials' : '## Credenciales',
		'',
		credits(s.experiences),
		'',
		en ? '## Awards' : '## Premios',
		'',
		credits(s.awards),
		'',
		en ? '## Skills' : '## Habilidades',
		'',
		...m.skills.map((g) => `- **${g.title}**: ${g.skills.join(', ')}`),
		'',
		en ? '## Case studies' : '## Casos de estudio',
		'',
		...projectLines,
		'',
		en ? '## Playground' : '## Playground',
		'',
		...m.playground.map(({ demo, note }) => `- ${demo.title}: ${note.note}`),
		'',
		en ? '## Ways to work together' : '## Formas de trabajar juntos',
		'',
		...m.services.map((v) => `- **${v.title}**: ${v.summary}`),
		'',
		en ? '## Contact' : '## Contacto',
		'',
		en
			? `To start a project, email ${s.name}${s.email ? ` at ${s.email}` : ''}, or use the enquiry form on ${m.url('/work-with-me')}#enquire in a browser. There is no API to POST an enquiry to.`
			: `Para iniciar un proyecto, escribe a ${s.name}${s.email ? ` a ${s.email}` : ''}, o usa el formulario de consulta en ${m.url('/work-with-me')}#enquire desde un navegador. No hay una API a la que enviar consultas.`,
		''
	]
	return lines.filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n')
}
