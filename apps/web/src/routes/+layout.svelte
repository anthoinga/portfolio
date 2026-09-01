<script lang="ts">
	import '../app.css'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import CursorTakeover from '$lib/components/chrome/CursorTakeover.svelte'
	import Header from '$lib/components/chrome/Header.svelte'
	import { bindScroller, viewport } from '$lib/scrollRoot.svelte'
	import { attachOverscroll, consumeOverscroll, overscroll, topProgress } from '$lib/overscroll.svelte'
	import { navMemory } from '$lib/scroll'

	let { children }: { children: import('svelte').Snippet } = $props()

	const next = $derived(page.data.next)
	const pathname = $derived(page.url.pathname)
	const onProject = $derived(pathname.startsWith('/projects/'))
	let nextFrame = 0

	function scheduleNextProject(slug: string) {
		cancelAnimationFrame(nextFrame)
		nextFrame = requestAnimationFrame(() => {
			nextFrame = 0
			void goto(`/projects/${slug}`, { noScroll: true })
		})
	}

	$effect(() => {
		pathname
		if (!onProject) navMemory.workspaceOpen = false
		return () => cancelAnimationFrame(nextFrame)
	})

	$effect(() => {
		pathname
		if (!onProject || !viewport.scroller) return
		return attachOverscroll(viewport.scroller)
	})

	$effect(() => {
		if (!onProject) return
		if (consumeOverscroll('top')) {
			void goto('/', { noScroll: true })
			return
		}
		if (overscroll.bottomDone && next?.slug && consumeOverscroll('bottom')) {
			scheduleNextProject(next.slug)
		}
	})

	function lockCopy(event: Event) {
		const t = event.target
		if (t instanceof Element && t.closest('a, input, textarea, [contenteditable="true"]')) return
		event.preventDefault()
	}
</script>

<svelte:window
	oncontextmenu={(e) => e.preventDefault()}
	ondragstart={(e) => e.preventDefault()}
	oncopy={lockCopy}
	oncut={lockCopy}
/>

<div class="scroll-root" use:bindScroller>
	{#if onProject}
		<Header
			{next}
			overscrollTop={topProgress()}
			overscrollTopStarted={overscroll.topStarted}
			hideChrome={overscroll.bottomStarted}
		/>
	{/if}
	{@render children()}
</div>
<CursorTakeover />
