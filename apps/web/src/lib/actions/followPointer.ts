import { isFinePointer, prefersReducedMotion } from '$lib/motion'

const RANGE = 0.045
const EASE = 0.16
const SETTLE = 0.2

function followOffset(
	clientX: number,
	clientY: number,
	rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>,
	range = RANGE
) {
	if (!rect.width || !rect.height) return { x: 0, y: 0 }
	return {
		x: ((clientX - rect.left) / rect.width - 0.5) * 2 * rect.width * range,
		y: ((clientY - rect.top) / rect.height - 0.5) * 2 * rect.height * range
	}
}

export function followPointer(node: HTMLElement) {
	if (prefersReducedMotion() || !isFinePointer()) return { destroy() {} }

	let tx = 0
	let ty = 0
	let x = 0
	let y = 0
	let raf = 0
	let hovering = false
	let media = node.querySelector<HTMLElement>('[data-follow]')

	function target() {
		return media ?? node.querySelector<HTMLElement>('[data-follow]')
	}

	function apply() {
		const el = target()
		if (!el) return
		el.style.transform = `translate3d(${x}px, ${y}px, 0)`
	}

	function tick() {
		x += (tx - x) * EASE
		y += (ty - y) * EASE
		apply()
		const settled = Math.abs(tx - x) < SETTLE && Math.abs(ty - y) < SETTLE
		if (!hovering && settled) {
			x = 0
			y = 0
			apply()
			const el = target()
			if (el) el.style.willChange = ''
			raf = 0
			return
		}
		raf = requestAnimationFrame(tick)
	}

	function start() {
		if (!raf) raf = requestAnimationFrame(tick)
	}

	function onEnter(e: PointerEvent) {
		if (e.pointerType !== 'mouse') return
		media = target()
		hovering = true
		const el = target()
		if (el) el.style.willChange = 'transform'
		start()
	}

	function onMove(e: PointerEvent) {
		if (!hovering || e.pointerType !== 'mouse') return
		const next = followOffset(e.clientX, e.clientY, node.getBoundingClientRect())
		tx = next.x
		ty = next.y
		start()
	}

	function onLeave() {
		hovering = false
		tx = 0
		ty = 0
		start()
	}

	node.addEventListener('pointerenter', onEnter)
	node.addEventListener('pointermove', onMove)
	node.addEventListener('pointerleave', onLeave)

	return {
		destroy() {
			hovering = false
			if (raf) cancelAnimationFrame(raf)
			node.removeEventListener('pointerenter', onEnter)
			node.removeEventListener('pointermove', onMove)
			node.removeEventListener('pointerleave', onLeave)
		}
	}
}
