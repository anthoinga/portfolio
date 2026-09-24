import type { ColorScheme } from '$lib/sanity/types'

export type UiDemoId = 'dock' | 'dither' | 'weather' | 'tmb'

export type UiDemo = {
	id: UiDemoId
	title: string
	year: number
	colorScheme: ColorScheme
	colorAccent: string
	colorLight: string
	colorDark: string
	colorDarkest: string
	video?: string
	poster?: string
	href?: string
}

/** Placeholders for UI-effect demos interleaved on the home feed. */
export const uiDemos: UiDemo[] = [
	{
		id: 'dither',
		title: 'Dither',
		year: 2025,
		colorScheme: 'dark',
		colorAccent: '#c8c8c8',
		colorLight: '#f5f5f5',
		colorDark: '#1a1a1a',
		colorDarkest: '#050505'
	},
	{
		id: 'dock',
		title: 'Dock',
		year: 2025,
		colorScheme: 'light',
		colorAccent: '#6b8f71',
		colorLight: '#eef2ec',
		colorDark: '#1c241c',
		colorDarkest: '#101510'
	},
	{
		id: 'weather',
		title: 'Weather',
		year: 2024,
		colorScheme: 'light',
		colorAccent: '#f5c542',
		colorLight: '#f3f6fb',
		colorDark: '#1c2430',
		colorDarkest: '#10151c'
	}
]

/** Pinned under the checkerboard so it stays the last card in the feed. */
export const feedEndDemo: UiDemo = {
	id: 'tmb',
	title: 'Menu',
	year: 2025,
	colorScheme: 'dark',
	colorAccent: '#e4c8cc',
	colorLight: '#f6eeef',
	colorDark: '#2a1218',
	colorDarkest: '#12080c',
	video: '/demos/tmb.mp4',
	poster: '/demos/tmb.jpg',
	href: 'https://inga.dev'
}
