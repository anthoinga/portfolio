import { describe, expect, it } from 'vitest'
import { resolveNextProject, sitemapUrls, slugsForPrerender, slugsForSitemap } from './nextProject'

const atlas = {
	_id: 'atlas',
	title: 'Atlas Kitchen',
	slug: 'atlas-kitchen',
	hidden: false,
	weight: 1,
	colorAccent: '#0f0',
	colorLight: '#fff',
	colorDark: '#111',
	colorDarkest: '#000',
	colorScheme: 'dark' as const,
	poster: null
}

const night = { ...atlas, _id: 'night', title: 'Night Bus', slug: 'night-bus', weight: 2 }
const glass = { ...atlas, _id: 'glass', title: 'Glass Radio', slug: 'glass-radio', weight: 3 }
const field = { ...atlas, _id: 'field', title: 'Field Notes', slug: 'field-notes', weight: 4 }
const hidden = { ...atlas, _id: 'hid', title: 'Hidden', slug: 'hidden-archive', weight: 99, hidden: true }

const all = [atlas, night, glass, field, hidden]

describe('resolveNextProject', () => {
	it('uses the explicit nextProject when present and not self', () => {
		const current = { ...atlas, nextProject: night }
		expect(resolveNextProject(current, all)?._id).toBe('night')
	})

	it('ignores a self-reference and falls back by weight', () => {
		const current = { ...atlas, nextProject: atlas }
		expect(resolveNextProject(current, all)?._id).toBe('night')
	})

	it('wraps from last visible to first', () => {
		const current = { ...field, nextProject: null }
		expect(resolveNextProject(current, all)?._id).toBe('atlas')
	})

	it('skips hidden projects in the fallback chain', () => {
		const current = { ...field, nextProject: null }
		const next = resolveNextProject(current, all)
		expect(next?._id).not.toBe('hid')
		expect(next?._id).toBe('atlas')
	})

	it('falls back when nextProject is missing', () => {
		const current = { ...night, nextProject: null }
		expect(resolveNextProject(current, all)?._id).toBe('glass')
	})
})

describe('sitemap vs prerender slugs', () => {
	it('prerenders hidden slugs', () => {
		expect(slugsForPrerender(all)).toContain('hidden-archive')
	})

	it('omits hidden slugs from the sitemap helper', () => {
		expect(slugsForSitemap(all)).not.toContain('hidden-archive')
		expect(slugsForSitemap(all)).toEqual(['atlas-kitchen', 'night-bus', 'glass-radio', 'field-notes'])
	})
})

describe('tabled public sitemap', () => {
	it('lists the origin only', () => {
		const urls = sitemapUrls('https://example.com')
		expect(urls).toEqual(['https://example.com'])
		expect(urls.join('')).not.toContain('/projects/')
	})
})
