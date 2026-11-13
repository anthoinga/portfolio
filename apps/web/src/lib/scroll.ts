export function clamp(n: number, min: number, max: number) {
	return Math.min(max, Math.max(min, n))
}

export function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
	if (inMax === inMin) return outMin
	const t = clamp((value - inMin) / (inMax - inMin), 0, 1)
	return lerp(outMin, outMax, t)
}

export type CardMetrics = {
	first: number
	normal: number
	cols: number
	wideFirst: boolean
}

/** Keep in lockstep with `.page-shell` / `--page-max` in `app.css`. */
export const HOME = {
	md: 768,
	lg: 1024,
	/** `--page-max` is 88rem */
	pageMax: 1408,
	/** `.page-shell` side gutters (`--home-pad-x` each side) */
	shellPad: 48,
	/** Feed `gap-3` */
	cardGutter: 12,
	/** Sticky `top-4` */
	stickyTop: 16,
	/** Landscape 4:3 */
	cardRatio: 3 / 4,
	/** Landscape 3:2 */
	heroRatio: 2 / 3
} as const

/** Width of the selected-work feed: the page column, centred. */
export function homeFeedWidth(viewW: number) {
	return Math.min(Math.max(0, viewW - HOME.shellPad), HOME.pageMax)
}

function gridCardWidth(viewW: number, cols: number) {
	const feed = homeFeedWidth(viewW)
	if (cols <= 1) return feed
	return (feed - (cols - 1) * HOME.cardGutter) / cols
}

function ratioHeight(cardWidth: number, ratio: number, viewH?: number) {
	const height = cardWidth * ratio
	if (viewH == null) return height
	return Math.min(height, Math.max(0, viewH - HOME.stickyTop))
}

/**
 * `wideFirst` makes the first card span the whole row on large screens (the
 * home feed). Pass `false` for an even two-column grid, as on /work.
 */
export function cardMetrics(width: number, height: number, wideFirst = true): CardMetrics {
	if (width >= HOME.lg) {
		const normal = ratioHeight(gridCardWidth(width, 2), HOME.cardRatio)
		if (!wideFirst) return { first: normal, normal, cols: 2, wideFirst: false }
		return {
			first: ratioHeight(homeFeedWidth(width), HOME.heroRatio, height),
			normal,
			cols: 2,
			wideFirst: true
		}
	}
	if (width >= HOME.md) {
		const card = ratioHeight(gridCardWidth(width, 2), HOME.cardRatio)
		return { first: card, normal: card, cols: 2, wideFirst: false }
	}
	const card = ratioHeight(homeFeedWidth(width), HOME.cardRatio)
	return { first: card, normal: card, cols: 1, wideFirst: false }
}

export function projectRow(index: number, wideFirst: boolean, cols: number) {
	if (cols <= 1) return index
	if (wideFirst) return Math.floor((index + cols - 1) / cols)
	return Math.floor(index / cols)
}

/** scrollY window where this sticky card collapses. */
export function collapseRange(
	index: number,
	cardHeight: number,
	metrics: CardMetrics,
	topOffset: number
) {
	const row = projectRow(index, metrics.wideFirst, metrics.cols)
	const firstRow = metrics.first + HOME.cardGutter
	const start = firstRow + (row - 1) * (cardHeight + HOME.cardGutter) - HOME.stickyTop + topOffset
	const end = start + cardHeight
	return { start, end, row }
}

export type LastCard = {
	slug: string
	top: number
	left: number
	width: number
	height: number
}

export const navMemory: {
	lastCard: LastCard | null
	workspaceScroll: number
	/** Page the visitor opened the case study from, so closing it goes back there. */
	returnTo: string
} = {
	lastCard: null,
	workspaceScroll: 0,
	returnTo: '/'
}

export function rememberCard(node: HTMLElement, slug: string) {
	const r = node.getBoundingClientRect()
	navMemory.lastCard = { slug, top: r.top, left: r.left, width: r.width, height: r.height }
	navMemory.returnTo = window.location.pathname || '/'
}
