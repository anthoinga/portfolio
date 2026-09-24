<script lang="ts">
	import DemoCard from '$lib/components/chrome/DemoCard.svelte'
	import ProjectCard from '$lib/components/chrome/ProjectCard.svelte'
	import { feedEndDemo, uiDemos } from '$lib/data/uiDemos'
	import { homeRail } from '$lib/homeRail.svelte'
	import { HOME } from '$lib/scroll'
	import { viewport } from '$lib/scrollRoot.svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	const topOffset = $derived(viewport.viewW >= HOME.lg ? 0 : homeRail.height)

	/**
	 * Checkerboard after the hero so demos don't stack in one column:
	 * row: case | demo, then demo | case, then case | demo…
	 */
	const feed = $derived.by(() => {
		const items: (
			| { kind: 'project'; key: string; project: PageData['projects'][number] }
			| { kind: 'demo'; key: string; demo: (typeof uiDemos)[number] }
		)[] = []
		const projects = data.projects
		if (projects.length) {
			items.push({ kind: 'project', key: projects[0]._id, project: projects[0] })

			let pi = 1
			let di = 0
			let caseFirst = true
			while (pi < projects.length || di < uiDemos.length) {
				const pushProject = () => {
					if (pi >= projects.length) return
					items.push({ kind: 'project', key: projects[pi]._id, project: projects[pi] })
					pi += 1
				}
				const pushDemo = () => {
					if (di >= uiDemos.length) return
					const demo = uiDemos[di]
					items.push({ kind: 'demo', key: `demo-${demo.id}`, demo })
					di += 1
				}
				if (caseFirst) {
					pushProject()
					pushDemo()
				} else {
					pushDemo()
					pushProject()
				}
				caseFirst = !caseFirst
			}
		}
		items.push({ kind: 'demo', key: `demo-${feedEndDemo.id}`, demo: feedEndDemo })
		return items
	})
</script>

<section class="mb-4">
	<div class="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
		{#each feed as item, i (item.key)}
			{#if item.kind === 'project'}
				<ProjectCard project={item.project} index={i} {topOffset} />
			{:else}
				<DemoCard demo={item.demo} index={i} {topOffset} />
			{/if}
		{/each}
	</div>
</section>
