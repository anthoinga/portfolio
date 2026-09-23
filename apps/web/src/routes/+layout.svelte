<script lang="ts">
	import '../app.css'
	import { afterNavigate, goto } from '$app/navigation'
	import { page } from '$app/state'
	import CursorTakeover from '$lib/components/chrome/CursorTakeover.svelte'
	import Header from '$lib/components/chrome/Header.svelte'
	import { bindScroller, viewport } from '$lib/scrollRoot.svelte'
	import { attachOverscroll, bottomProgress, consumeOverscroll, overscroll, topProgress } from '$lib/overscroll.svelte'
	import { navMemory } from '$lib/scroll'

	let { children }: { children: import('svelte').Snippet } = $props()

	const pathname = $derived(page.url.pathname)
	const onProject = $derived(pathname.startsWith('/projects/'))

	afterNavigate(() => {
		if (onProject) return
		const y = navMemory.workspaceScroll
		const apply = () => {
			if (viewport.scroller) viewport.scroller.scrollTop = y
			viewport.scrollY = y
		}
		apply()
		requestAnimationFrame(apply)
	})

	$effect(() => {
		pathname
		if (!onProject || !viewport.scroller) return
		return attachOverscroll(viewport.scroller)
	})

	$effect(() => {
		if (!onProject) return
		if (!overscroll.topDone && !overscroll.bottomDone) return
		const hold = window.setTimeout(() => {
			if (consumeOverscroll('top') || consumeOverscroll('bottom')) {
				void goto('/', { noScroll: true })
			}
		}, 520)
		return () => window.clearTimeout(hold)
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
			overscrollTop={topProgress()}
			overscrollTopStarted={overscroll.topStarted}
			overscrollBottom={bottomProgress()}
			overscrollBottomStarted={overscroll.bottomStarted}
		/>
	{/if}
	{@render children()}
</div>
<CursorTakeover />
