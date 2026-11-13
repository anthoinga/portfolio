<script lang="ts">
	import { getContext, type Snippet } from 'svelte'
	import { stopAttrs } from '$lib/pageColor'
	import type { PageColorStop } from '$lib/sanity/types'

	let {
		portableText,
		children
	}: { portableText?: { indexInParent?: number; value?: { _key?: string } }; children?: Snippet } =
		$props()

	const stopsOf = getContext<(() => PageColorStop[]) | undefined>('page-stops')
	const lead = $derived(portableText?.indexInParent === 0 || portableText?.indexInParent === 1)
	const mark = $derived(stopAttrs(portableText?.value?._key, stopsOf?.()))
</script>

<p
	{...mark}
	class="project-copy col-span-full pt-[1em] leading-[1.5] opacity-70 md:text-lg"
	class:mt-48={lead}
	class:mb-32={lead}
	class:font-display={lead}
	class:text-4xl={lead}
	class:leading-[1.05]={lead}
	class:opacity-100={lead}
	class:md:text-5xl={lead}
	class:xl:text-6xl={lead}
	style:letter-spacing={lead ? '-0.02em' : undefined}
>
	{@render children?.()}
</p>
