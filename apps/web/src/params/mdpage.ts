import type { ParamMatcher } from '@sveltejs/kit'

/** Pages that have a Markdown twin, e.g. /skills.md. The home page is /index.md. */
export const MD_PAGES = ['index', 'playground', 'skills', 'work-with-me', 'about', 'developers'] as const

export const match: ParamMatcher = (param) => (MD_PAGES as readonly string[]).includes(param)
