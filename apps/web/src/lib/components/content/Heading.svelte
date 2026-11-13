<script lang="ts">
	import type { Snippet } from 'svelte'

	let {
		portableText,
		children
	}: { portableText?: { value?: { style?: string } }; children?: Snippet } = $props()

	const tag = $derived(portableText?.value?.style === 'h3' ? 'h3' : 'h2')
</script>

<svelte:element
	this={tag}
	class="project-copy col-span-full pt-48 font-display text-3xl leading-[1.05] tracking-[-0.02em] md:text-5xl"
>
	{@render children?.()}
</svelte:element>
