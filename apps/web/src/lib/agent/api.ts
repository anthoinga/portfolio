import type { ApiResource } from './developers'
import { projectMarkdown } from './markdown'
import type { SiteModel } from './model'

/** `{ apiVersion, data, meta }` envelope used by every endpoint. */
export function envelope(m: SiteModel, resource: ApiResource, data: unknown) {
	return {
		apiVersion: 'v1',
		data,
		meta: {
			resource,
			lang: m.lang === 'es' ? 'es-PE' : 'en',
			canonical: `${m.siteUrl}/api/v1/${resource}${m.lang === 'es' ? '?lang=es' : ''}`,
			generatedAt: m.generatedAt
		}
	}
}

export function resourceData(m: SiteModel, resource: ApiResource): unknown {
	const s = m.settings
	const abs = (u: string) => (u.startsWith('http') ? u : `${m.siteUrl}${u}`)
	switch (resource) {
		case 'profile':
			return {
				name: s.name,
				role: s.role,
				bio: s.bio,
				availability: m.home.status,
				languages: ['en', 'es-PE'],
				website: m.url('/'),
				links: {
					email: s.email,
					linkedin: s.linkedin,
					github: s.github
				},
				experience: s.experiences,
				awards: s.awards
			}
		case 'experience':
			return s.experiences
		case 'skills':
			return m.skills.map((g) => ({
				id: g.id,
				title: g.title,
				summary: g.summary,
				skills: g.skills,
				proof: g.proof.map((p) => ({
					label: p.label,
					url: m.url(p.slug.startsWith('/') ? p.slug : `/projects/${p.slug}`)
				}))
			}))
		case 'projects':
			return m.projects.map((p) => ({
				slug: p.slug,
				title: p.title,
				description: p.description,
				scope: p.scope,
				year: p.year,
				tags: p.tags,
				url: m.url(`/projects/${p.slug}`),
				markdown: `${m.url(`/projects/${p.slug}`)}.md`,
				facts: p.brief?.facts,
				content: projectMarkdown(p, abs)
			}))
		case 'playground':
			return m.playground.map(({ demo, note }) => ({
				id: demo.id,
				title: demo.title,
				year: demo.year,
				note: note.note,
				testing: note.testing,
				stack: note.stack,
				url: demo.href ?? m.url('/playground')
			}))
		case 'services':
			return m.services
	}
}
