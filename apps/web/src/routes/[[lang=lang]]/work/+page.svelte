<script lang="ts">
	import ProjectCard from '$lib/components/chrome/ProjectCard.svelte'
	import PageHeader from '$lib/components/ui/PageHeader.svelte'
	import { t } from '$lib/i18n'
	import { viewport } from '$lib/scrollRoot.svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	let main: HTMLElement | undefined = $state()
	let feed: HTMLElement | undefined = $state()
	let feedTop = $state(0)

	function measure() {
		if (!feed || !viewport.scroller) return
		feedTop = feed.getBoundingClientRect().top + viewport.scroller.scrollTop
	}

	$effect(() => {
		viewport.viewW
		if (!main) return
		const ro = new ResizeObserver(measure)
		ro.observe(main)
		measure()
		void document.fonts?.ready.then(measure)
		return () => ro.disconnect()
	})
</script>

<main id="main" bind:this={main}>
	<div class="page-shell">
		<PageHeader label={t('work.label')} title={t('work.title')} lead={t('work.lead')} />
		<div bind:this={feed} class="grid w-full grid-cols-1 gap-3 pb-24 md:grid-cols-2">
			{#each data.projects as project, i (project._id)}
				<ProjectCard {project} index={i} topOffset={feedTop} wideFirst={false} />
			{/each}
		</div>
	</div>
</main>
