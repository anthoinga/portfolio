export function autoplayInline(node: HTMLVideoElement, enabled = true) {
	if (!enabled) return

	node.muted = true
	node.playsInline = true

	let shown = false
	let locking = false
	const scroller = node.closest<HTMLElement>('.scroll-root')

	const kick = () => {
		if (!shown || !node.paused) return
		node.play().catch(() => {})
	}

	const io = new IntersectionObserver((entries) => {
		shown = entries.some((e) => e.isIntersecting)
		if (shown) kick()
		else {
			locking = true
			node.pause()
			locking = false
		}
	})
	io.observe(node)

	const onPause = () => {
		if (!locking && node.currentTime > 0) shown = false
	}
	node.addEventListener('pause', onPause)
	scroller?.addEventListener('scroll', kick, { passive: true })

	return {
		destroy() {
			io.disconnect()
			node.removeEventListener('pause', onPause)
			scroller?.removeEventListener('scroll', kick)
		}
	}
}
