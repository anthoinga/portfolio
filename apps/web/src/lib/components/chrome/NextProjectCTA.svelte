<script lang="ts">
	import { rememberCard } from '$lib/scroll'
	import { tilt } from '$lib/actions/tilt'
	import CardMeta from '$lib/components/ui/CardMeta.svelte'
	import { projectCssVars } from '$lib/theme'
	import type { NextProjectPreview } from '$lib/sanity/types'

	let { next }: { next: NextProjectPreview } = $props()
	let root: HTMLElement | undefined = $state()
</script>

<a
	bind:this={root}
	href="/projects/{next.slug}"
	class="relative block h-[64em] overflow-hidden rounded-t-card bg-canvas text-ink"
	data-cursor="case-study"
	style={projectCssVars(next)}
	data-sveltekit-noscroll
	use:tilt
	onclick={() => {
		if (root) rememberCard(root, next.slug)
	}}
>
	{#if next.poster?.url}
		<img src={next.poster.url} alt="" class="absolute inset-0 h-full w-full object-cover" />
	{/if}
	<CardMeta title={next.title}>Next case study</CardMeta>
</a>
