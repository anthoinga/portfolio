export function loadWhenNear(node: HTMLElement, onNear: () => void) {
	const observer = new IntersectionObserver(
		(entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				onNear()
				observer.disconnect()
			}
		},
		{ rootMargin: '200px' }
	)
	observer.observe(node)
	return {
		destroy() {
			observer.disconnect()
		}
	}
}
