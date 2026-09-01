<script lang="ts">
	import type { Snippet } from 'svelte'

	let {
		portableText,
		children
	}: { portableText?: { indexInParent?: number }; children?: Snippet } = $props()

	const lead = $derived(portableText?.indexInParent === 0 || portableText?.indexInParent === 1)
</script>

<p
	class="project-copy col-span-full pt-[1em] leading-[1.3em] opacity-60 md:leading-[1.16em]"
	class:mt-48={lead}
	class:mb-32={lead}
	class:text-3xl={lead}
	class:font-light={lead}
	class:opacity-100={lead}
	class:md:text-4xl={lead}
	class:xl:text-5xl={lead}
	style:letter-spacing={lead ? '-0.037em' : undefined}
>
	{@render children?.()}
</p>
