<script lang="ts">
	import { getContext } from 'svelte'
	import { stopAttrs } from '$lib/pageColor'
	import type { PageColorStop } from '$lib/sanity/types'

	let { portableText }: { portableText: { value: { _key?: string; text: string; who?: string; title?: string } } } =
		$props()
	const value = $derived(portableText.value)
	const stopsOf = getContext<(() => PageColorStop[]) | undefined>('page-stops')
	const mark = $derived(stopAttrs(value._key, stopsOf?.()))
</script>

<blockquote class="col-span-full my-32 sm:col-start-2 md:col-span-4">
	<p {...mark} class="text-3xl leading-[1.16] font-light tracking-[-0.037em] md:text-5xl">“{value.text}”</p>
	{#if value.who || value.title}
		<footer class="mt-4 text-sm opacity-60">
			{value.who}{#if value.title}<span> — {value.title}</span>{/if}
		</footer>
	{/if}
</blockquote>
