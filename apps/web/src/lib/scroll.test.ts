import { describe, expect, it } from 'vitest'
import { HOME, cardMetrics, collapseRange, homeFeedWidth, projectRow } from './scroll'

describe('project grid scroll geometry', () => {
	it('uses a 3:2 hero and 4:3 grid cards at each breakpoint', () => {
		const desktop = cardMetrics(1440, 900)
		const feed = homeFeedWidth(1440)
		expect(desktop.cols).toBe(2)
		expect(desktop.wideFirst).toBe(true)
		expect(desktop.first).toBeCloseTo(feed * HOME.heroRatio, 5)
		expect(desktop.normal).toBeCloseTo(((feed - HOME.cardGutter) / 2) * HOME.cardRatio, 5)

		const tablet = cardMetrics(800, 900)
		expect(tablet).toMatchObject({ cols: 2, wideFirst: false })
		expect(tablet.first).toBe(tablet.normal)
		expect(tablet.normal).toBeCloseTo(
			((800 - HOME.shellPad - HOME.cardGutter) / 2) * HOME.cardRatio,
			5
		)

		const mobile = cardMetrics(700, 900)
		expect(mobile).toMatchObject({ cols: 1, wideFirst: false })
		expect(mobile.normal).toBeCloseTo((700 - HOME.shellPad) * HOME.cardRatio, 5)
	})

	it('stops growing the hero once the feed hits its max width', () => {
		expect(cardMetrics(1440, 700).first).toBe(700 - HOME.stickyTop)
		expect(homeFeedWidth(2560)).toBe(homeFeedWidth(HOME.max))
		expect(cardMetrics(2560, 1080).first).toBe(cardMetrics(HOME.max, 1080).first)
		expect(cardMetrics(2560, 1080).normal).toBe(cardMetrics(HOME.max, 1080).normal)
		expect(cardMetrics(2560, 1080).first).toBeGreaterThan(cardMetrics(2560, 1080).normal)
	})

	it('starts collapsing the first desktop card immediately', () => {
		const metrics = cardMetrics(1440, 900)
		expect(collapseRange(0, metrics.first, metrics, 0)).toEqual({
			start: -HOME.stickyTop,
			end: metrics.first - HOME.stickyTop,
			row: 0
		})
	})

	it('collapses both cards in a row over the same range', () => {
		const metrics = cardMetrics(1440, 900)
		expect(projectRow(1, true, 2)).toBe(1)
		expect(projectRow(2, true, 2)).toBe(1)
		expect(projectRow(3, true, 2)).toBe(2)
		expect(collapseRange(1, metrics.normal, metrics, 0)).toEqual(
			collapseRange(2, metrics.normal, metrics, 0)
		)
	})
})
