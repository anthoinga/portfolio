import { clamp } from './scroll'

const CLOSE_THRESHOLD = 7500
const CLOSE_TICK = CLOSE_THRESHOLD / 60

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
	return clamp(overscroll.top / CLOSE_THRESHOLD, 0, 1)
}

export function bottomProgress() {
	return clamp(overscroll.bottom / CLOSE_THRESHOLD, 0, 1)
}

export function attachOverscroll(scroller: HTMLElement) {
	let enabled = false
	let complete = false
	let resetTimer = 0
	const enableTimer = window.setTimeout(() => {
		enabled = true
	}, 800)

	resetOverscroll()

	const pull = (edge: 'top' | 'bottom', delta: number) => {
		const started = edge === 'top' ? 'topStarted' : 'bottomStarted'
		const done = edge === 'top' ? 'topDone' : 'bottomDone'
		overscroll[started] = true
		overscroll[edge] = clamp(overscroll[edge] + delta, 0, CLOSE_THRESHOLD)
		if (overscroll[edge] >= CLOSE_THRESHOLD) {
			complete = true
			overscroll[edge] = CLOSE_THRESHOLD
			overscroll[done] = true
			return
		}
		scheduleReset()
	}

	const scheduleReset = () => {
		window.clearTimeout(resetTimer)
		resetTimer = window.setTimeout(() => {
			if (complete) return
			overscroll.top = 0
			overscroll.bottom = 0
			overscroll.topStarted = false
			overscroll.bottomStarted = false
		}, 180)
	}

	const onWheel = (e: WheelEvent) => {
		if (!enabled || complete) return
		const dy = clamp(e.deltaY, -CLOSE_TICK, CLOSE_TICK)
		const atTop = scroller.scrollTop <= 1
		const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2

		if (atTop && dy < 0) pull('top', -dy)
		else if (atBottom && dy > 0) pull('bottom', dy)
		else if (!complete) {
			overscroll.top = 0
			overscroll.bottom = 0
			overscroll.topStarted = false
			overscroll.bottomStarted = false
		}
	}

	window.addEventListener('wheel', onWheel, { passive: true })
	return () => {
		window.removeEventListener('wheel', onWheel)
		window.clearTimeout(enableTimer)
		window.clearTimeout(resetTimer)
	}
}
