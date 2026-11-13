import type { ParamMatcher } from '@sveltejs/kit'

/** English lives at the root; Spanish lives under `/es`. */
export const match: ParamMatcher = (param) => param === 'es'
