import { prefersReducedMotion } from './motion'

type Parts = {
	scroller: HTMLElement
	/** Observed for size changes that move the hero or change the scroll length. */
	content: HTMLElement
	/** Holds the name's place in the hero once the name itself is pinned. */
	slot: HTMLElement
	name: HTMLElement
	/**
	 * Hero copy that fades out as the name starts to move, one step after another. Elements in
	 * the same step fade together. Re-read on every measure, since line breaks change with width.
	 */
	steps: () => HTMLElement[][]
}

type ScrollTimelineCtor = new (options: { source: Element; axis?: 'block' | 'inline' }) => AnimationTimeline

/** Shared with the site logo in SiteNav, which shows this docked state on every other page. */
export const DOCK_FONT = 24
export const MIN_DOCK_FONT = 13
export const DOCK_GAP = 16
const MIN_FONT = MIN_DOCK_FONT
const GAP = DOCK_GAP
const FALLBACK_MS = 1000
/** Fade windows, as fractions of the name's travel: each step takes SPAN, all done by END. */
const FADE_SPAN = 0.3
const FADE_END = 0.85

/**
 * Scroll-linked hero: the name rises 1:1 with the page while shrinking into the
 * top-left of the nav bar, and the copy under it fades. Runs on a ScrollTimeline
 * where supported (compositor-driven), otherwise the same keyframes are scrubbed
 * from a rAF-throttled scroll listener.
 */
export function attachHeroDock(p: Parts): () => void {
	if (prefersReducedMotion()) return () => {}

	const Timeline = (globalThis as { ScrollTimeline?: ScrollTimelineCtor }).ScrollTimeline
	const options = (
		Timeline
			? { timeline: new Timeline({ source: p.scroller, axis: 'block' }), fill: 'both' }
			: { duration: FALLBACK_MS, fill: 'both' }
	) as KeyframeAnimationOptions

	const nameAnim = p.name.animate(null, options)
	const fadeAnims = new Map<HTMLElement, Animation>()
	const anims = () => [nameAnim, ...fadeAnims.values()]
	if (!Timeline) nameAnim.pause()

	function fadeAnim(el: HTMLElement) {
		let a = fadeAnims.get(el)
		if (!a) {
			a = el.animate(null, options)
			if (!Timeline) a.pause()
			fadeAnims.set(el, a)
		}
		return a
	}

	const keyframes = (a: Animation, frames: Keyframe[]) => (a.effect as KeyframeEffect).setKeyframes(frames)

	const pillEl = document.querySelector<HTMLElement>('.site-nav .bar')
	let max = 1

	function measure() {
		const scrollTop = p.scroller.scrollTop
		const slot = p.slot.getBoundingClientRect()
		const top0 = slot.top + scrollTop
		const left0 = slot.left
		const w = p.name.offsetWidth
		const h = p.name.offsetHeight
		const font = parseFloat(getComputedStyle(p.name).fontSize) || 1

		const pill = pillEl?.getBoundingClientRect()
		const pillTop = pill?.top ?? 12
		const pillH = pill?.height ?? 48

		let s = DOCK_FONT / font
		if (pill && pill.left > left0) s = Math.min(s, (pill.left - GAP - left0) / w)
		s = Math.max(s, MIN_FONT / font)

		const dockTop = pillTop + pillH / 2 - (h * s) / 2
		const distance = Math.max(top0 - dockTop, 1)
		max = Math.max(p.scroller.scrollHeight - p.scroller.clientHeight, 1)
		const end = Math.min(distance / max, 1)

		Object.assign(p.name.style, { position: 'fixed', top: `${top0}px`, left: `${left0}px` })

		const docked = `translate3d(0, ${-distance}px, 0) scale(${s})`
		keyframes(nameAnim, [
			{ offset: 0, transform: 'translate3d(0, 0, 0) scale(1)' },
			{ offset: end, transform: docked },
			{ offset: 1, transform: docked }
		])
		const steps = p.steps()
		const stagger = steps.length > 1 ? (FADE_END - FADE_SPAN) / (steps.length - 1) : 0
		steps.forEach((step, i) => {
			const from = Math.min(end * stagger * i, 1)
			const to = Math.min(from + end * FADE_SPAN, 1)
			for (const el of step) {
				keyframes(fadeAnim(el), [
					{ offset: 0, opacity: 1, visibility: 'visible' },
					{ offset: from, opacity: 1, visibility: 'visible' },
					{ offset: to, opacity: 0, visibility: 'hidden' },
					{ offset: 1, opacity: 0, visibility: 'hidden' }
				])
			}
		})
		scrub()
	}

	let frame = 0
	function scrub() {
		if (Timeline) return
		const t = Math.min(p.scroller.scrollTop / max, 1) * FALLBACK_MS
		for (const a of anims()) a.currentTime = t
	}
	function onScroll() {
		if (frame) return
		frame = requestAnimationFrame(() => {
			frame = 0
			scrub()
		})
	}

	const ro = new ResizeObserver(() => measure())
	ro.observe(p.content)
	ro.observe(p.scroller)
	if (pillEl) ro.observe(pillEl)
	if (!Timeline) p.scroller.addEventListener('scroll', onScroll, { passive: true })
	measure()
	void document.fonts?.ready.then(measure)

	return () => {
		ro.disconnect()
		p.scroller.removeEventListener('scroll', onScroll)
		cancelAnimationFrame(frame)
		for (const a of anims()) a.cancel()
		for (const k of ['position', 'top', 'left'] as const) p.name.style[k] = ''
	}
}
