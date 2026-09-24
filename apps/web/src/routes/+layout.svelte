<script lang="ts">
	import '../app.css'
	import { afterNavigate, goto } from '$app/navigation'
	import { page } from '$app/state'
	import CursorTakeover from '$lib/components/chrome/CursorTakeover.svelte'
	import Header from '$lib/components/chrome/Header.svelte'
	import HomeRail from '$lib/components/chrome/HomeRail.svelte'
	import Seo from '$lib/components/chrome/Seo.svelte'
	import { nopeChrome } from '$lib/nopeChrome.svelte'
	import { bindScroller, viewport } from '$lib/scrollRoot.svelte'
	import { attachOverscroll, bottomProgress, consumeOverscroll, overscroll, topProgress } from '$lib/overscroll.svelte'
	import { navMemory } from '$lib/scroll'
	import type { LayoutData } from './$types'

	let { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props()

	const pathname = $derived(page.url.pathname)
	const onProject = $derived(pathname.startsWith('/projects/'))
	const onHome = $derived(pathname === '/')
	const is404 = $derived(page.status === 404)
	const showShell = $derived(onHome || is404)
	const railFaded = $derived(is404 && !nopeChrome.onTitle)

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

<Seo settings={data.settings} siteUrl={data.siteUrl} />

<div class="scroll-root" use:bindScroller>
	{#if onProject}
		<Header
			overscrollTop={topProgress()}
			overscrollTopStarted={overscroll.topStarted}
			overscrollBottom={bottomProgress()}
			overscrollBottomStarted={overscroll.bottomStarted}
		/>
	{/if}
	{#if showShell}
		<main
			class="home-shell relative z-[1] mx-6 grid gap-4 text-chrome-ink lg:grid-cols-9"
			class:home-shell--nope={is404}
		>
			<HomeRail settings={data.settings} faded={railFaded} lists={!is404} bio={!is404} />
			<div class="home-feed min-w-0 lg:col-span-7" class:home-feed--nope={is404}>
				{@render children()}
			</div>
		</main>
	{:else}
		{@render children()}
	{/if}
</div>
<CursorTakeover />
