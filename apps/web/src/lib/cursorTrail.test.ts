import { describe, expect, it, vi } from 'vitest'
import { cellFromKey, cellKey, paintTrail, stamp } from './cursorTrail'

describe('cursor trail', () => {
	it('round-trips packed cell coordinates', () => {
		for (const [gx, gy] of [
			[0, 0],
			[12, -4],
			[-20, 80]
		] as const) {
			expect(cellFromKey(cellKey(gx, gy))).toEqual([gx, gy])
		}
	})

	it('stamps energy and paints some cells', () => {
		const energy = new Map<number, number>()
		stamp(energy, 40, 40, 18, 0.78)
		expect(energy.size).toBeGreaterThan(0)

		const fillRect = vi.fn()
		const ctx = {
			clearRect: vi.fn(),
			fillRect,
			fillStyle: ''
		} as unknown as CanvasRenderingContext2D

		paintTrail(ctx, energy, 800, 600)
		expect(ctx.clearRect).toHaveBeenCalled()
		expect(fillRect.mock.calls.length).toBeGreaterThan(0)
		expect(energy.size).toBeGreaterThan(0)
	})
})
