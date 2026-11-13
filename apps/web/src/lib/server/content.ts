import { building } from '$app/environment'
import { error } from '@sveltejs/kit'
import { env } from '$env/dynamic/public'
import { projectsFixture, siteSettingsEs, siteSettingsFixture } from '$lib/data/fixtures'
import type { Lang } from '$lib/i18n/core'
import { resolveNextProject } from '$lib/nextProject'
import type { Project, SiteSettings } from '$lib/sanity/types'
import { allProjectsQuery, siteSettingsQuery } from './queries'
import { getSanityClient, isSanityConfigured } from './sanity'

/**
 * Where content comes from. `fixtures` (the default) uses the typed content in
 * `$lib/data/fixtures`; `sanity` reads the Sanity dataset. Set it with
 * PUBLIC_CONTENT_SOURCE so the same code runs locally and in production.
 */
function useSanity() {
	if ((env.PUBLIC_CONTENT_SOURCE ?? 'fixtures') !== 'sanity') return false
	if (!isSanityConfigured()) {
		throw new Error(
			'PUBLIC_CONTENT_SOURCE=sanity, but Sanity is not configured. Set PUBLIC_SANITY_PROJECT_ID and SANITY_API_READ_TOKEN (see .env.example).'
		)
	}
	return true
}

// A build asks for the same content many times (every page, every language).
// Cache per language while building; in dev, always read fresh so edits show up.
const cache = new Map<string, Promise<unknown>>()
function once<T>(key: string, load: () => Promise<T>): Promise<T> {
	if (!building) return load()
	if (!cache.has(key)) cache.set(key, load())
	return cache.get(key) as Promise<T>
}

export function loadSiteSettings(lang: Lang = 'en'): Promise<SiteSettings> {
	return once(`settings:${lang}`, async () => {
		if (!useSanity()) return lang === 'es' ? { ...siteSettingsFixture, ...siteSettingsEs } : siteSettingsFixture
		const data = await getSanityClient().fetch<SiteSettings | null>(siteSettingsQuery, { lang })
		if (!data) {
			throw new Error('Sanity has no "siteSettings" document. Import the content first (see apps/studio/README).')
		}
		return data
	})
}

export function loadAllProjects(lang: Lang = 'en'): Promise<Project[]> {
	return once(`projects:${lang}`, async () => {
		if (!useSanity()) return projectsFixture
		const data = await getSanityClient().fetch<Project[]>(allProjectsQuery, { lang })
		// Never publish an empty site because of a bad token, dataset or outage.
		if (!data?.length) {
			throw new Error('Sanity returned no projects. Refusing to build an empty site.')
		}
		return data
	})
}

export async function loadVisibleProjects(lang: Lang = 'en'): Promise<Project[]> {
	const all = await loadAllProjects(lang)
	return all.filter((p) => !p.hidden).sort((a, b) => a.weight - b.weight)
}

export async function loadProjectBySlug(slug: string, lang: Lang = 'en'): Promise<Project> {
	const all = await loadAllProjects(lang)
	const project = all.find((p) => p.slug === slug) ?? null
	if (!project) error(404, 'Not found')
	return { ...project, nextProject: resolveNextProject(project, all) }
}
