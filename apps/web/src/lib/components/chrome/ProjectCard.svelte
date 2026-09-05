<script lang="ts">
	import { loadWhenNear } from '$lib/actions/loadWhenNear'
	import { tilt } from '$lib/actions/tilt'
	import CardMeta from '$lib/components/ui/CardMeta.svelte'
	import { subscribeMedia } from '$lib/motion'
	import { collapseRange, mapRange } from '$lib/scroll'
	import { metrics, viewport } from '$lib/scrollRoot.svelte'
	import { projectCssVars, projectSurface } from '$lib/theme'
	import type { ProjectCard } from '$lib/sanity/types'

	let {
		project,
		index = 0,
		topOffset = 0
	}: { project: ProjectCard; index?: number; topOffset?: number } = $props()

	let hovering = $state(false)
	let near = $state(false)
	let reduced = $state(false)

	$effect(() => subscribeMedia('(prefers-reduced-motion: reduce)', (matches) => (reduced = matches)))

	const isFirst = $derived(index === 0)
	const m = $derived(metrics())
	const cardHeight = $derived(isFirst ? m.first : m.normal)
	const range = $derived(collapseRange(index, cardHeight, m, topOffset))
	const collapse = $derived(mapRange(viewport.scrollY, range.start, range.end, 1, 0))
	const visualH = $derived(Math.max(0, collapse * cardHeight))
	const imageY = $derived(-(1 - collapse) * cardHeight)
	const labelOpacity = $derived(mapRange(collapse, 0.2, 0.1, 1, 0))
	const showVideo = $derived(
		Boolean(project.previewVideo?.url) &&
			!reduced &&
			(isFirst || (hovering && near))
	)
	const surface = $derived(projectSurface(project))
</script>

<div
	class="pointer-events-none sticky top-4 overflow-hidden"
	class:col-span-full={isFirst && m.wideFirst}
	style:height="{cardHeight}px"
>
	<div
		class="pointer-events-auto relative overflow-hidden rounded-home-card"
		style="{projectCssVars(project)}; height:{visualH}px; background:{surface.background}; color:{surface.color}"
		use:tilt
		use:loadWhenNear={() => (near = true)}
	>
		<a
			href={project.externalUrl}
			class="project-card-link relative block h-full"
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
				<div class="relative h-full w-full">
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
					{/if}
				</div>
			</div>

			<div
				class="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-3"
				style:opacity={labelOpacity}
			>
				<div class="min-w-0">
					<CardMeta title={project.title} />
				</div>
				{#if project.year != null}
					<div class="shrink-0">
						<CardMeta title={String(project.year)} />
					</div>
				{/if}
			</div>
		</a>
	</div>
</div>
