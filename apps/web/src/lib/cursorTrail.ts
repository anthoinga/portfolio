export const TRAIL = {
	cell: 5,
	maxCells: 1400,
	decay: 0.86,
	minEnergy: 0.03,
	energyCap: 1.15,
	follow: 0.32,
	stampAfter: 0.25,
	step: 5 * 0.55,
	minDeposit: 0.28,
	stepSpread: 0.18,
	solidAt: 0.72,
	settle: 0.05,
	idleAfter: 180,
	color: '#fff',
	radius: { rest: 18, pill: 28 },
	amount: { rest: 0.78, pill: 0.55 }
} as const

const ORIGIN = 32768

const BAYER = [
	0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28,
	52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39,
	13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21
].map((n) => (n + 0.5) / 64)

export type TrailEnergy = Map<number, number>

export function cellKey(gx: number, gy: number) {
	return ((gx + ORIGIN) << 16) | (gy + ORIGIN)
}

export function cellFromKey(key: number): [number, number] {
	return [(key >>> 16) - ORIGIN, (key & 0xffff) - ORIGIN]
}

export function stamp(energy: TrailEnergy, px: number, py: number, radius: number, amount: number) {
	const r = radius / TRAIL.cell
	const cx = px / TRAIL.cell
	const cy = py / TRAIL.cell
	const x0 = Math.floor(cx - r)
	const x1 = Math.ceil(cx + r)
	const y0 = Math.floor(cy - r)
	const y1 = Math.ceil(cy + r)
	for (let gy = y0; gy <= y1; gy++) {
		for (let gx = x0; gx <= x1; gx++) {
			const dx = gx + 0.5 - cx
			const dy = gy + 0.5 - cy
			const d = Math.hypot(dx, dy)
			if (d > r) continue
			const key = cellKey(gx, gy)
			const current = energy.get(key)
			if (current == null && energy.size >= TRAIL.maxCells) continue
			const falloff = 1 - d / r
			energy.set(key, Math.min(TRAIL.energyCap, (current ?? 0) + amount * falloff * falloff))
		}
	}
}

export function clearTrail(ctx: CanvasRenderingContext2D, width: number, height: number) {
	ctx.clearRect(0, 0, width, height)
}

export function paintTrail(ctx: CanvasRenderingContext2D, energy: TrailEnergy, width: number, height: number) {
	clearTrail(ctx, width, height)
	ctx.fillStyle = TRAIL.color
	for (const [key, value] of energy) {
		const next = value * TRAIL.decay
		if (next < TRAIL.minEnergy) {
			energy.delete(key)
			continue
		}
		energy.set(key, next)
		const [gx, gy] = cellFromKey(key)
		if (next <= BAYER[((gy & 7) << 3) | (gx & 7)]) continue
		const gap = next > TRAIL.solidAt ? 0 : 1
		ctx.fillRect(gx * TRAIL.cell, gy * TRAIL.cell, TRAIL.cell - gap, TRAIL.cell - gap)
	}
}

export function resizeCanvas(canvas: HTMLCanvasElement) {
	const dpr = Math.min(window.devicePixelRatio || 1, 2)
	const w = window.innerWidth
	const h = window.innerHeight
	canvas.width = Math.max(1, Math.floor(w * dpr))
	canvas.height = Math.max(1, Math.floor(h * dpr))
	canvas.style.width = `${w}px`
	canvas.style.height = `${h}px`
	const ctx = canvas.getContext('2d')
	if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
	return ctx
}
