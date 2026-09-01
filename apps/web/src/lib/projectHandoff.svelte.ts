import { goto, preloadData } from '$app/navigation'
import { prefersReducedMotion } from '$lib/motion'
import { bottomProgress, overscroll, topProgress } from '$lib/overscroll.svelte'
import { clamp, lerp, mapRange, navMemory } from '$lib/scroll'
import { viewport } from '$lib/scrollRoot.svelte'

const HANDOFF_RESISTANCE = 600
const HANDOFF_DELAY = 450
const ENTER_MS = 720

export function targetScaleFor(viewW: number) {
	return 1 - (viewW >= 1536 ? 128 : viewW >= 768 ? 48 : 32) / Math.max(viewW, 1)
}

export function createProjectMotion(getProject: () => { slug: string; nextProject?: { slug?: string } | null }) {
	let entered = $state(false)
	let entering = $state(true)
	let origin = $state({ scale: 0.8, x: 0, y: 100 })
	let articleHeight = $state(0)
	let nextStage: HTMLElement | undefined = $state()
	let handoffStarted = $state(false)
	let handoffReady = $state(false)
	let handoffAmount = $state(0)
	let handoffCarry = $state(0)

	const targetScale = $derived(targetScaleFor(viewport.viewW))

	$effect(() => {
		const project = getProject()
		project.slug
		const openingWorkspace = !navMemory.workspaceOpen
		navMemory.workspaceOpen = true
		handoffStarted = false
		handoffReady = false
		handoffAmount = 0
		handoffCarry = 0
		const card = navMemory.lastCard

		const initialScrollTop = openingWorkspace ? 0 : navMemory.workspaceScroll
		if (viewport.scroller) {
			viewport.scroller.scrollTop = initialScrollTop
		}
		viewport.scrollY = initialScrollTop
		navMemory.workspaceScroll = 0
		if (!openingWorkspace) {
			origin = { scale: targetScale, x: 0, y: 0 }
			entered = true
			entering = false
			navMemory.lastCard = null
			return
		}

		entered = false
		entering = true
		if (card && card.slug === project.slug) {
			origin = {
				scale: card.width / Math.max(viewport.viewW, 1),
				x: (card.left + card.width / 2 - viewport.viewW / 2) * 0.7,
				y: card.top - 80
			}
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

	$effect(() => {
		const slug = getProject().nextProject?.slug
		if (slug) void preloadData(`/projects/${slug}`)
	})

	$effect(() => {
		const slug = getProject().nextProject?.slug
		const stage = nextStage
		viewport.scrollY
		if (!slug || !stage || handoffStarted || handoffReady) return

		const top = stage.getBoundingClientRect().top
		if (top <= 0) {
			if (window.matchMedia('(pointer: coarse)').matches) {
				handoffStarted = true
				navMemory.workspaceScroll = Math.max(0, -top)
				void goto(`/projects/${slug}`, { noScroll: true })
				return
			}

			handoffReady = true
			handoffCarry = Math.max(0, -top)
		}
	})

	$effect(() => {
		let transitionTimer = 0
		const onWheel = (event: WheelEvent) => {
			if (handoffStarted) {
				event.preventDefault()
				return
			}
			if (!handoffReady) return
			if (event.deltaY < 0) {
				handoffReady = false
				handoffAmount = 0
				handoffCarry = 0
				return
			}
			if (event.deltaY === 0) return

			event.preventDefault()
			handoffAmount = clamp(handoffAmount + clamp(event.deltaY, 0, 50), 0, HANDOFF_RESISTANCE)

			const slug = getProject().nextProject?.slug
			if (handoffAmount >= HANDOFF_RESISTANCE && slug) {
				handoffStarted = true
				transitionTimer = window.setTimeout(() => {
					navMemory.workspaceScroll = handoffCarry
					void goto(`/projects/${slug}`, { noScroll: true })
				}, HANDOFF_DELAY)
			}
		}

		window.addEventListener('wheel', onWheel, { passive: false })
		return () => {
			window.removeEventListener('wheel', onWheel)
			window.clearTimeout(transitionTimer)
		}
	})

	const up = $derived(topProgress())
	const down = $derived(bottomProgress())
	const reduced = $derived(typeof window !== 'undefined' && prefersReducedMotion())
	const focusDistance = $derived(Math.min(360, viewport.viewH * 0.4))
	const focusProgress = $derived(mapRange(viewport.scrollY, 0, focusDistance, 0, 1))
	const easedFocus = $derived(focusProgress * focusProgress * (3 - 2 * focusProgress))
	const focusedScale = $derived(lerp(targetScale, 1, easedFocus))
	const articleEnd = $derived(Math.max(0, articleHeight - viewport.viewH))
	const endProgress = $derived(mapRange(viewport.scrollY, Math.max(0, articleEnd - focusDistance), articleEnd, 0, 1))
	const easedEnd = $derived(endProgress * endProgress * (3 - 2 * endProgress))
	const handoffProgress = $derived(Math.max(easedEnd, down))
	const transformOrigin = $derived(endProgress > 0 || overscroll.bottomStarted ? 'center bottom' : 'center top')
	const articleTransition = $derived(
		entering
			? 'transform 700ms var(--ease-enter), opacity 400ms var(--ease)'
			: 'transform 300ms var(--ease), background-color 300ms var(--ease), color 300ms var(--ease)'
	)

	const articleX = $derived(reduced || entered ? 0 : origin.x)
	const articleY = $derived(reduced ? 0 : entered ? up * 120 + down * -100 : origin.y)
	const articleScale = $derived(reduced ? 1 : entered ? lerp(focusedScale, targetScale, handoffProgress) : origin.scale)
	const articleOpacity = $derived(Math.max(0.08, 1 - up - down * 0.9))

	return {
		get articleHeight() {
			return articleHeight
		},
		set articleHeight(value: number) {
			articleHeight = value
		},
		get nextStage() {
			return nextStage
		},
		set nextStage(value: HTMLElement | undefined | null) {
			nextStage = value ?? undefined
		},
		get targetScale() {
			return targetScale
		},
		get down() {
			return down
		},
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
