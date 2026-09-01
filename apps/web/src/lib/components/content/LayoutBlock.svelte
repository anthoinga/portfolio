<script lang="ts">
	import MediaItem from './MediaItem.svelte'
	import type { MediaItem as MediaItemType } from '$lib/sanity/types'

	let { portableText }: { portableText: { value: { ratio: string; items: MediaItemType[] } } } = $props()
	const value = $derived(portableText.value)

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

<div class="col-span-full my-16 grid grid-cols-1 gap-2 md:col-start-2 md:col-span-5 lg:[grid-template-columns:var(--cols)]" style="--cols: {template}">
	{#each value.items || [] as item (item._key)}
		<MediaItem {item} />
	{/each}
</div>
