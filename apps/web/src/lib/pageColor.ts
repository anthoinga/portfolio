import type { PageColorStop, PageWhen } from '$lib/sanity/types'
import { surfaceScheme } from '$lib/theme'

export const PAGE_FADE = '760ms var(--ease)'
/** A `cross` stop becomes active once its top passes this far down the scrollport. */
export const PAGE_COLOR_LINE = 0.5

export function inkFor(background: string, ink: { colorLight: string; colorDark: string }) {
	return surfaceScheme(background) === 'light' ? ink.colorDark : ink.colorLight
}

export function stopAttrs(key: string | undefined, stops: PageColorStop[] | undefined) {
	const stop = key ? stops?.find((item) => item.at === key) : undefined
	if (!stop) return {}
	return {
		'data-page-color': stop.color,
		'data-page-when': stop.when ?? 'cross',
		...(stop.line != null ? { 'data-page-line': String(stop.line) } : {})
	}
}

export function activePageColor(
	markers: { top: number; bottom: number; color: string; when: PageWhen | string; line?: number }[],
	port: { top: number; bottom: number; line: number },
	fallback: string
) {
	const span = port.bottom - port.top
	let color = fallback
	for (const marker of markers) {
		const mid = (marker.top + marker.bottom) / 2
		const at = marker.line == null ? port.line : port.top + span * marker.line
		const reached =
			marker.when === 'past'
				? marker.bottom <= port.top
				: marker.when === 'center'
					? mid <= at
					: marker.when === 'reveal'
						? marker.bottom <= port.bottom
						: marker.when === 'enter'
							? marker.top <= (marker.line == null ? port.bottom : at)
							: marker.top <= port.line
		if (reached) color = marker.color
	}
	return color
}
