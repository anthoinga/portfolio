<script lang="ts">
	import { loadWhenNear } from '$lib/actions/loadWhenNear'
	import { tilt } from '$lib/actions/tilt'
	import { subscribeMedia } from '$lib/motion'
	import { collapseRange, mapRange, navMemory, rememberCard } from '$lib/scroll'
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
	let root: HTMLElement | undefined = $state()

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
		{#snippet body()}
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
							class="h-full w-full object-cover object-center"
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
					<div class="card-title-pill">{project.title}</div>
				</div>
				{#if project.year != null}
					<div class="shrink-0">
						<div class="card-title-pill">{project.year}</div>
					</div>
				{/if}
			</div>
		{/snippet}

		<a
			bind:this={root}
			href="/projects/{project.slug}"
			class="project-card-link relative block h-full"
			data-cursor="case-study"
			data-sveltekit-noscroll
			aria-label={project.title}
			onmouseenter={() => (hovering = true)}
			onmouseleave={() => (hovering = false)}
			onclick={() => {
				if (root) rememberCard(root, project.slug)
				navMemory.workspaceScroll = viewport.scrollY
			}}
		>
			{@render body()}
		</a>
	</div>
</div>

<style>
	.card-title-pill {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		max-width: 100%;
		height: 40px;
		padding: 0 16px;
		overflow: hidden;
		border: 1px solid rgb(255 255 255 / 0.14);
		border-radius: 999px;
		background: color-mix(in srgb, var(--accent) 18%, rgb(22 22 22 / 0.94));
		color: #fff;
		font-family: var(--font-sans);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.12em;
		line-height: 1;
		white-space: nowrap;
		text-transform: uppercase;
		text-overflow: ellipsis;
		transition:
			opacity 220ms var(--ease),
			transform 420ms var(--ease),
			background 280ms var(--ease),
			border-color 280ms var(--ease),
			color 280ms var(--ease);
	}

	@media (hover: hover) and (pointer: fine) {
		.card-title-pill {
			opacity: 0;
			transform: translate3d(0, 6px, 0);
		}

		:global(.project-card-link:hover) .card-title-pill,
		:global(.project-card-link:focus-visible) .card-title-pill {
			opacity: 1;
			transform: none;
		}
	}

	@media (prefers-contrast: more) {
		.card-title-pill {
			border-color: rgb(255 255 255 / 0.85);
			background: #161616;
		}
	}

	@media (forced-colors: active) {
		.card-title-pill {
			background: Canvas;
			border: 2px solid CanvasText;
			color: CanvasText;
		}
	}
</style>
