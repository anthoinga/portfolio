import { error } from '@sveltejs/kit'
import { projectsFixture, siteSettingsFixture } from '$lib/data/fixtures'
import { resolveNextProject } from '$lib/nextProject'
import type { Project, SiteSettings } from '$lib/sanity/types'
import { allProjectsQuery, siteSettingsQuery } from './queries'
import { getSanityClient, isSanityConfigured } from './sanity'

// Fixtures even if .env has Sanity tokens. Flip to true to go live.
const SANITY_LIVE = false

function useSanity() {
	return SANITY_LIVE && isSanityConfigured()
}

export async function loadSiteSettings(): Promise<SiteSettings> {
	if (!useSanity()) return siteSettingsFixture
	const data = await getSanityClient().fetch<SiteSettings | null>(siteSettingsQuery)
	return data ?? siteSettingsFixture
}

export async function loadAllProjects(): Promise<Project[]> {
	if (!useSanity()) return projectsFixture
	const data = await getSanityClient().fetch<Project[]>(allProjectsQuery)
	return data ?? []
}

export async function loadVisibleProjects(): Promise<Project[]> {
	const all = await loadAllProjects()
	return all.filter((p) => !p.hidden).sort((a, b) => a.weight - b.weight)
}

export async function loadProjectBySlug(slug: string): Promise<Project> {
	const all = await loadAllProjects()
	const project = all.find((p) => p.slug === slug) ?? null
	if (!project) error(404, 'Not found')
	return { ...project, nextProject: resolveNextProject(project, all) }
}
