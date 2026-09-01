import { clamp } from './scroll'

const TOP_THRESHOLD = 750
const BOTTOM_THRESHOLD = 80

export const overscroll = $state({
	top: 0,
	bottom: 0,
	topStarted: false,
	bottomStarted: false,
	topDone: false,
	bottomDone: false
})

export function resetOverscroll() {
	overscroll.top = 0
	overscroll.bottom = 0
	overscroll.topStarted = false
	overscroll.bottomStarted = false
	overscroll.topDone = false
	overscroll.bottomDone = false
}

// One-shot so layout does not navigate twice.
export function consumeOverscroll(direction: 'top' | 'bottom') {
	const key = direction === 'top' ? 'topDone' : 'bottomDone'
	if (!overscroll[key]) return false
	overscroll[key] = false
	return true
}

export function topProgress() {
	return clamp(overscroll.top / TOP_THRESHOLD, 0, 1)
}

export function bottomProgress() {
	return clamp(overscroll.bottom / BOTTOM_THRESHOLD, 0, 1)
}

export function attachOverscroll(scroller: HTMLElement) {
	let enabled = false
	let complete = false
	let resetTimer = 0
	const enableTimer = window.setTimeout(() => {
		enabled = true
	}, 800)

	resetOverscroll()

	const onWheel = (e: WheelEvent) => {
		if (!enabled || complete) return
		const dy = clamp(e.deltaY, -50, 50)
		const atTop = scroller.scrollTop <= 1
		const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2

		if (atTop && dy < 0) {
			overscroll.topStarted = true
			overscroll.top = clamp(overscroll.top - dy, 0, TOP_THRESHOLD + 40)
			if (overscroll.top >= TOP_THRESHOLD) {
				complete = true
				overscroll.top = TOP_THRESHOLD
				overscroll.topDone = true
			}
		} else if (atBottom && dy > 0) {
			overscroll.bottomStarted = true
			overscroll.bottom = clamp(overscroll.bottom + dy, 0, 120)
			if (overscroll.bottom >= BOTTOM_THRESHOLD) {
				complete = true
				overscroll.bottom = BOTTOM_THRESHOLD
				overscroll.bottomDone = true
			}
		} else {
			window.clearTimeout(resetTimer)
			resetTimer = window.setTimeout(() => {
				if (complete) return
				overscroll.top = 0
				overscroll.bottom = 0
				overscroll.topStarted = false
				overscroll.bottomStarted = false
			}, 140)
		}
	}

	window.addEventListener('wheel', onWheel, { passive: true })
	return () => {
		window.removeEventListener('wheel', onWheel)
		window.clearTimeout(enableTimer)
		window.clearTimeout(resetTimer)
	}
}
