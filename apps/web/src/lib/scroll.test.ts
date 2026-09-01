import { describe, expect, it } from 'vitest'
import { cardMetrics, collapseRange, projectRow } from './scroll'

describe('project grid scroll geometry', () => {
	it('uses the reference breakpoints and card proportions', () => {
		expect(cardMetrics(1440, 900)).toEqual({
			first: 720,
			normal: 532.8,
			twoCol: true,
			wideFirst: true
		})
		expect(cardMetrics(800, 900)).toEqual({
			first: 440.00000000000006,
			normal: 440.00000000000006,
			twoCol: true,
			wideFirst: false
		})
		expect(cardMetrics(700, 900)).toEqual({
			first: 630,
			normal: 630,
			twoCol: false,
			wideFirst: false
		})
	})

	it('caps the first desktop card to the viewport minus sticky inset', () => {
		expect(cardMetrics(1440, 900).first).toBe(720)
		expect(cardMetrics(1200, 900).first).toBe(600)
		expect(cardMetrics(1920, 1080).first).toBe(960)
		expect(cardMetrics(2560, 1080).first).toBe(1064)
		expect(cardMetrics(1440, 700).first).toBe(684)
	})

	it('starts collapsing the first desktop card immediately', () => {
		const metrics = cardMetrics(1440, 900)
		expect(collapseRange(0, metrics.first, metrics, 0)).toEqual({
			start: -16,
			end: 704,
			row: 0
		})
	})

	it('collapses both cards in a row over the same range', () => {
		const metrics = cardMetrics(1440, 900)
		expect(projectRow(1, true, true)).toBe(1)
		expect(projectRow(2, true, true)).toBe(1)
		expect(collapseRange(1, metrics.normal, metrics, 0)).toEqual(
			collapseRange(2, metrics.normal, metrics, 0)
		)
	})
})
