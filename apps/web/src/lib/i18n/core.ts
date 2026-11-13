import { en, es, type MessageKey } from './messages'

/** Pure language helpers: safe to import from server code and from components alike. */
export type Lang = 'en' | 'es'

/** BCP 47 tag for <html lang> and hreflang. */
export const HTML_LANG: Record<Lang, string> = { en: 'en', es: 'es-PE' }

export function pathLang(pathname: string): Lang {
	return pathname === '/es' || pathname.startsWith('/es/') ? 'es' : 'en'
}

/** True for a case-study URL in either language. */
export function isProjectPath(pathname: string) {
	return /^\/(es\/)?projects\//.test(pathname)
}

/** Prefixes an internal path with the language segment: `/work` → `/es/work`. */
export function localePath(path: string, lang: Lang) {
	if (!path.startsWith('/') || path.startsWith('//')) return path
	if (lang === 'en') return path
	return path === '/' ? '/es' : `/es${path}`
}

/** The same page in another language. */
export function switchPath(pathname: string, to: Lang) {
	const bare = pathname === '/es' ? '/' : pathname.startsWith('/es/') ? pathname.slice(3) : pathname
	return localePath(bare, to)
}

/** Looks up an interface string. Pure: the language is always explicit. */
export function translate(lang: Lang, key: MessageKey, vars?: Record<string, string>) {
	let text: string = (lang === 'es' ? es : en)[key]
	if (vars) for (const [k, v] of Object.entries(vars)) text = text.replace(`{${k}}`, v)
	return text
}
