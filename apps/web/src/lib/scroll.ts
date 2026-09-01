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
	twoCol: boolean
	wideFirst: boolean
}

/** Sticky `top-4`; featured card must fit below it. */
const FIRST_CARD_TOP_GAP = 16

export function cardMetrics(width: number, height: number): CardMetrics {
	if (width >= 1024) {
		return {
			first: Math.min(0.5 * width, Math.max(0, height - FIRST_CARD_TOP_GAP)),
			normal: 0.37 * width,
			twoCol: true,
			wideFirst: true
		}
	}
	if (width >= 768) {
		return { first: 0.55 * width, normal: 0.55 * width, twoCol: true, wideFirst: false }
	}
	return { first: 0.9 * width, normal: 0.9 * width, twoCol: false, wideFirst: false }
}

export function projectRow(index: number, wideFirst: boolean, twoCol: boolean) {
	if (!twoCol) return index
	if (wideFirst) return Math.floor((index + 1) / 2)
	return Math.floor(index / 2)
}

/** scrollY window where this sticky card collapses. */
export function collapseRange(
	index: number,
	cardHeight: number,
	metrics: CardMetrics,
	topOffset: number
) {
	const row = projectRow(index, metrics.wideFirst, metrics.twoCol)
	const firstRow = metrics.first + 8
	const start = firstRow + (row - 1) * (cardHeight + 8) - 16 + topOffset
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
