<script lang="ts">
	let { portableText }: { portableText: { value: { items: { label?: string; text?: string }[] } } } = $props()
	const value = $derived(portableText.value)
</script>

<ol class="project-copy col-span-full my-10 space-y-0 opacity-60">
	{#each value.items || [] as item, i}
		<li class="mt-[1.1em] flex flex-row leading-[1.16em]">
			<span class="block w-[21vw] md:w-[7vw]">{item.label || String(i + 1).padStart(2, '0')}</span>
			<p class="block w-full">{item.text}</p>
		</li>
	{/each}
</ol>
