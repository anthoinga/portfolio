import type { ParamMatcher } from '@sveltejs/kit'

/** Pages that have a Markdown twin, e.g. /work.md. The home page is /index.md. */
export const MD_PAGES = ['index', 'work', 'playground', 'skills', 'work-with-me', 'contact', 'developers'] as const

export const match: ParamMatcher = (param) => (MD_PAGES as readonly string[]).includes(param)
