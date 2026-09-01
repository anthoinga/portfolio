<script lang="ts">
	import type { Snippet } from 'svelte'

	let {
		title,
		opacity = 1,
		children
	}: { title: string; opacity?: number; children?: Snippet } = $props()
</script>

<div
	class="absolute inset-x-0 top-0 mx-4 my-3 text-sm leading-tight tracking-tight lg:text-base {children
		? 'grid grid-cols-2'
		: ''}"
	style:opacity
>
	<div class="mb-1">{title}</div>
	{#if children}
		<div class="opacity-60">{@render children()}</div>
	{/if}
</div>
