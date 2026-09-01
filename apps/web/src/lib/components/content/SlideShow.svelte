<script lang="ts">
	import type { MediaRef } from '$lib/sanity/types'

	let { portableText }: { portableText: { value: { label?: string; text?: string; slides: MediaRef[] } } } = $props()
	const value = $derived(portableText.value)
	let i = $state(0)

	function next() {
		if (!value.slides?.length) return
		i = (i + 1) % value.slides.length
	}
</script>

<section class="col-span-full my-16">
	<button type="button" class="relative block w-full overflow-hidden rounded-media" onclick={next} aria-label="Next slide">
		{#if value.slides?.[i]}
			<img src={value.slides[i].url} alt={value.slides[i].alt || ''} class="w-full" />
		{/if}
	</button>
	{#if value.label || value.text}
		<div class="mt-4 flex justify-between gap-6 text-sm">
			<span class="tracking-[0.16em] uppercase opacity-50">{value.label}</span>
			<p class="max-w-md opacity-80">{value.text}</p>
		</div>
	{/if}
	<p class="mt-2 text-[11px] opacity-40">{i + 1} / {value.slides?.length || 0}</p>
</section>
