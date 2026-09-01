import { prefersReducedMotion } from '$lib/motion'

export function seekOnScroll(node: HTMLVideoElement, enabled: boolean) {
	if (!enabled || prefersReducedMotion()) {
		return {
			destroy() {}
		}
	}

	let raf = 0

	function tick() {
		const rect = node.getBoundingClientRect()
		const view = window.innerHeight || 1
		const progress = 1 - Math.min(1, Math.max(0, rect.bottom / (view + rect.height)))
		if (node.duration && Number.isFinite(node.duration)) {
			node.currentTime = progress * node.duration
		}
		raf = requestAnimationFrame(tick)
	}

	node.pause()
	raf = requestAnimationFrame(tick)

	return {
		destroy() {
			cancelAnimationFrame(raf)
		}
	}
}
