<script lang="ts">
	import { getContext } from 'svelte'
	import MediaItem from './MediaItem.svelte'
	import { stopAttrs } from '$lib/pageColor'
	import type { MediaItem as MediaItemType, PageColorStop } from '$lib/sanity/types'

	let { portableText }: { portableText: { value: { _key?: string; ratio: string; items: MediaItemType[] } } } =
		$props()
	const stopsOf = getContext<(() => PageColorStop[]) | undefined>('page-stops')
	const value = $derived(portableText.value)
	const mark = $derived(stopAttrs(value._key, stopsOf?.()))

	const cols: Record<string, string> = {
		'1fr': '1fr',
		'1/2': '1fr 2fr',
		'2/1': '2fr 1fr',
		'2/3': '2fr 3fr',
		'3/2': '3fr 2fr',
		'2/4': '2fr 4fr',
		'4/2': '4fr 2fr',
		'3/3': '1fr 1fr 1fr'
	}

	const template = $derived(cols[value.ratio] || '1fr 1fr')
</script>

<div {...mark} class="col-span-full my-16 grid grid-cols-1 gap-2 md:col-start-2 md:col-span-5 lg:[grid-template-columns:var(--cols)]" style="--cols: {template}">
	{#each value.items || [] as item (item._key)}
		{#if item.kind === 'copy'}
			<div class="max-w-[40rem] self-start" style={item.span ? 'grid-column: 1 / -1' : undefined}>
				{#if item.heading}
					<h2 class="pt-8 text-base leading-[1.16em] md:text-xl">{item.heading}</h2>
				{/if}
				{#each item.paragraphs || [] as paragraph, i}
					<p
						class="leading-[1.3em] md:leading-[1.16em]"
						class:pt-[1em]={i > 0 || !item.lead}
						class:opacity-60={!item.lead}
						class:text-3xl={item.lead}
						class:font-light={item.lead}
						class:md:text-4xl={item.lead}
						class:xl:text-5xl={item.lead}
						style:letter-spacing={item.lead ? '-0.037em' : undefined}
					>
						{paragraph}
					</p>
				{/each}
			</div>
		{:else}
			<MediaItem {item} />
		{/if}
	{/each}
</div>
