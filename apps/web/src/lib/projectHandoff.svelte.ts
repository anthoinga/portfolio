import { PAGE_FADE } from '$lib/pageColor'
import { prefersReducedMotion } from '$lib/motion'
import { bottomProgress, overscroll, topProgress } from '$lib/overscroll.svelte'
import { lerp, mapRange, navMemory, type LastCard } from '$lib/scroll'
import { viewport } from '$lib/scrollRoot.svelte'

export const ENTER_MS = 720

export function targetScaleFor(viewW: number) {
	return 1 - (viewW >= 1536 ? 128 : viewW >= 768 ? 48 : 32) / Math.max(viewW, 1)
}

/** Shared card → surface enter origin used by case studies. */
export function cardEnterOrigin(
	card: Pick<LastCard, 'left' | 'top' | 'width'>,
	viewW: number,
	surfaceWidth = viewW
) {
	return {
		scale: card.width / Math.max(surfaceWidth, 1),
		x: (card.left + card.width / 2 - viewW / 2) * 0.7,
		y: card.top - 80
	}
}

export function createProjectMotion(getProject: () => { slug: string }) {
	let entered = $state(false)
	let entering = $state(true)
	let origin = $state({ scale: 0.8, x: 0, y: 100 })
	let primedSlug = ''

	const targetScale = $derived(targetScaleFor(viewport.viewW))

	// Before paint on slug change (page instance is reused): pin scroll at 0.
	$effect.pre(() => {
		const slug = getProject().slug
		if (slug === primedSlug) return
		primedSlug = slug
		entering = true
		entered = false
		if (viewport.scroller) viewport.scroller.scrollTop = 0
		viewport.scrollY = 0
	})

	$effect(() => {
		const project = getProject()
		project.slug

		if (viewport.scroller) viewport.scroller.scrollTop = 0
		viewport.scrollY = 0

		entered = false
		entering = true
		const card = navMemory.lastCard
		if (card && card.slug === project.slug) {
			origin = cardEnterOrigin(card, viewport.viewW)
		} else {
			origin = { scale: targetScale, x: 0, y: 100 }
		}

		let frame = 0
		let enterTimer = 0
		frame = requestAnimationFrame(() => {
			entered = true
			navMemory.lastCard = null
		})
		enterTimer = window.setTimeout(() => {
			entering = false
		}, ENTER_MS)

		return () => {
			cancelAnimationFrame(frame)
			window.clearTimeout(enterTimer)
		}
	})

	const up = $derived(topProgress())
	const down = $derived(bottomProgress())
	const reduced = $derived(typeof window !== 'undefined' && prefersReducedMotion())
	const focusDistance = $derived(Math.min(360, viewport.viewH * 0.4))
	const focusProgress = $derived(mapRange(viewport.scrollY, 0, focusDistance, 0, 1))
	const easedFocus = $derived(focusProgress * focusProgress * (3 - 2 * focusProgress))
	const focusedScale = $derived(lerp(targetScale, 1, easedFocus))
	const transformOrigin = $derived(overscroll.bottomStarted ? 'center bottom' : 'center top')
	const articleTransition = $derived(
		entering
			? `transform 700ms var(--ease-enter), opacity 400ms var(--ease), background-color ${PAGE_FADE}, color ${PAGE_FADE}`
			: `transform 300ms var(--ease), background-color ${PAGE_FADE}, color ${PAGE_FADE}`
	)

	const articleX = $derived(reduced || entered ? 0 : origin.x)
	const articleY = $derived(reduced ? 0 : entered ? up * 120 + down * -100 : origin.y)
	const articleScale = $derived(reduced ? 1 : entered ? lerp(focusedScale, targetScale, down) : origin.scale)
	const articleOpacity = $derived(Math.max(0.08, 1 - up - down * 0.9))

	return {
		get articleX() {
			return articleX
		},
		get articleY() {
			return articleY
		},
		get articleScale() {
			return articleScale
		},
		get articleOpacity() {
			return articleOpacity
		},
		get transformOrigin() {
			return transformOrigin
		},
		get articleTransition() {
			return articleTransition
		}
	}
}
