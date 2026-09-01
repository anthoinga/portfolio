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
	class="project-copy col-span-full pt-48 leading-[1.3em] md:text-xl md:leading-[1.16em]"
>
	{@render children?.()}
</svelte:element>
