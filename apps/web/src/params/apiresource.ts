import type { ParamMatcher } from '@sveltejs/kit'

export const API_RESOURCES = ['profile', 'experience', 'skills', 'projects', 'playground', 'services'] as const

export const match: ParamMatcher = (param) => (API_RESOURCES as readonly string[]).includes(param)
