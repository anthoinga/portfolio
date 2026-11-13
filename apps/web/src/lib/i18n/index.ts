import { page } from '$app/state'
import { type Lang, localePath as localePathFor, pathLang } from './core'
import { en, es, type MessageKey } from './messages'

export { HTML_LANG, isProjectPath, pathLang, switchPath, type Lang } from './core'
export type { MessageKey }

/** The language of the page being shown. Reactive inside components. */
export function currentLang(): Lang {
	const fromData = (page.data as { lang?: Lang }).lang
	return fromData ?? pathLang(page.url.pathname)
}

export function t(key: MessageKey, vars?: Record<string, string>, lang: Lang = currentLang()) {
	let text: string = (lang === 'es' ? es : en)[key]
	if (vars) for (const [k, v] of Object.entries(vars)) text = text.replace(`{${k}}`, v)
	return text
}

/** Picks the string for the current language from `{ en, es }`. */
export function pick<T>(value: { en: T; es: T }, lang: Lang = currentLang()): T {
	return value[lang]
}

/** Prefixes an internal path with the current language: `/work` → `/es/work`. */
export function href(path: string, lang: Lang = currentLang()) {
	return localePathFor(path, lang)
}
