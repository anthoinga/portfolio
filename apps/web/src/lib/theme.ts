import type { ColorScheme, ProjectCard } from '$lib/sanity/types'

export type ThemeSource = Pick<
	ProjectCard,
	'colorScheme' | 'colorAccent' | 'colorLight' | 'colorDark' | 'colorDarkest'
>

export type CursorSurface = {
	scheme: ColorScheme
	accent: string
	ink: string
}

export function projectSurface(project: ThemeSource) {
	const light = project.colorScheme === 'light'
	return {
		background: light ? project.colorLight : project.colorDarkest,
		color: light ? project.colorDark : project.colorLight
	}
}

export function projectCssVars(project: ThemeSource) {
	const { background, color } = projectSurface(project)
	return [
		`--bg:${background}`,
		`--fg:${color}`,
		`--accent:${project.colorAccent}`,
		`--light:${project.colorLight}`,
		`--dark:${project.colorDark}`,
		`--darkest:${project.colorDarkest}`
	].join(';')
}

export function parseCssColor(color: string): [number, number, number] | null {
	const value = color.trim()
	const short = /^#([0-9a-f]{3})$/i.exec(value)
	if (short) {
		const n = short[1]
		return [parseInt(n[0] + n[0], 16), parseInt(n[1] + n[1], 16), parseInt(n[2] + n[2], 16)]
	}
	const long = /^#([0-9a-f]{6})$/i.exec(value)
	if (long) {
		const n = long[1]
		return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)]
	}
	const rgb = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i.exec(value)
	if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])]
	return null
}

export function relativeLuminance(color: string): number | null {
	const rgb = parseCssColor(color)
	if (!rgb) return null
	const lin = (channel: number) => {
		const x = channel / 255
		return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
	}
	return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2])
}

export function surfaceScheme(color: string): ColorScheme {
	const luminance = relativeLuminance(color)
	return luminance != null && luminance > 0.42 ? 'light' : 'dark'
}

export function readCursorSurface(hit: Element | null): CursorSurface {
	const root =
		typeof document === 'undefined' ? null : getComputedStyle(document.documentElement)
	const fallback: CursorSurface = {
		scheme: 'dark',
		accent: root?.getPropertyValue('--accent').trim() || '#9feedc',
		ink: '#fff'
	}
	if (!hit) return fallback

	const study = hit instanceof Element ? hit.closest('[data-cursor="case-study"]') : null
	const cs = getComputedStyle(study ?? hit)
	const accent = cs.getPropertyValue('--accent').trim() || fallback.accent
	const bg = cs.getPropertyValue('--bg').trim()
	const light = cs.getPropertyValue('--light').trim()

	// Card media usually reads much lighter than --bg/--darkest, so key off --light
	// (or treat the card as a light surface) and use a dark frost on top.
	const scheme = study
		? surfaceScheme(light || '#f2f2f2')
		: bg
			? surfaceScheme(bg)
			: fallback.scheme

	return {
		scheme,
		accent,
		ink: scheme === 'light' ? '#fff' : '#161616'
	}
}
