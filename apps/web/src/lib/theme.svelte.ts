export type Mode = 'light' | 'dark'

const THEME_COLOR: Record<Mode, string> = { light: '#f3f1ec', dark: '#0e1010' }

/** Current theme. The inline script in app.html sets `data-theme` before paint. */
export const theme = $state({ mode: 'light' as Mode })

export function syncTheme() {
	const attr = document.documentElement.dataset.theme
	theme.mode = attr === 'dark' ? 'dark' : 'light'
}

export function setTheme(mode: Mode) {
	theme.mode = mode
	document.documentElement.dataset.theme = mode
	document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[mode])
	try {
		localStorage.setItem('theme', mode)
	} catch {
		/* storage blocked: applies for this visit only */
	}
}

export function toggleTheme(): Mode {
	const next: Mode = theme.mode === 'dark' ? 'light' : 'dark'
	setTheme(next)
	return next
}
