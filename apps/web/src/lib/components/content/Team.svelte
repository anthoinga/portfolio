<script lang="ts">
	let { portableText }: { portableText: { value: { members: { name: string; position?: string }[] } } } = $props()
	const value = $derived(portableText.value)
</script>

<section class="col-span-full mb-48 grid gap-6 text-base sm:col-start-2 md:col-span-3 md:grid-cols-[7vw_1fr]">
	<p>Team</p>
	<ul class="space-y-2">
		{#each value.members || [] as member}
			<li class="flex justify-between gap-4 border-b border-current/15 py-2">
				<span>{member.name}</span>
				<span class="opacity-60">{member.position}</span>
			</li>
		{/each}
	</ul>
</section>
