export function prefersReducedMotion() {
	if (typeof window === 'undefined' || !window.matchMedia) return false
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isFinePointer() {
	if (typeof window === 'undefined' || !window.matchMedia) return false
	return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

export function subscribeMedia(query: string, onChange: (matches: boolean) => void) {
	if (typeof window === 'undefined' || !window.matchMedia) {
		onChange(false)
		return () => {}
	}
	const media = window.matchMedia(query)
	const sync = () => onChange(media.matches)
	sync()
	media.addEventListener('change', sync)
	return () => media.removeEventListener('change', sync)
}
