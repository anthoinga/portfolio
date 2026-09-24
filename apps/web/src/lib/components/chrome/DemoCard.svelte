<script lang="ts">
	import { autoplayInline } from '$lib/actions/autoplayInline'
	import type { UiDemo } from '$lib/data/uiDemos'
	import DockMenu from '$lib/components/chrome/DockMenu.svelte'
	import DitherCards from '$lib/components/chrome/DitherCards.svelte'
	import WeatherForecast from '$lib/components/chrome/WeatherForecast.svelte'
	import dockBg from '$lib/assets/dock-bg.jpg?url'
	import weatherBg from '$lib/assets/weather-mountains.jpg?url'
	import { subscribeMedia } from '$lib/motion'
	import { collapseRange, mapRange } from '$lib/scroll'
	import { metrics, viewport } from '$lib/scrollRoot.svelte'
	import { projectCssVars, projectSurface } from '$lib/theme'

	let {
		demo,
		index = 0,
		topOffset = 0
	}: { demo: UiDemo; index?: number; topOffset?: number } = $props()

	let weatherOpen = $state(false)
	let reduced = $state(false)

	$effect(() => subscribeMedia('(prefers-reduced-motion: reduce)', (matches) => (reduced = matches)))

	const m = $derived(metrics())
	const cardHeight = $derived(m.normal)
	const range = $derived(collapseRange(index, cardHeight, m, topOffset))
	const collapse = $derived(mapRange(viewport.scrollY, range.start, range.end, 1, 0))
	const visualH = $derived(Math.max(0, collapse * cardHeight))
	const imageY = $derived(-(1 - collapse) * cardHeight)
	const surface = $derived(projectSurface(demo))
	const vars = $derived(projectCssVars(demo))
	const softTouch = $derived(
		demo.id === 'weather' || demo.id === 'dither' || demo.id === 'dock' || Boolean(demo.video)
	)
	const hint = $derived(demo.id === 'weather' ? 'Tap to expand' : '')
	const stagePhoto = $derived(
		demo.id === 'dock' ? `url(${dockBg})` : demo.id === 'weather' ? `url(${weatherBg})` : undefined
	)
</script>

<div class="pointer-events-none sticky top-4 overflow-hidden" style:height="{cardHeight}px">
	<svelte:element
		this={demo.href ? 'a' : 'div'}
		class="pointer-events-auto relative block overflow-hidden rounded-home-card"
		href={demo.href}
		target={demo.href ? '_blank' : undefined}
		rel={demo.href ? 'noopener noreferrer' : undefined}
		data-cursor={demo.href ? 'visit-demo' : undefined}
		aria-label={demo.href ? 'Visit demo' : undefined}
		style="{vars}; height:{visualH}px; background:{surface.background}; color:{surface.color}"
	>
		<div
			class="demo-window relative h-full w-full"
			class:is-soft={softTouch}
			style:height="{cardHeight}px"
			style:transform="translateY({imageY}px)"
			role="group"
			aria-label="{demo.title} demo"
		>
			<div
				class="demo-stage"
				class:is-dither={demo.id === 'dither'}
				class:has-photo={demo.id === 'dock' || demo.id === 'weather'}
				class:has-video={Boolean(demo.video)}
				style:--photo={stagePhoto}
			>
				{#if demo.video}
					{#if reduced}
						<img class="demo-bg" src={demo.poster} alt="" />
					{:else}
						<video
							class="demo-bg"
							src={demo.video}
							poster={demo.poster}
							muted
							loop
							playsinline
							autoplay
							controlslist="nodownload noremoteplayback"
							disablepictureinpicture
							preload="metadata"
							use:autoplayInline
						></video>
					{/if}
				{/if}
				{#if demo.id === 'dock'}
					<DockMenu />
				{:else if demo.id === 'dither'}
					<DitherCards />
				{:else if demo.id === 'weather'}
					<WeatherForecast bind:open={weatherOpen} />
				{/if}
				{#if hint && (demo.id !== 'weather' || !weatherOpen) && demo.id !== 'dock'}
					<div class="demo-hint">{hint}</div>
				{/if}
			</div>
		</div>
	</svelte:element>
</div>

<style>
	.demo-window {
		touch-action: none;
	}

	.demo-window.is-soft {
		touch-action: manipulation;
	}

	.demo-stage {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		overflow: hidden;
		padding: 1rem;
		background:
			radial-gradient(ellipse 80% 60% at 50% 40%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%),
			var(--bg);
	}

	.demo-stage.is-dither {
		padding: 0;
		background: #fff;
	}

	.demo-stage.has-photo {
		background: var(--photo) center / cover no-repeat;
	}

	.demo-stage.has-video {
		padding: 0;
		background: #12080c;
	}

	.demo-bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.demo-hint {
		position: absolute;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		padding: 0.45rem 0.85rem;
		border-radius: 999px;
		border: 1px solid rgb(255 255 255 / 0.12);
		background: rgb(22 22 22 / 0.72);
		color: #fff;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		white-space: nowrap;
		pointer-events: none;
	}
</style>
