import { homeCopy, type HomeCopy } from '$lib/data/home'
import { playgroundNotes, type PlaygroundNote } from '$lib/data/playground'
import { services, type Service } from '$lib/data/services'
import { skillGroups, type SkillGroup } from '$lib/data/skills'
import { feedEndDemo, uiDemos, type UiDemo } from '$lib/data/uiDemos'
import { localePath, type Lang } from '$lib/i18n/core'
import type { Project, SiteSettings } from '$lib/sanity/types'
import { loadVisibleProjects, loadSiteSettings, loadProjectBySlug } from '$lib/server/content'
import { siteUrl } from '$lib/server/site'

/** Everything an agent can ask about the site, in one language. Built once per build. */
export type SiteModel = {
	lang: Lang
	siteUrl: string
	/** Absolute URL for a site path in this model's language. */
	url: (path: string) => string
	settings: SiteSettings
	home: HomeCopy
	projects: Project[]
	skills: SkillGroup[]
	services: Service[]
	playground: { demo: UiDemo; note: PlaygroundNote }[]
	generatedAt: string
}

export async function loadSiteModel(lang: Lang): Promise<SiteModel> {
	const [settings, visible] = await Promise.all([loadSiteSettings(lang), loadVisibleProjects(lang)])
	// Full bodies, so the Markdown for a case study contains the case study.
	const projects = await Promise.all(visible.map((p) => loadProjectBySlug(p.slug, lang)))
	const notes = playgroundNotes(lang)
	return {
		lang,
		siteUrl,
		url: (path) => `${siteUrl}${localePath(path, lang)}`,
		settings,
		home: homeCopy[lang],
		projects,
		skills: skillGroups(lang),
		services: services(lang),
		playground: [...uiDemos, feedEndDemo].flatMap((demo) => {
			const note = notes.find((n) => n.id === demo.id)
			return note ? [{ demo, note }] : []
		}),
		generatedAt: new Date().toISOString()
	}
}
