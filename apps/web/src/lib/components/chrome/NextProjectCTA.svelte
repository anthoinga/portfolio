<script lang="ts">
	import { rememberCard } from '$lib/scroll'
	import { tilt } from '$lib/actions/tilt'
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
	<div class="absolute inset-x-0 top-0 mx-4 my-3 grid grid-cols-2 text-sm leading-tight tracking-tight lg:text-base">
		<div class="mb-1">{next.title}</div>
		<div class="opacity-60">Next case study</div>
	</div>
</a>
