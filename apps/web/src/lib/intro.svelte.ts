/**
 * Terminal intro state. `app.html` adds `intro-pending` to <html> before first
 * paint when the visitor has not seen the intro this session, so the page never
 * flashes underneath it. Finishing removes the class and records it in
 * sessionStorage, so navigating back home never replays it.
 */
const KEY = 'intro'

export const intro = $state({ Component: null as null | typeof import('$lib/components/intro/Terminal.svelte').default })

export function introPending(): boolean {
	return document.documentElement.classList.contains('intro-pending')
}

export function finishIntro() {
	try {
		sessionStorage.setItem(KEY, 'done')
	} catch {
		/* private mode: the intro can replay on reload, which is fine */
	}
	document.documentElement.classList.remove('intro-pending')
}

/** Loads the terminal on demand so it never weighs on the first render. */
export async function startIntro() {
	if (!introPending()) return
	const mod = await import('$lib/components/intro/Terminal.svelte')
	intro.Component = mod.default
}

export function closeIntro() {
	intro.Component = null
}
