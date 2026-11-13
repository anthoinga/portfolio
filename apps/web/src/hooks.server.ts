import type { Handle } from '@sveltejs/kit'

/** Sets <html lang> for prerendered pages: Spanish for /es, English otherwise. */
export const handle: Handle = ({ event, resolve }) => {
	const p = event.url.pathname
	const lang = p === '/es' || p.startsWith('/es/') ? 'es-PE' : 'en'
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('<html lang="en">', `<html lang="${lang}">`)
	})
}
