import { page } from '$app/state'
import { type Lang, localePath as localePathFor, pathLang, translate } from './core'
import type { MessageKey } from './messages'

export { HTML_LANG, isProjectPath, pathLang, switchPath, type Lang } from './core'
export type { MessageKey }

/** The language of the page being shown. Reactive inside components. */
export function currentLang(): Lang {
	const fromData = (page.data as { lang?: Lang }).lang
	return fromData ?? pathLang(page.url.pathname)
}

export function t(key: MessageKey, vars?: Record<string, string>, lang: Lang = currentLang()) {
	return translate(lang, key, vars)
}

/** Picks the string for the current language from `{ en, es }`. */
export function pick<T>(value: { en: T; es: T }, lang: Lang = currentLang()): T {
	return value[lang]
}

/** Prefixes an internal path with the current language: `/skills` → `/es/skills`. */
export function href(path: string, lang: Lang = currentLang()) {
	return localePathFor(path, lang)
}
