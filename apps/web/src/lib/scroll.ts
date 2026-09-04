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

/** Keep in lockstep with the home shell in `app.css`. */
export const HOME = {
	md: 768,
	lg: 1024,
	/** 120rem */
	max: 1920,
	/** `.home-shell` `mx-6` on both sides */
	shellPad: 48,
	/** `.home-shell` `gap-4` */
	gap: 16,
	cols: 9,
	feedCols: 7,
	/** Feed `gap-3` */
	cardGutter: 12,
	/** Sticky `top-4` */
	stickyTop: 16,
	/** Landscape 4:3 */
	cardRatio: 3 / 4,
	/** Landscape 3:2 */
	heroRatio: 2 / 3
} as const

function spanWidth(shell: number, tracks: number) {
	const fr = (shell - (HOME.cols - 1) * HOME.gap) / HOME.cols
	return tracks * fr + (tracks - 1) * HOME.gap
}

export function homeFeedWidth(viewW: number) {
	const shell = Math.max(0, viewW - HOME.shellPad)
	if (viewW < HOME.lg) return shell
	return Math.min(spanWidth(shell, HOME.feedCols), spanWidth(HOME.max - HOME.shellPad, HOME.feedCols))
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

export function cardMetrics(width: number, height: number): CardMetrics {
	if (width >= HOME.lg) {
		return {
			first: ratioHeight(homeFeedWidth(width), HOME.heroRatio, height),
			normal: ratioHeight(gridCardWidth(width, 2), HOME.cardRatio),
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

export const navMemory: { lastCard: LastCard | null; workspaceOpen: boolean; workspaceScroll: number } = {
	lastCard: null,
	workspaceOpen: false,
	workspaceScroll: 0
}

export function rememberCard(node: HTMLElement, slug: string) {
	const r = node.getBoundingClientRect()
	navMemory.lastCard = { slug, top: r.top, left: r.left, width: r.width, height: r.height }
}
