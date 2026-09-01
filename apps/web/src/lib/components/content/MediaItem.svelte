<script lang="ts">
	import type { MediaItem } from '$lib/sanity/types'

	let { item }: { item: MediaItem } = $props()

	const src = $derived(item.kind === 'video' ? item.poster?.url || item.image?.url : item.image?.url)
	const alt = $derived(item.image?.alt || item.poster?.alt || item.title || '')
</script>

<figure
	class="relative flex min-h-0 flex-col"
	class:pt-10={item.topPadding}
	class:h-full={item.fillHeight}
	style={item.rowSpan ? `grid-row: span ${item.rowSpan}` : undefined}
>
	<div class="relative overflow-hidden rounded-media" class:flex-1={item.fillHeight}>
		{#if item.kind === 'video' && item.video?.url}
			<video
				src={item.video.url}
				poster={item.poster?.url}
				muted
				loop
				playsinline
				autoplay
				controlslist="nodownload noremoteplayback"
				disablepictureinpicture
				class="h-full w-full object-cover"
			></video>
		{:else if src}
			<img {src} {alt} class="h-full w-full object-cover" />
		{/if}
	</div>
	{#if item.overlay && (item.title || item.text)}
		<figcaption class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-scrim to-transparent p-4 text-light">
			{#if item.label}<span class="text-[11px] tracking-widest uppercase">{item.label}</span>{/if}
			{#if item.title}<p class="font-display text-2xl">{item.title}</p>{/if}
		</figcaption>
	{:else if item.label || item.title || item.text}
		<figcaption class="mt-4 flex gap-4 text-sm leading-5 tracking-normal" class:mt-8={item.wideSpacing}>
			{#if item.label}<span class="w-[14vw] shrink-0 opacity-60 lg:w-[7vw]">{item.label}</span>{/if}
			<div>
				{#if item.title}<p class="mb-1 opacity-80">{item.title}</p>{/if}
				{#if item.text}<p class="max-w-md opacity-60">{item.text}</p>{/if}
			</div>
		</figcaption>
	{/if}
</figure>
