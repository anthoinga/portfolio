<script lang="ts">
	import ProjectCard from '$lib/components/chrome/ProjectCard.svelte'
	import { homeRail } from '$lib/homeRail.svelte'
	import { HOME } from '$lib/scroll'
	import { viewport } from '$lib/scrollRoot.svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	const topOffset = $derived(viewport.viewW >= HOME.lg ? 0 : homeRail.height)
</script>

<section class="mb-4">
	<div class="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
		{#each data.projects as project, i (project._id)}
			<ProjectCard {project} index={i} {topOffset} />
		{/each}
	</div>
</section>
