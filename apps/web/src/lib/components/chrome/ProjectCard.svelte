<script lang="ts">
	import { followPointer } from '$lib/actions/followPointer'
	import { loadWhenNear } from '$lib/actions/loadWhenNear'
	import { tilt } from '$lib/actions/tilt'
	import CardMeta from '$lib/components/ui/CardMeta.svelte'
	import { collapseRange, mapRange } from '$lib/scroll'
	import { metrics, viewport } from '$lib/scrollRoot.svelte'
	import { projectCssVars, projectSurface } from '$lib/theme'
	import type { ProjectCard } from '$lib/sanity/types'

	let {
		project,
		preload = false,
		index = 0,
		topOffset = 0
	}: { project: ProjectCard; preload?: boolean; index?: number; topOffset?: number } = $props()

	let hovering = $state(false)
	let near = $state(false)

	const isFirst = $derived(index === 0)
	const m = $derived(metrics())
	const cardHeight = $derived(isFirst ? m.first : m.normal)
	const range = $derived(collapseRange(index, cardHeight, m, topOffset))
	const collapse = $derived(mapRange(viewport.scrollY, range.start, range.end, 1, 0))
	const visualH = $derived(Math.max(0, collapse * cardHeight))
	const imageY = $derived(-(1 - collapse) * cardHeight)
	const labelOpacity = $derived(mapRange(collapse, 0.2, 0.1, 1, 0))
	const wide = $derived(isFirst && m.wideFirst)
	const showVideo = $derived(Boolean(project.previewVideo?.url) && (isFirst || hovering) && (preload || near || isFirst))
	const surface = $derived(projectSurface(project))
</script>

<div
	class="pointer-events-none sticky top-4 overflow-hidden"
	style:height="{cardHeight}px"
	style:grid-column={wide ? '1 / 3' : 'auto'}
>
	<div
		class="card-depth pointer-events-auto relative overflow-hidden rounded-media"
		data-scheme={project.colorScheme}
		style="{projectCssVars(project)}; height:{visualH}px; background:{surface.background}; color:{surface.color}"
		use:tilt
		use:followPointer
		use:loadWhenNear={() => (near = true)}
	>
		<div
			class="card-shade pointer-events-none absolute inset-x-0 top-0"
			style:height="{cardHeight}px"
			aria-hidden="true"
		></div>
		<div
			class="card-grain pointer-events-none absolute inset-x-0 top-0"
			style:height="{cardHeight}px"
			aria-hidden="true"
		></div>
		<a
			href={project.externalUrl}
			class="block h-full"
			data-cursor="case-study"
			target="_blank"
			rel="noopener noreferrer"
			aria-label="{project.title}, opens in a new tab"
			onmouseenter={() => (hovering = true)}
			onmouseleave={() => (hovering = false)}
		>
			<div
				class="absolute inset-x-0 top-0 overflow-hidden"
				style:height="{cardHeight}px"
				style:transform="translateY({imageY}px)"
			>
				<div data-follow class="relative h-full w-full">
					{#if project.poster?.url}
						<img
							src={project.poster.url}
							alt=""
							class="h-full w-full object-contain object-center p-[8%]"
							class:opacity-0={showVideo}
						/>
					{/if}
					{#if showVideo}
						<video
							class="absolute inset-0 h-full w-full origin-center scale-110 object-cover object-center"
							src={project.previewVideo?.url}
							muted
							loop
							playsinline
							autoplay
							controlslist="nodownload noremoteplayback"
							disablepictureinpicture
							preload={isFirst ? 'auto' : 'metadata'}
						></video>
					{:else if !project.poster?.url}
						<div
							class="ambient-placeholder pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply"
							style="background: radial-gradient(circle at 30% 18%, {project.colorAccent}, transparent 58%)"
						></div>
					{/if}
				</div>
			</div>

			<CardMeta title={project.title} opacity={labelOpacity} />
		</a>
	</div>
</div>
