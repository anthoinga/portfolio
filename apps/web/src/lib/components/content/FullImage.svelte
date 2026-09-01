<script lang="ts">
	let { portableText }: { portableText: { value: { image: { url: string; alt?: string }; priority?: boolean }; indexInParent?: number } } = $props()
	const value = $derived(portableText.value)
	const first = $derived(portableText.indexInParent === 0)
</script>

<figure class="col-span-full w-full overflow-hidden rounded-media" class:poster-bleed={first} class:mb-16={!first}>
	<img
		src={value.image.url}
		alt={value.image.alt || ''}
		class="w-full object-cover"
		class:poster-bleed={first}
		fetchpriority={value.priority ? 'high' : 'auto'}
		loading={value.priority ? 'eager' : 'lazy'}
	/>
</figure>
