<script lang="ts">
	import ScrollProgressRing from './ScrollProgressRing.svelte'
	import Pill from '$lib/components/ui/Pill.svelte'
	import IconClose from '$lib/components/ui/IconClose.svelte'
	import type { NextProjectPreview } from '$lib/sanity/types'

	let {
		next,
		overscrollTop = 0,
		overscrollTopStarted = false,
		hideChrome = false
	}: {
		next?: NextProjectPreview | null
		overscrollTop?: number
		overscrollTopStarted?: boolean
		hideChrome?: boolean
	} = $props()
</script>

<header
	class="pointer-events-none sticky top-0 z-20 flex items-start justify-between px-6 pt-6 pb-4 text-chrome-ink 2xl:px-16"
	class:opacity-0={hideChrome}
	class:-translate-y-16={hideChrome}
	style="transition: opacity 200ms var(--ease), transform 200ms var(--ease)"
>
	<Pill
		href="/"
		class="close-btn cursor-pointer p-2 {overscrollTopStarted ? 'opacity-0' : ''}"
		aria-label="Back to all projects"
	>
		<IconClose />
	</Pill>

	<div class="flex items-center" class:opacity-0={overscrollTopStarted}>
		{#if next}
			<span class="mr-4 text-chrome-muted">Next</span>
			<Pill href="/projects/{next.slug}" class="px-4 py-3 leading-none" aria-label="Next project: {next.title}">
				<span class="mr-3 h-[1em] w-[1em] rounded-full" style="background:{next.colorAccent}"></span>
				{next.title}
			</Pill>
		{/if}
	</div>
</header>

<div
	class="pointer-events-none fixed inset-x-0 top-0 z-0 flex justify-center pt-8 text-chrome-ink"
	style="opacity:{overscrollTopStarted ? 1 : 0}; transform: translateY({overscrollTopStarted ? overscrollTop * 20 : 30}px); transition: opacity 200ms var(--ease)"
>
	<ScrollProgressRing progress={overscrollTop} visible={overscrollTopStarted} />
</div>
