import type { NextProjectPreview } from './sanity/types'

type Resolvable = {
	_id: string
	nextProject?: NextProjectPreview | null
}

export function resolveNextProject<T extends Resolvable & NextProjectPreview>(
	current: Resolvable,
	all: T[]
): T | NextProjectPreview | null {
	const linked = current.nextProject
	if (linked && linked._id !== current._id) {
		return linked
	}

	const visible = all
		.filter((p) => !p.hidden)
		.slice()
		.sort((a, b) => a.weight - b.weight)

	if (visible.length === 0) return null

	const idx = visible.findIndex((p) => p._id === current._id)
	if (idx === -1) return visible[0]
	return visible[(idx + 1) % visible.length]
}

export function slugsForSitemap(projects: { slug: string; hidden: boolean }[]) {
	return projects.filter((p) => !p.hidden).map((p) => p.slug)
}

// Tabled: origin only. Use slugsForSitemap when /projects is public again.
export function sitemapUrls(base: string) {
	return [base]
}

export function slugsForPrerender(projects: { slug: string }[]) {
	return projects.map((p) => p.slug)
}
