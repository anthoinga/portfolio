import { prefersReducedMotion } from '$lib/motion'

export function tilt(node: HTMLElement) {
	if (prefersReducedMotion()) return { destroy() {} }

	let down = false
	let x = 0
	let y = 0

	function apply() {
		node.style.transform = `perspective(100vw) rotateY(${5 * x}deg) rotateX(${-7 * y}deg) scale(${down ? 0.99 : 1})`
	}

	function reset() {
		down = false
		x = 0
		y = 0
		node.style.transform = 'perspective(100vw) rotateY(0deg) rotateX(0deg) scale(1)'
	}

	function onDown(e: PointerEvent) {
		if (e.button !== 0) return
		down = true
		const t = node.getBoundingClientRect()
		x = (e.clientX - t.left) / t.width - 0.5
		y = (e.clientY - t.top) / t.height - 0.5
		apply()
	}

	function onMove(e: PointerEvent) {
		if (!down) return
		const t = node.getBoundingClientRect()
		x += e.movementX / t.width
		y += e.movementY / t.height
		apply()
	}

	node.style.transformOrigin = 'center center'
	node.style.transition = 'transform 200ms var(--ease)'
	node.addEventListener('pointerdown', onDown)
	node.addEventListener('pointermove', onMove)
	window.addEventListener('pointerup', reset)
	window.addEventListener('pointercancel', reset)

	return {
		destroy() {
			node.removeEventListener('pointerdown', onDown)
			node.removeEventListener('pointermove', onMove)
			window.removeEventListener('pointerup', reset)
			window.removeEventListener('pointercancel', reset)
		}
	}
}
